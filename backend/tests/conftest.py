import pytest
from fastapi.testclient import TestClient

from app.inference import Classifier
from app.main import create_app
from app.model_state import ModelState
from helpers import FakeSession, make_settings


@pytest.fixture
def fake_session() -> FakeSession:
    return FakeSession()


@pytest.fixture
def client(fake_session: FakeSession):
    state = ModelState(classifier=Classifier(fake_session))
    with TestClient(create_app(make_settings(), model_state=state)) as test_client:
        yield test_client


@pytest.fixture
def unavailable_client():
    with TestClient(create_app(make_settings(), model_state=ModelState(classifier=None))) as test_client:
        yield test_client
