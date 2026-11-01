import pytest

from app.validation import MIN_SIDE_PIXELS, validate_upload
from app.errors import AppError
from helpers import make_image_bytes

MAX = 2 * 1024 * 1024


def _expect_error(code: str, status: int, **kwargs):
    with pytest.raises(AppError) as info:
        validate_upload(**kwargs)
    assert info.value.code == code
    assert info.value.status_code == status
    return info.value


def test_accepts_valid_jpeg_and_reports_dimensions():
    result = validate_upload("eye.jpg", "image/jpeg", make_image_bytes("JPEG", (400, 300)), MAX)
    assert result.format == "JPEG"
    assert (result.width, result.height) == (400, 300)
    assert result.size_bytes > 0


def test_accepts_valid_png():
    png = make_image_bytes("PNG", (300, 300))
    result = validate_upload("eye.png", "image/png", png, MAX)
    assert result.format == "PNG"


def test_rejects_unsupported_extension():
    _expect_error("unsupported_format", 400, filename="eye.gif", content_type="image/png", data=make_image_bytes("PNG"), max_bytes=MAX)


def test_rejects_unsupported_content_type():
    _expect_error("unsupported_format", 400, filename="eye.png", content_type="application/pdf", data=make_image_bytes("PNG"), max_bytes=MAX)


def test_rejects_extension_and_content_type_that_disagree():
    _expect_error("unsupported_format", 400, filename="eye.jpg", content_type="image/png", data=make_image_bytes("PNG"), max_bytes=MAX)


def test_rejects_missing_filename():
    _expect_error("unsupported_format", 400, filename=None, content_type="image/png", data=make_image_bytes("PNG"), max_bytes=MAX)


def test_rejects_empty_file():
    _expect_error("empty_file", 400, filename="eye.png", content_type="image/png", data=b"", max_bytes=MAX)


def test_rejects_file_over_size_limit():
    data = make_image_bytes("PNG", (800, 800))
    _expect_error("file_too_large", 413, filename="eye.png", content_type="image/png", data=data, max_bytes=len(data) - 1)


def test_rejects_corrupt_bytes_with_image_extension():
    _expect_error("invalid_image", 400, filename="eye.png", content_type="image/png", data=b"\x89PNG\r\n\x1a\n" + b"garbage" * 50, max_bytes=MAX)


def test_rejects_contents_that_do_not_match_declared_type():
    _expect_error("invalid_image", 400, filename="eye.jpg", content_type="image/jpeg", data=make_image_bytes("PNG"), max_bytes=MAX)


def test_rejects_image_smaller_than_model_input():
    small = make_image_bytes("PNG", (MIN_SIDE_PIXELS - 1, 400))
    _expect_error("image_too_small", 400, filename="eye.png", content_type="image/png", data=small, max_bytes=MAX)


def test_rejects_image_with_excessive_pixel_count(monkeypatch):
    import app.validation as validation

    monkeypatch.setattr(validation, "MAX_PIXELS", 10_000)
    _expect_error("image_dimensions_too_large", 400, filename="eye.png", content_type="image/png", data=make_image_bytes("PNG", (300, 300)), max_bytes=MAX)
