from io import BytesIO

from PIL import Image, ImageFilter

from app.quality import QualityThresholds, assess_quality
from helpers import make_image_bytes

DEFAULT_THRESHOLDS = QualityThresholds(min_mean_brightness=25.0, max_mean_brightness=235.0, min_sharpness=5.0)


def _open(data: bytes) -> Image.Image:
    return Image.open(BytesIO(data))


def _status_by_code(assessment) -> dict[str, str]:
    return {check.code: check.status for check in assessment.checks}


def test_textured_image_passes_both_checks():
    assessment = assess_quality(_open(make_image_bytes("JPEG")), DEFAULT_THRESHOLDS)
    assert assessment.passed
    assert _status_by_code(assessment) == {"brightness_ok": "passed", "sharpness_ok": "passed"}


def test_very_dark_image_fails_brightness_check():
    assessment = assess_quality(_open(make_image_bytes("JPEG", offset=-115)), DEFAULT_THRESHOLDS)
    assert not assessment.passed
    assert [check.code for check in assessment.failed_checks] == ["too_dark"]
    assert assessment.failed_checks[0].value < DEFAULT_THRESHOLDS.min_mean_brightness


def test_overexposed_image_fails_brightness_check():
    assessment = assess_quality(_open(make_image_bytes("JPEG", offset=130)), DEFAULT_THRESHOLDS)
    assert not assessment.passed
    assert [check.code for check in assessment.failed_checks] == ["too_bright"]


def test_strongly_blurred_image_fails_sharpness_check():
    sharp = _open(make_image_bytes("PNG", (640, 480)))
    blurred = BytesIO()
    sharp.filter(ImageFilter.GaussianBlur(radius=8)).save(blurred, format="PNG")
    assessment = assess_quality(_open(blurred.getvalue()), DEFAULT_THRESHOLDS)
    assert [check.code for check in assessment.failed_checks] == ["blurred"]


def test_thresholds_are_applied_from_configuration():
    strict = QualityThresholds(min_mean_brightness=200.0, max_mean_brightness=235.0, min_sharpness=5.0)
    assessment = assess_quality(_open(make_image_bytes("JPEG")), strict)
    assert [check.code for check in assessment.failed_checks] == ["too_dark"]
