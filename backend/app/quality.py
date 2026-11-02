from dataclasses import dataclass
from typing import Literal

import numpy as np
from PIL import Image

ANALYSIS_SHORT_SIDE = 512

MEAN_BRIGHTNESS_LABEL = "Overall brightness"
SHARPNESS_LABEL = "Sharpness"

QUALITY_NOTE = (
    "These are preliminary technical checks on brightness and sharpness only. They do not establish whether the "
    "photograph is clinically adequate for screening, and a passed check does not mean the image is suitable for a "
    "diagnosis."
)


@dataclass(frozen=True)
class QualityThresholds:
    min_mean_brightness: float
    max_mean_brightness: float
    min_sharpness: float


@dataclass(frozen=True)
class QualityCheck:
    code: str
    label: str
    status: Literal["passed", "failed"]
    value: float
    message: str


@dataclass(frozen=True)
class QualityAssessment:
    checks: tuple[QualityCheck, ...]

    @property
    def passed(self) -> bool:
        return all(check.status == "passed" for check in self.checks)

    @property
    def failed_checks(self) -> tuple[QualityCheck, ...]:
        return tuple(check for check in self.checks if check.status == "failed")


def _analysis_luma(image: Image.Image) -> np.ndarray:
    gray = image.convert("L")
    width, height = gray.size
    scale = min(1.0, ANALYSIS_SHORT_SIDE / min(width, height))
    if scale < 1.0:
        gray = gray.resize((round(width * scale), round(height * scale)), Image.Resampling.BILINEAR)
    return np.asarray(gray, dtype=np.float32)


def _laplacian_variance(luma: np.ndarray) -> float:
    interior = luma[1:-1, 1:-1]
    laplacian = (
        4.0 * interior
        - luma[:-2, 1:-1]
        - luma[2:, 1:-1]
        - luma[1:-1, :-2]
        - luma[1:-1, 2:]
    )
    return float(laplacian.var())


def assess_quality(image: Image.Image, thresholds: QualityThresholds) -> QualityAssessment:
    luma = _analysis_luma(image)

    mean_brightness = float(luma.mean())
    if mean_brightness < thresholds.min_mean_brightness:
        brightness = QualityCheck(
            code="too_dark",
            label=MEAN_BRIGHTNESS_LABEL,
            status="failed",
            value=round(mean_brightness, 1),
            message="The image is too dark for a reliable analysis. Try a brighter, evenly lit photograph.",
        )
    elif mean_brightness > thresholds.max_mean_brightness:
        brightness = QualityCheck(
            code="too_bright",
            label=MEAN_BRIGHTNESS_LABEL,
            status="failed",
            value=round(mean_brightness, 1),
            message="The image is too bright or overexposed. Try a photograph with less glare or flash.",
        )
    else:
        brightness = QualityCheck(
            code="brightness_ok",
            label=MEAN_BRIGHTNESS_LABEL,
            status="passed",
            value=round(mean_brightness, 1),
            message="Overall brightness is within the accepted range.",
        )

    sharpness_value = _laplacian_variance(luma)
    if sharpness_value < thresholds.min_sharpness:
        sharpness = QualityCheck(
            code="blurred",
            label=SHARPNESS_LABEL,
            status="failed",
            value=round(sharpness_value, 1),
            message="The image appears blurred or out of focus. Try a sharper photograph.",
        )
    else:
        sharpness = QualityCheck(
            code="sharpness_ok",
            label=SHARPNESS_LABEL,
            status="passed",
            value=round(sharpness_value, 1),
            message="Image sharpness is within the accepted range.",
        )

    return QualityAssessment(checks=(brightness, sharpness))
