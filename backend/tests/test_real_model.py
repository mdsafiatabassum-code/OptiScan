
from io import BytesIO
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.config import Settings
from app.inference import load_classifier
from app.main import create_app
from app.model_info import GRADE_LABELS, MODEL_DEFAULT_SHA256
from app.model_state import ModelState, load_model_state
from helpers import make_image_bytes

MODEL_PATH = os.getenv("OPTISCAN_TEST_MODEL_PATH")

pytestmark = pytest.mark.skipif(
    not MODEL_PATH or not Path(MODEL_PATH).is_file(),
    reason="Set OPTISCAN_TEST_MODEL_PATH to a downloaded model.onnx to run real inference tests.",
)


def _settings(model_path: Path) -> Settings:
    return Settings(
        allowed_origins=("http://localhost:5173",),
        model_path=model_path,
        model_url=None,
        model_sha256=MODEL_DEFAULT_SHA256,
        max_upload_bytes=10 * 1024 * 1024,
    )


def test_real_model_loads_with_pinned_checksum():
    state = load_model_state(_settings(Path(MODEL_PATH)))
    assert state.is_loaded


def test_real_model_produces_normalised_probabilities():
    classifier = load_classifier(Path(MODEL_PATH))
    image = Image.open(BytesIO(make_image_bytes("PNG", (640, 480))))
    probabilities = classifier.probabilities(image)
    assert len(probabilities) == len(GRADE_LABELS)
    assert abs(sum(probabilities) - 1.0) < 1e-6
    assert all(0.0 <= p <= 1.0 for p in probabilities)


def test_end_to_end_analysis_with_real_model():
    state = ModelState(classifier=load_classifier(Path(MODEL_PATH)))
    with TestClient(create_app(_settings(Path(MODEL_PATH)), model_state=state)) as client:
        response = client.post(
            "/api/v1/analyses",
            files={"file": ("sample.png", make_image_bytes("PNG", (640, 480)), "image/png")},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["predictedGrade"]["label"] in GRADE_LABELS
    assert [item["label"] for item in body["probabilities"]] == list(GRADE_LABELS)
    assert body["explainability"]["status"] == "pending"
