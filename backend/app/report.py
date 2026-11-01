import uuid
from datetime import datetime, timezone

from app.model_info import (
    CLINICAL_SCALE,
    DISCLAIMER,
    GRADE_DESCRIPTIONS,
    GRADE_LABELS,
    LIMITATIONS,
    MODEL_INTENDED_USE,
    MODEL_LICENSE,
    MODEL_NAME,
    MODEL_SOURCE,
    MODEL_VERSION,
    NEXT_STEPS_BY_GRADE,
    SAFETY_NEXT_STEP,
)
from app.schemas import (
    ClassProbability,
    Explainability,
    ImageSummary,
    ModelInfo,
    PredictedGrade,
    ScreeningReport,
)
from app.validation import ValidatedImage

EXPLAINABILITY_NOTE = (
    "Visual explanation is pending. This model's published ONNX export does not include a verified method for "
    "highlighting the regions behind its output, so no heatmap is shown."
)


def build_report(probabilities: list[float], image: ValidatedImage) -> ScreeningReport:
    top = max(range(len(probabilities)), key=lambda index: probabilities[index])
    label = GRADE_LABELS[top]
    top_percent = round(probabilities[top] * 100)
    explanation = (
        f"The model's highest-scoring category is {label} (ICDR grade {top}: {GRADE_DESCRIPTIONS[top].rstrip('.')}), "
        f"with an estimated probability of {top_percent}%. Probabilities describe how the model scored this one "
        "photograph. They are not a measure of diagnostic certainty."
    )

    return ScreeningReport(
        report_id=str(uuid.uuid4()),
        generated_at=datetime.now(timezone.utc),
        status="completed",
        model=ModelInfo(
            name=MODEL_NAME,
            version=MODEL_VERSION,
            source=MODEL_SOURCE,
            license=MODEL_LICENSE,
            intended_use=MODEL_INTENDED_USE,
        ),
        predicted_grade=PredictedGrade(
            index=top,
            label=label,
            clinical_scale=CLINICAL_SCALE,
            description=GRADE_DESCRIPTIONS[top],
        ),
        probabilities=[
            ClassProbability(index=index, label=GRADE_LABELS[index], probability=round(value, 4))
            for index, value in enumerate(probabilities)
        ],
        explanation=explanation,
        limitations=list(LIMITATIONS),
        next_steps=[*NEXT_STEPS_BY_GRADE[top], SAFETY_NEXT_STEP],
        disclaimer=DISCLAIMER,
        image=ImageSummary(
            format=image.format,
            size_bytes=image.size_bytes,
            width=image.width,
            height=image.height,
        ),
        explainability=Explainability(status="pending", method=None, note=EXPLAINABILITY_NOTE),
    )
