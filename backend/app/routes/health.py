from fastapi import APIRouter, Request

from app.model_info import MODEL_NAME
from app.model_state import ModelState
from app.schemas import HealthModelStatus, HealthResponse

router = APIRouter()


@router.get("/api/health", response_model=HealthResponse)
def health(request: Request) -> HealthResponse:
    state: ModelState = request.app.state.model
    return HealthResponse(
        status="ok",
        model=HealthModelStatus(loaded=state.is_loaded, name=MODEL_NAME),
    )
