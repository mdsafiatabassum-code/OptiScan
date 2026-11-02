# OptiScan

### See Beyond the Image.

**AI-Assisted Retinal Screening Research Platform**

OptiScan is an AI-assisted retinal screening research platform that analyses retinal fundus photographs to estimate the severity grade of diabetic retinopathy using a pretrained ResNet34 ONNX classification model.

The project combines image validation, preliminary image-quality checks, AI-generated screening estimates, transparent model limitations, and downloadable reports in a modern, navy-blue medical technology interface.

**Detect Early. Protect Vision.**

> **Medical Disclaimer:** OptiScan is a research prototype, not a medical device or clinically validated diagnostic system. Its predictions are estimates, not confirmed diagnoses, and must not be used independently to make treatment decisions. Appropriate clinical assessment by a qualified eye-care professional remains essential.

---

## 🌐 Live Demo

| Resource             | Link                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Live Application** | [OptiScan Frontend](https://optiscan-frontend-2848.onrender.com)                         |
| Backend Health Check | [Check API Status](https://optiscan-backend-bxta.onrender.com/api/health)                |
| API Documentation    | [Explore API Docs](https://optiscan-backend-bxta.onrender.com/docs)                      |
| AI Model             | [Hugging Face Model](https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m) |

The frontend is deployed on Render and communicates with a FastAPI backend that performs ONNX model inference.

The backend health endpoint reports whether the service is running and whether the model is loaded. The first request after a period of inactivity may take longer because the hosting service may need to wake up.

---

## ✨ Key Features

### 🖥️ Modern User Interface

* Premium navy-blue visual theme.
* Responsive screening interface.
* Structured navigation and screening workflow.
* Clear presentation of model-generated results.
* User-friendly validation messages and error states.

### 📸 Retinal Image Upload

* Drag-and-drop image upload.
* File browsing and image preview.
* Replace and remove uploaded images.
* JPG, JPEG, and PNG support.
* Maximum upload size of 10 MB.

### 🔍 Preliminary Image Quality Checks

* Brightness assessment.
* Sharpness assessment.
* Configurable technical quality thresholds.
* Feedback when an image fails the configured checks.

These checks are preliminary technical assessments. They do not establish clinical image adequacy.

### 🧠 AI-Assisted Retinal Analysis

* Pretrained ResNet34 classification model.
* ONNX Runtime inference on the CPU.
* Five-class diabetic retinopathy severity classification.
* Model-generated class scores.
* Screening report generated from the backend response.

### 📄 Screening Reports

* Unique screening reference ID.
* Analysis timestamp.
* Technical image information.
* Predicted severity grade.
* All five class scores.
* Image-quality check results.
* Model limitations and recommended next steps.
* Research-prototype disclaimer.
* Browser-generated downloadable PDF report.

### 🔒 Privacy-Conscious Processing

* Uploaded images are processed in memory by the backend.
* The backend does not write uploaded images to disk or save them in a database.
* Reports are not stored on the backend.
* No API keys or secrets are required by the frontend or backend for the documented workflow.

---

## 🛠️ Technology Stack

| Component            | Technology                               |
| -------------------- | ---------------------------------------- |
| Frontend Framework   | React                                    |
| Programming Language | TypeScript                               |
| Frontend Build Tool  | Vite                                     |
| Styling              | Tailwind CSS                             |
| Backend Framework    | Python FastAPI                           |
| AI Model             | ResNet34                                 |
| Model Runtime        | ONNX Runtime                             |
| Image Processing     | Pillow and NumPy, as used by the backend |
| API Communication    | REST API                                 |
| Report Generation    | Browser-generated PDF                    |
| Model Hosting        | Hugging Face                             |
| Deployment           | Render                                   |
| Backend Testing      | Pytest                                   |

---

## 🏗️ System Architecture

OptiScan separates the frontend interface from the backend inference service.

```text
                 USER
                   |
                   v
        OPTISCAN WEB APPLICATION
           React + TypeScript
                   |
                   v
             IMAGE UPLOAD
           JPG / JPEG / PNG
                   |
                   v
           FASTAPI BACKEND
                   |
                   v
        IMAGE VALIDATION AND
       TECHNICAL QUALITY CHECKS
                   |
                   v
          RESNET34 ONNX MODEL
                   |
                   v
         MODEL INFERENCE AND
         FIVE-CLASS SCORES
                   |
                   v
           SCREENING REPORT
                   |
                   v
         RESULTS IN THE UI
                   |
                   v
          OPTIONAL PDF EXPORT
```

### Processing Workflow

1. The user selects a retinal fundus photograph.
2. The frontend validates the file and performs its configured preliminary quality checks.
3. The image is submitted to the FastAPI backend.
4. The backend validates the uploaded image and evaluates its configured quality criteria.
5. If validation succeeds, the ONNX model performs inference.
6. The backend converts the model's five output logits into softmax probabilities.
7. A screening report is returned to the frontend.
8. The user can review the results and download a PDF report.

If the backend rejects an image or analysis fails, the application should display an appropriate error rather than fabricate a successful result.

---

## 🤖 About the AI Model

OptiScan uses the following pretrained model:

**Model:** `fundusnap/fundusnap-v1-severitycls-rn34-22m`

**Model source:** [Hugging Face](https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m)

| Property      | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| Architecture  | ResNet34 classifier                                                                 |
| Format        | ONNX                                                                                |
| Task          | Five-grade ICDR severity classification                                             |
| Input         | RGB retinal fundus photograph                                                       |
| Preprocessing | Resize shorter side to 224 pixels, centre crop to 224 × 224, ImageNet normalisation |
| Output        | Five raw logits converted into softmax probabilities                                |
| Inference     | ONNX Runtime on CPU                                                                 |
| Model file    | Approximately 87 MB                                                                 |
| Model licence | CC BY-NC 4.0                                                                        |
| Intended use  | Research and engineering, not clinical diagnosis                                    |

### Classification Categories

The model produces an estimate for one of five diabetic retinopathy severity categories.

| Grade   | Category      |
| ------- | ------------- |
| Grade 0 | No DR         |
| Grade 1 | Mild          |
| Grade 2 | Moderate      |
| Grade 3 | Severe        |
| Grade 4 | Proliferative |

The predicted grade represents the model's output for the submitted photograph. It is not a confirmed diagnosis.

### Model Provenance

The documented training data includes resized Kaggle EyePACS 2015 and APTOS 2019 retinal image datasets, with class-balanced resampling.

The model author's reported accuracy is approximately 82% on a held-out split of a rebalanced training set. This figure has not been independently verified by the OptiScan project.

End-to-end inference has been verified with the model, but this does not establish clinical performance on independently labelled patient images.

### Model Integrity

The backend downloads the model when required and checks its SHA-256 checksum.

**Expected SHA-256:**

```text
5761ebf08d85172114a073a12a9d6a15e684bdd2e95368e4e716481e413f87de
```

The model is rejected if its checksum does not match the configured value.

---

## ⚠️ Current Limitations

OptiScan is an experimental research project. Its limitations must be understood before interpreting any output.

### 1. No Clinical Validation

The model has not been independently or prospectively validated for OptiScan's intended users, local population, retinal cameras, or clinical setting.

### 2. Uncalibrated Probabilities

The displayed softmax probabilities are raw model scores. They should not be interpreted as calibrated probabilities of disease or as measures of diagnostic certainty.

### 3. Preliminary Image Quality Thresholds

The brightness and sharpness thresholds are configurable but have not been calibrated using a labelled set of retinal photographs. They cannot establish whether an image is clinically adequate.

### 4. Explainability Not Implemented

A verified heatmap or visual explanation is not currently implemented. The application reports explainability as pending rather than presenting an unverified visualisation as a genuine model explanation.

### 5. Single-Image Assessment

The model analyses one photograph at a time. It does not consider symptoms, medical history, blood glucose, other clinical tests, or a complete ophthalmic examination.

### 6. No Treatment Recommendations

The output is not a treatment plan and must not be used independently to determine treatment.

**OptiScan is intended for research and engineering demonstrations only.**

---

## 🚀 Getting Started

### Prerequisites

Install the following:

* Node.js 18 or newer.
* npm.
* Python 3.11.
* Approximately 1 GB of free disk space for the model and dependencies during local development.

### Project Structure

```text
OptiScan/
├── public/
├── src/
│   ├── App.tsx
│   ├── pages/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── landing/
│   │   └── screening/
│   ├── hooks/
│   │   └── useScreeningFlow.ts
│   ├── services/
│   │   ├── retinalAnalysis.ts
│   │   └── parseScreeningReport.ts
│   ├── lib/
│   ├── config/
│   └── types/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── model_info.py
│   │   ├── model_store.py
│   │   ├── model_state.py
│   │   ├── inference.py
│   │   ├── validation.py
│   │   ├── quality.py
│   │   ├── report.py
│   │   ├── schemas.py
│   │   └── routes/
│   ├── tests/
│   ├── requirements.txt
│   └── requirements-dev.txt
├── .env.example
├── package.json
├── render.yaml
└── README.md
```

*Note: This is a logical overview of the documented project structure. Consult the actual repository for the complete list of files.*

---

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mdsafiatabassum-code/OptiScan.git
cd OptiScan
```

### 2. Configure the Backend

Open a terminal in the project directory.

```bash
cd backend
python3.11 -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

**Linux or macOS:**

```bash
source .venv/bin/activate
```

Install the development dependencies:

```bash
pip install -r requirements-dev.txt
```

The backend downloads the model on its first start if the model file is not already present and downloading is enabled.

### 3. Run Backend Tests

From the `backend` directory:

```bash
pytest
```

Tests requiring the actual model file may be skipped unless the model has been downloaded and the relevant environment variable is configured.

### 4. Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload --port 8000
```

Check the health endpoint:

http://localhost:8000/api/health

A response containing `"loaded": true` indicates that the model is ready.

### 5. Configure the Frontend

Open a second terminal in the project root.

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env
```

Make sure the frontend environment file contains:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the address printed in the terminal.

Navigate to the screening page, upload a supported retinal photograph, and select the analysis button.

### 6. Run Real-Model Tests

After downloading the model, run the real-model tests from the `backend` directory:

```bash
OPTISCAN_TEST_MODEL_PATH=models/model.onnx pytest -v
```

On Windows PowerShell:

```powershell
$env:OPTISCAN_TEST_MODEL_PATH = "models/model.onnx"
pytest -v
```

These tests depend on the repository's test implementation and the availability of the actual model file.

### 7. Other Available Scripts

From the project root:

```bash
npm run build
npm run preview
npm run typecheck
npm run lint
```

These commands respectively build the frontend, preview the production build, run TypeScript checks, and run ESLint.

---

## 🔌 API Documentation

### Backend Base URL

```text
https://optiscan-backend-bxta.onrender.com
```

### Available Endpoints

| Method | Endpoint           | Purpose                                                |
| ------ | ------------------ | ------------------------------------------------------ |
| GET    | `/api/health`      | Reports service status and whether the model is loaded |
| POST   | `/api/v1/analyses` | Accepts a retinal image and returns a screening report |

### Image Analysis Request

The analysis endpoint accepts a `multipart/form-data` request.

**Required field:** `file`

**Supported formats:** JPG, JPEG, PNG

**Maximum upload size:** 10 MB by default.

Example using `curl`:

```bash
curl -X POST \
  "https://optiscan-backend-bxta.onrender.com/api/v1/analyses" \
  -F "file=@retinal_image.jpg"
```

Replace `retinal_image.jpg` with the path to a suitable test image.

### Successful Response

A successful response returns a JSON report containing fields such as:

* `reportId`
* `generatedAt`
* `model`
* `predictedGrade`
* `probabilities`
* `explanation`
* `limitations`
* `nextSteps`
* `disclaimer`
* `image`
* `quality`
* `explainability`

The explainability field remains pending until a verified explanation method is implemented.

### Error Responses

The API uses structured error responses of the following form:

```json
{
  "error": {
    "code": "error_code",
    "message": "A description of the error"
  }
}
```

| HTTP Status | Error Code                   | Meaning                                               |
| ----------- | ---------------------------- | ----------------------------------------------------- |
| 400         | `missing_file`               | No file was provided                                  |
| 400         | `empty_file`                 | The uploaded file is empty                            |
| 400         | `unsupported_format`         | The file format is unsupported                        |
| 400         | `invalid_image`              | The image could not be decoded                        |
| 400         | `image_too_small`            | The image is below the configured minimum dimensions  |
| 400         | `image_dimensions_too_large` | The image dimensions exceed the permitted limit       |
| 413         | `file_too_large`             | The upload exceeds the maximum size                   |
| 422         | `image_quality_failed`       | The image failed a configured technical quality check |
| 500         | `inference_failed`           | Model inference failed                                |
| 500         | `internal_error`             | An internal processing error occurred                 |
| 503         | `model_unavailable`          | The model is unavailable                              |

The quality-check failure response can include additional information describing which checks failed.

No screening report should be treated as successfully generated when the backend reports a failed analysis.

---

## 🔧 Environment Variables

### Backend Configuration

Backend settings are documented in `backend/.env.example`.

| Variable                      | Default                                       | Purpose                                            |
| ----------------------------- | --------------------------------------------- | -------------------------------------------------- |
| `ALLOWED_ORIGINS`             | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated list of permitted frontend origins |
| `MODEL_PATH`                  | `backend/models/model.onnx`                   | Location of the model file                         |
| `MODEL_URL`                   | Configured Hugging Face model download URL    | Model download source                              |
| `MODEL_SHA256`                | Pinned checksum                               | Model integrity verification                       |
| `MAX_UPLOAD_MB`               | `10`                                          | Maximum upload size in MB                          |
| `QUALITY_MIN_MEAN_BRIGHTNESS` | `25`                                          | Preliminary minimum brightness threshold           |
| `QUALITY_MAX_MEAN_BRIGHTNESS` | `235`                                         | Preliminary maximum brightness threshold           |
| `QUALITY_MIN_SHARPNESS`       | `5`                                           | Preliminary minimum sharpness threshold            |
| `PORT`                        | Supplied by Render                            | Backend listening port                             |

The brightness values use a 0–255 greyscale scale. Sharpness is evaluated using Laplacian variance on a scaled greyscale image.

These quality thresholds are preliminary, uncalibrated technical checks.

### Frontend Configuration

| Variable            | Purpose                         |
| ------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |

For local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For the deployed frontend:

```env
VITE_API_BASE_URL=https://optiscan-backend-bxta.onrender.com
```

Vite embeds `VITE_*` variables into the frontend build. These values are publicly visible and must never contain secrets.

**If you change `VITE_API_BASE_URL`, rebuild and redeploy the frontend.**

---

## ☁️ Deployment on Render

OptiScan uses two Render services:

1. A Python web service for the FastAPI backend.
2. A static site for the React frontend.

### Backend Service

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Service        | `optiscan-backend`                                 |
| Root directory | `backend`                                          |
| Build command  | `pip install -r requirements.txt`                  |
| Start command  | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health check   | `/api/health`                                      |
| Python version | `3.11.9`                                           |

Required environment variables include:

```text
PYTHON_VERSION=3.11.9
ALLOWED_ORIGINS=https://optiscan-frontend-2848.onrender.com
MAX_UPLOAD_MB=10
```

### Frontend Service

| Setting           | Value                                        |
| ----------------- | -------------------------------------------- |
| Service           | `optiscan-frontend`                          |
| Build command     | `npm install && npm run build`               |
| Publish directory | `dist`                                       |
| API base URL      | `https://optiscan-backend-bxta.onrender.com` |

Configure:

```text
VITE_API_BASE_URL=https://optiscan-backend-bxta.onrender.com
```

The static site should use the appropriate SPA rewrite rule:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

### Python and ONNX Runtime Compatibility

The backend uses Python 3.11.9 because the pinned `onnxruntime==1.20.1` dependency must be installed using a compatible Python environment.

The version is documented in:

* `backend/.python-version`
* The backend's `PYTHON_VERSION` environment variable.

When configuring an existing Render service manually, verify the Python version in that service's environment settings.

### Deployment Verification

After deployment:

1. Confirm that the backend service starts successfully.
2. Open the backend health endpoint.
3. Confirm that the model is loaded.
4. Confirm that `ALLOWED_ORIGINS` matches the deployed frontend origin exactly.
5. Confirm that the frontend has the correct `VITE_API_BASE_URL`.
6. Upload a valid retinal photograph on the live website.
7. Confirm that actual model-generated results appear.
8. Test an invalid upload and verify that an understandable error is displayed.

The first backend deployment may take several minutes while the model is downloaded.

Free hosting instances may sleep when idle, making the first request slower. Model memory requirements on Render have not been fully measured.

---

## 🔒 Privacy and Data Handling

OptiScan is designed to minimise the handling of uploaded images.

According to the current backend implementation:

* Uploaded images are read into memory for validation and analysis.
* Images are not written to disk or stored in a database.
* Original filenames are not returned or logged.
* Reports are not stored on the backend.
* Screening reference IDs are randomly generated.
* PDF reports are generated in the browser when requested.
* Error responses use generic messages rather than exposing internal details.

These statements describe the documented application behaviour and should be verified against the deployed code before making broader privacy claims.

Users should not upload identifiable medical information unless the application is being used within an appropriately authorised and secured workflow.

---

## 🧪 Testing and Reliability

The project includes automated tests for:

* File validation.
* Image-quality checks.
* API responses.
* Model-unavailable handling.
* Model checksum verification.
* Real-model inference when the model file is available.

The presence of automated tests does not by itself establish clinical reliability.

Before extending the system, important areas for further testing include:

* Different retinal image sizes and formats.
* Invalid and corrupted files.
* Very dark, bright, or blurred images.
* Network failures.
* Backend timeouts.
* Model-loading failures.
* End-to-end analysis on independently labelled images.

Any future performance evaluation should clearly document the dataset, sample size, class distribution, evaluation methodology, and limitations.

---

## 🔮 Future Improvements

Potential future directions include:

* Verified explainability methods compatible with the model.
* More thoroughly calibrated technical image-quality checks.
* Independent evaluation using appropriately labelled retinal images.
* Additional accessibility and multilingual improvements.
* Improved screening workflow usability.
* More extensive automated integration tests.
* Further optimisation of loading states and error handling.

These are potential improvements, not claims about currently implemented functionality.

---

## 📜 Licence and Responsible Use

### AI Model Licence

The pretrained model is released under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

The model may be used and adapted for permitted non-commercial purposes with appropriate attribution, subject to the licence terms.

Commercial deployment requires permission from the model's authors or a different, appropriately licensed model.

The underlying training datasets have their own terms, which must also be checked before use beyond research and engineering activities.

Refer to the [model's Hugging Face page](https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m) for the model's documentation and licence information.

### Medical Use Disclaimer

OptiScan is a research and engineering prototype.

It is not clinically validated, does not replace a qualified eye-care professional, and must not be used independently to diagnose diabetic retinopathy or determine treatment.

All model-generated estimates require appropriate clinical interpretation.

---

## 👩‍💻 Project

**OptiScan — See Beyond the Image.**

An AI-assisted retinal screening research project exploring how computer vision can support the preliminary assessment of retinal fundus photographs.

**Repository:** [github.com/mdsafiatabassum-code/OptiScan](https://github.com/mdsafiatabassum-code/OptiScan)

**Live Demo:** [OptiScan on Render](https://optiscan-frontend-2848.onrender.com)

---
