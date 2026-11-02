from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

from app.config import Settings

MAX_BYTES = 2 * 1024 * 1024


def make_image_bytes(
    fmt: str = "JPEG",
    size: tuple[int, int] = (320, 240),
    offset: float = 0.0,
) -> bytes:
    width, height = size
    xs = np.arange(width, dtype=np.float32)[np.newaxis, :]
    ys = np.arange(height, dtype=np.float32)[:, np.newaxis]
    texture = 128 + offset + 60 * np.sin(xs / 3.0) * np.cos(ys / 5.0)
    pixels = np.repeat(np.clip(texture, 0, 255)[..., np.newaxis], 3, axis=2).astype(np.uint8)
    buffer = BytesIO()
    Image.fromarray(pixels, mode="RGB").save(buffer, format=fmt)
    return buffer.getvalue()


class FakeSession:
    def __init__(self, logits: list[float] | None = None, error: Exception | None = None):
        self._logits = np.asarray(logits or [0.2, 0.1, 0.4, 0.1, 0.2], dtype=np.float32)
        self._error = error
        self.calls = 0

    def run(self, output_names, inputs):
        self.calls += 1
        if self._error is not None:
            raise self._error
        assert output_names == ["output"]
        assert inputs["input"].shape == (1, 3, 224, 224)
        assert inputs["input"].dtype == np.float32
        return [self._logits[np.newaxis]]


def make_settings(model_path: Path = Path("unused.onnx")) -> Settings:
    return Settings(
        allowed_origins=("http://localhost:5173",),
        model_path=model_path,
        model_url=None,
        model_sha256=None,
        max_upload_bytes=MAX_BYTES,
    )
