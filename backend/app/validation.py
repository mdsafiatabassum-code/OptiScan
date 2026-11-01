from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

from PIL import Image, UnidentifiedImageError

from app.errors import AppError

MIN_SIDE_PIXELS = 224
MAX_PIXELS = 25_000_000

_EXTENSION_FORMATS = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG"}
_CONTENT_TYPE_FORMATS = {"image/jpeg": "JPEG", "image/png": "PNG"}
_SIGNATURES = {"JPEG": b"\xff\xd8\xff", "PNG": b"\x89PNG\r\n\x1a\n"}
_UNSUPPORTED_MESSAGE = "Unsupported file type. Please upload a JPG, JPEG or PNG retinal photograph."


@dataclass(frozen=True)
class ValidatedImage:
    format: str
    width: int
    height: int
    size_bytes: int
    pixels: Image.Image


def _format_megabytes(size_bytes: int) -> str:
    return f"{size_bytes / (1024 * 1024):.1f}".rstrip("0").rstrip(".")


def validate_upload(
    filename: str | None,
    content_type: str | None,
    data: bytes,
    max_bytes: int,
) -> ValidatedImage:
    if not data:
        raise AppError(400, "empty_file", "The uploaded file is empty. Please choose a retinal photograph.")
    if len(data) > max_bytes:
        raise AppError(
            413,
            "file_too_large",
            f"The image is larger than the {_format_megabytes(max_bytes)} MB limit. Please upload a smaller file.",
        )

    expected = _EXTENSION_FORMATS.get(Path(filename or "").suffix.lower())
    declared = _CONTENT_TYPE_FORMATS.get((content_type or "").lower())
    if expected is None or declared != expected:
        raise AppError(400, "unsupported_format", _UNSUPPORTED_MESSAGE)

    if not data.startswith(_SIGNATURES[expected]):
        raise AppError(400, "invalid_image", "The file contents do not match a valid image of the declared type.")

    try:
        with Image.open(BytesIO(data)) as probe:
            probe.verify()
            actual = probe.format
        image = Image.open(BytesIO(data))
    except Image.DecompressionBombError as exc:
        raise AppError(400, "image_dimensions_too_large", "The image dimensions are too large to analyse.") from exc
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as exc:
        raise AppError(400, "invalid_image", "The file could not be read as a valid image.") from exc

    if actual != expected:
        raise AppError(400, "invalid_image", "The file contents do not match a valid image of the declared type.")

    width, height = image.size
    if min(width, height) < MIN_SIDE_PIXELS:
        raise AppError(
            400,
            "image_too_small",
            f"The image is too small. Please upload a photograph of at least {MIN_SIDE_PIXELS} pixels on its shorter side.",
        )
    if width * height > MAX_PIXELS:
        raise AppError(400, "image_dimensions_too_large", "The image dimensions are too large to analyse.")

    try:
        image.load()
    except (OSError, SyntaxError, ValueError) as exc:
        raise AppError(400, "invalid_image", "The file could not be read as a valid image.") from exc

    return ValidatedImage(
        format=expected,
        width=width,
        height=height,
        size_bytes=len(data),
        pixels=image,
    )
