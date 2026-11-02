from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ModelInfo(CamelModel):
    name: str
    version: str
    source: str
    license: str
    intended_use: str


class PredictedGrade(CamelModel):
    index: int
    label: str
    clinical_scale: str
    description: str


class ClassProbability(CamelModel):
    index: int
    label: str
    probability: float


class ImageSummary(CamelModel):
    format: str
    size_bytes: int
    width: int
    height: int


class QualityCheckResult(CamelModel):
    code: str
    label: str
    status: Literal["passed", "failed"]
    value: float
    message: str


class ImageQuality(CamelModel):
    status: Literal["passed"]
    checks: list[QualityCheckResult]
    note: str


class Explainability(CamelModel):
    status: Literal["pending"]
    method: None
    note: str


class ScreeningReport(CamelModel):
    report_id: str
    generated_at: datetime
    status: Literal["completed"]
    model: ModelInfo
    predicted_grade: PredictedGrade
    probabilities: list[ClassProbability]
    explanation: str
    limitations: list[str]
    next_steps: list[str]
    disclaimer: str
    image: ImageSummary
    quality: ImageQuality
    explainability: Explainability


class HealthModelStatus(CamelModel):
    loaded: bool
    name: str


class HealthResponse(CamelModel):
    status: Literal["ok"]
    model: HealthModelStatus
