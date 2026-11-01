import hashlib
from pathlib import Path

import pytest

from app.model_store import ModelLoadError, ensure_model_file, sha256_of


def test_existing_file_with_matching_checksum_is_used_without_download(tmp_path: Path):
    model = tmp_path / "model.onnx"
    model.write_bytes(b"weights")
    expected = hashlib.sha256(b"weights").hexdigest()

    assert ensure_model_file(model, url=None, sha256=expected) == model
    assert sha256_of(model) == expected


def test_missing_file_without_url_raises(tmp_path: Path):
    with pytest.raises(ModelLoadError, match="no MODEL_URL"):
        ensure_model_file(tmp_path / "model.onnx", url=None, sha256=None)


def test_checksum_mismatch_without_url_raises(tmp_path: Path):
    model = tmp_path / "model.onnx"
    model.write_bytes(b"weights")
    with pytest.raises(ModelLoadError):
        ensure_model_file(model, url=None, sha256="0" * 64)
