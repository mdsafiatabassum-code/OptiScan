import logging
from dataclasses import dataclass

from app.config import Settings
from app.inference import Classifier, load_classifier
from app.model_store import ensure_model_file

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ModelState:
    classifier: Classifier | None

    @property
    def is_loaded(self) -> bool:
        return self.classifier is not None


def load_model_state(settings: Settings) -> ModelState:
    try:
        path = ensure_model_file(settings.model_path, settings.model_url, settings.model_sha256)
        return ModelState(classifier=load_classifier(path))
    except Exception:
        logger.exception("The analysis model could not be loaded; analysis requests will be refused")
        return ModelState(classifier=None)
