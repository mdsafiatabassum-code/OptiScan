MODEL_NAME = "fundusnap-v1-severitycls-rn34-22m"
MODEL_VERSION = "v1"
MODEL_SOURCE = "https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m"
MODEL_LICENSE = "CC BY-NC 4.0 (non-commercial use only)"
MODEL_INTENDED_USE = (
    "Research and engineering use. At most a triage aid that a qualified clinician supervises. "
    "Not validated for clinical decision-making."
)

MODEL_DEFAULT_URL = (
    "https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m/resolve/main/models/model.onnx"
)
MODEL_DEFAULT_SHA256 = "5761ebf08d85172114a073a12a9d6a15e684bdd2e95368e4e716481e413f87de"

INPUT_NAME = "input"
OUTPUT_NAME = "output"
INPUT_SIZE = 224
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)

CLINICAL_SCALE = "ICDR"
GRADE_LABELS = ("No DR", "Mild", "Moderate", "Severe", "Proliferative")
GRADE_DESCRIPTIONS = (
    "No visible retinopathy.",
    "Microaneurysms only.",
    "More than microaneurysms, but less than severe non-proliferative DR.",
    "Severe non-proliferative DR.",
    "Proliferative DR with neovascularisation.",
)

DISCLAIMER = (
    "This is an automated screening estimate from a single photograph. It is not a definitive medical diagnosis "
    "and must be reviewed by a qualified healthcare professional."
)

LIMITATIONS = (
    "The model is trained as a plain five-way classifier and does not use the ordering of the severity grades.",
    "Reported accuracy (about 82%) is the model author's self-reported figure on a held-out split of a rebalanced "
    "training set. It has not been independently or prospectively validated.",
    "Performance on your patients, cameras and image conditions is unknown. It may differ from the reported figures.",
    "Blurred, dark, under-exposed or partial images can produce unreliable outputs.",
    "A 'No DR' output does not rule out retinopathy, and a high probability is not a confirmed diagnosis.",
    "Probabilities are the model's raw softmax scores and have not been calibrated.",
    "Only the retinal photograph is analysed. Symptoms, blood glucose, history and other clinical tests are not considered.",
)

NEXT_STEPS_BY_GRADE = (
    (
        "A 'No DR' output does not rule out retinopathy. Continue regular diabetes eye checks as advised by your clinician.",
        "Share this report with your healthcare provider, who should make the final assessment.",
    ),
    (
        "Arrange a review with a qualified eye care professional to confirm the result and agree on follow-up timing.",
        "Keep your diabetes management on track and discuss this result with your clinician.",
    ),
    (
        "Arrange a review with a qualified eye care professional to confirm the result and agree on follow-up timing.",
        "Keep your diabetes management on track and discuss this result with your clinician.",
    ),
    (
        "Arrange an urgent review with an eye care specialist. Do not delay because of this output alone.",
        "Share this report with your healthcare provider as soon as possible.",
    ),
    (
        "Arrange an urgent review with an eye care specialist. Do not delay because of this output alone.",
        "Share this report with your healthcare provider as soon as possible.",
    ),
)

SAFETY_NEXT_STEP = (
    "Seek urgent medical care if you have sudden vision loss, eye pain or a sudden change in your sight."
)
