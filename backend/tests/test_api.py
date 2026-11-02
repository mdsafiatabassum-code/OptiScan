import math

from fastapi.testclient import TestClient

from app.inference import Classifier
from app.main import create_app
from app.model_info import GRADE_LABELS
from app.model_state import ModelState
from helpers import FakeSession, make_image_bytes, make_settings

ANALYSE_URL = "/api/v1/analyses"


def _upload(client, data: bytes, filename="eye.jpg", content_type="image/jpeg"):
    return client.post(ANALYSE_URL, files={"file": (filename, data, content_type)})


def test_health_reports_model_loaded(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "model": {"loaded": True, "name": "fundusnap-v1-severitycls-rn34-22m"}}


def test_health_reports_model_unavailable(unavailable_client):
    response = unavailable_client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["model"]["loaded"] is False


def test_successful_analysis_returns_model_output_only(client, fake_session):
    response = _upload(client, make_image_bytes("JPEG"))
    assert response.status_code == 200
    body = response.json()

    assert fake_session.calls == 1
    assert body["status"] == "completed"
    assert body["predictedGrade"]["index"] == 2
    assert body["predictedGrade"]["label"] == GRADE_LABELS[2]
    assert body["predictedGrade"]["clinicalScale"] == "ICDR"

    probabilities = [item["probability"] for item in body["probabilities"]]
    assert [item["label"] for item in body["probabilities"]] == list(GRADE_LABELS)
    assert math.isclose(sum(probabilities), 1.0, abs_tol=1e-3)
    assert probabilities[2] == max(probabilities)

    assert body["explainability"] == {"status": "pending", "method": None, "note": body["explainability"]["note"]}
    assert body["image"] == {"format": "JPEG", "sizeBytes": body["image"]["sizeBytes"], "width": 320, "height": 240}
    assert "filename" not in body["image"]
    assert body["quality"]["status"] == "passed"
    assert [check["code"] for check in body["quality"]["checks"]] == ["brightness_ok", "sharpness_ok"]
    assert all(check["status"] == "passed" for check in body["quality"]["checks"])
    assert body["quality"]["note"]
    assert body["disclaimer"]
    assert body["limitations"]
    assert body["nextSteps"]
    assert body["generatedAt"]
    assert body["reportId"]


def test_analysis_rejects_unsuitable_image_before_inference(client, fake_session):
    response = _upload(client, make_image_bytes("JPEG", offset=-115))
    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "image_quality_failed"
    assert "predictedGrade" not in body
    assert body["error"]["details"]["checks"] == [
        {
            "code": "too_dark",
            "label": "Overall brightness",
            "status": "failed",
            "message": "The image is too dark for a reliable analysis. Try a brighter, evenly lit photograph.",
        }
    ]
    assert fake_session.calls == 0


def test_analysis_rejects_unsupported_format(client, fake_session):
    response = _upload(client, b"GIF89a....", filename="eye.gif", content_type="image/gif")
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "unsupported_format"
    assert fake_session.calls == 0


def test_analysis_rejects_corrupt_image(client):
    response = _upload(client, b"\xff\xd8\xff" + b"not really a jpeg" * 20)
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "invalid_image"


def test_analysis_rejects_oversized_upload_before_reading_it(client):
    response = client.post(
        ANALYSE_URL,
        files={"file": ("eye.jpg", b"0" * (11 * 1024 * 1024), "image/jpeg")},
    )
    assert response.status_code == 413
    assert response.json()["error"]["code"] == "file_too_large"


def test_analysis_rejects_missing_file_field(client):
    response = client.post(ANALYSE_URL, data={"note": "no file"})
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "missing_file"


def test_analysis_returns_503_when_model_unavailable(unavailable_client):
    response = _upload(unavailable_client, make_image_bytes("JPEG"))
    assert response.status_code == 503
    body = response.json()
    assert body["error"]["code"] == "model_unavailable"
    assert "predictedGrade" not in body
    assert "probabilities" not in body


def test_analysis_returns_500_without_leaking_details_when_inference_fails():
    session = FakeSession(error=RuntimeError("secret internal trace /models/private"))
    state = ModelState(classifier=Classifier(session))
    with TestClient(create_app(make_settings(), model_state=state)) as client:
        response = _upload(client, make_image_bytes("JPEG"))

    assert response.status_code == 500
    body = response.json()
    assert body["error"]["code"] == "inference_failed"
    assert "secret" not in response.text
    assert "predictedGrade" not in body


def test_analysis_returns_500_for_non_finite_model_output():
    session = FakeSession(logits=[float("nan"), 0, 0, 0, 0])
    state = ModelState(classifier=Classifier(session))
    with TestClient(create_app(make_settings(), model_state=state)) as client:
        response = _upload(client, make_image_bytes("JPEG"))

    assert response.status_code == 500
    assert response.json()["error"]["code"] == "inference_failed"


def test_cors_allows_configured_origin(client):
    response = client.options(
        ANALYSE_URL,
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_rejects_unknown_origin(client):
    response = client.options(
        ANALYSE_URL,
        headers={
            "Origin": "https://evil.example",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert "access-control-allow-origin" not in response.headers
