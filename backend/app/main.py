import logging
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import Settings
from app.errors import AppError, error_body
from app.model_state import ModelState, load_model_state
from app.routes import analyses, health

logger = logging.getLogger("optiscan.api")

MULTIPART_OVERHEAD_BYTES = 64 * 1024


def create_app(settings: Settings | None = None, model_state: ModelState | None = None) -> FastAPI:
    settings = settings or Settings.from_env()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        app.state.model = model_state if model_state is not None else load_model_state(settings)
        yield

    app = FastAPI(title="OptiScan Analysis API", version="1.0.0", lifespan=lifespan)
    app.state.settings = settings

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Accept"],
    )

    @app.middleware("http")
    async def reject_oversized_requests(request: Request, call_next: Callable) -> JSONResponse:
        length = request.headers.get("content-length", "")
        if length.isdigit() and int(length) > settings.max_upload_bytes + MULTIPART_OVERHEAD_BYTES:
            return JSONResponse(
                status_code=413,
                content=error_body("file_too_large", "The upload is larger than the allowed size."),
            )
        return await call_next(request)

    @app.exception_handler(AppError)
    async def handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content=error_body(exc.code, exc.message))

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(_: Request, __: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content=error_body("missing_file", "Attach a retinal photograph (JPG, JPEG or PNG) as 'file'."),
        )

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_error(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "Request could not be processed."
        return JSONResponse(status_code=exc.status_code, content=error_body("http_error", message))

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled server error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content=error_body("internal_error", "An unexpected server error occurred. Please try again later."),
        )

    app.include_router(health.router)
    app.include_router(analyses.router)
    return app


app = create_app()
