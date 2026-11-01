from pathlib import Path
from typing import Any

import numpy as np
import onnxruntime as ort
from PIL import Image

from app.model_info import GRADE_LABELS, IMAGENET_MEAN, IMAGENET_STD, INPUT_NAME, INPUT_SIZE, OUTPUT_NAME

_MEAN = np.asarray(IMAGENET_MEAN, dtype=np.float32)
_STD = np.asarray(IMAGENET_STD, dtype=np.float32)


def preprocess(image: Image.Image) -> np.ndarray:
    rgb = image.convert("RGB")
    width, height = rgb.size
    scale = INPUT_SIZE / min(width, height)
    rgb = rgb.resize((round(width * scale), round(height * scale)), Image.Resampling.BILINEAR)
    width, height = rgb.size
    left = (width - INPUT_SIZE) // 2
    top = (height - INPUT_SIZE) // 2
    rgb = rgb.crop((left, top, left + INPUT_SIZE, top + INPUT_SIZE))
    pixels = np.asarray(rgb, dtype=np.float32) / 255.0
    pixels = (pixels - _MEAN) / _STD
    return pixels.transpose(2, 0, 1)[np.newaxis].astype(np.float32)


def softmax(logits: np.ndarray) -> np.ndarray:
    shifted = np.exp(logits - logits.max())
    return shifted / shifted.sum()


class Classifier:
    def __init__(self, session: Any):
        self._session = session

    def probabilities(self, image: Image.Image) -> list[float]:
        logits = self._session.run([OUTPUT_NAME], {INPUT_NAME: preprocess(image)})[0]
        values = np.asarray(logits, dtype=np.float64).reshape(-1)
        if values.shape != (len(GRADE_LABELS),) or not np.all(np.isfinite(values)):
            raise ValueError("Model returned an unexpected output shape or non-finite values.")
        return [float(p) for p in softmax(values)]


def load_classifier(model_path: Path) -> Classifier:
    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    return Classifier(session)
