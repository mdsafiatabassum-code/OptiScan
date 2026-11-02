import logging

from fastapi import APIRouter, File, Request, UploadFile

from app.config import Settings
from app.errors import AppError
from app.model_state import ModelState
from app.quality import QualityThresholds, assess_quality
from app.report import build_report
from app.schemas import ScreeningReport
from app.validation import validate_upload

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1")

MODEL_UNAVAILABLE_MESSAGE = (
    "The analysis model is not available on the server right now, so no report was generated. Please try again later."
)
INFERENCE_FAILED_MESSAGE = "The image could not be analysed, so no report was generated. Please try again."
QUALITY_REJECTED_MESSAGE = (
    "This photograph did not pass the technical quality checks, so no report was generated. "
    "Please replace it with a brighter, sharper photograph."
)


def _quality_thresholds(settings: Settings) -> QualityThresholds:
    return QualityThresholds(
        min_mean_brightness=settings.quality_min_mean_brightness,
        max_mean_brightness=settings.quality_max_mean_brightness,
        min_sharpness=settings.quality_min_sharpness,
    )


@router.post("/analyses", response_model=ScreeningReport)
def create_analysis(request: Request, file: UploadFile = File(...)) -> ScreeningReport:
    state: ModelState = request.app.state.model
    settings: Settings = request.app.state.settings
    if state.classifier is None:
        raise AppError(503, "model_unavailable", MODEL_UNAVAILABLE_MESSAGE)

    data = file.file.read(settings.max_upload_bytes + 1)
    image = validate_upload(file.filename, file.content_type, data, settings.max_upload_bytes)

    quality = assess_quality(image.pixels, _quality_thresholds(settings))
    if not quality.passed:
        raise AppError(
            422,
            "image_quality_failed",
            QUALITY_REJECTED_MESSAGE,
            details={
                "checks": [
                    {"code": check.code, "label": check.label, "status": check.status, "message": check.message}
                    for check in quality.failed_checks
                ]
            },
        )

    try:
        probabilities = state.classifier.probabilities(image.pixels)
    except Exception:
        logger.exception("Inference failed for an uploaded image")
        raise AppError(500, "inference_failed", INFERENCE_FAILED_MESSAGE) from None

    return build_report(probabilities, image, quality)
