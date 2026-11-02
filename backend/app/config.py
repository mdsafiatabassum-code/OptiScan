import os
from dataclasses import dataclass
from pathlib import Path

from app.model_info import MODEL_DEFAULT_SHA256, MODEL_DEFAULT_URL

BACKEND_DIR = Path(__file__).resolve().parent.parent
DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
DEFAULT_MAX_UPLOAD_MB = 10

# Preliminary, uncalibrated defaults. Brightness is the mean grey level on a 0-255 scale; sharpness is the
# variance of a Laplacian filter on the grey image downscaled to at most 512 px on its shorter side.
# The low sharpness default only rejects strongly out-of-focus images. Calibrate on labelled photographs before relying on them.
DEFAULT_QUALITY_MIN_MEAN_BRIGHTNESS = 25.0
DEFAULT_QUALITY_MAX_MEAN_BRIGHTNESS = 235.0
DEFAULT_QUALITY_MIN_SHARPNESS = 5.0


@dataclass(frozen=True)
class Settings:
    allowed_origins: tuple[str, ...]
    model_path: Path
    model_url: str | None
    model_sha256: str | None
    max_upload_bytes: int
    quality_min_mean_brightness: float = DEFAULT_QUALITY_MIN_MEAN_BRIGHTNESS
    quality_max_mean_brightness: float = DEFAULT_QUALITY_MAX_MEAN_BRIGHTNESS
    quality_min_sharpness: float = DEFAULT_QUALITY_MIN_SHARPNESS

    @classmethod
    def from_env(cls) -> "Settings":
        origins = os.getenv("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
        max_mb = float(os.getenv("MAX_UPLOAD_MB", str(DEFAULT_MAX_UPLOAD_MB)))
        return cls(
            allowed_origins=tuple(origin.strip() for origin in origins.split(",") if origin.strip()),
            model_path=Path(os.getenv("MODEL_PATH", str(BACKEND_DIR / "models" / "model.onnx"))),
            model_url=os.getenv("MODEL_URL", MODEL_DEFAULT_URL).strip() or None,
            model_sha256=os.getenv("MODEL_SHA256", MODEL_DEFAULT_SHA256).strip() or None,
            max_upload_bytes=int(max_mb * 1024 * 1024),
            quality_min_mean_brightness=float(
                os.getenv("QUALITY_MIN_MEAN_BRIGHTNESS", str(DEFAULT_QUALITY_MIN_MEAN_BRIGHTNESS))
            ),
            quality_max_mean_brightness=float(
                os.getenv("QUALITY_MAX_MEAN_BRIGHTNESS", str(DEFAULT_QUALITY_MAX_MEAN_BRIGHTNESS))
            ),
            quality_min_sharpness=float(os.getenv("QUALITY_MIN_SHARPNESS", str(DEFAULT_QUALITY_MIN_SHARPNESS))),
        )
