# OptiScan

AI-assisted retinal screening support for early identification of possible signs of diabetic retinopathy.

Detect Early. Protect Vision.

OptiScan is a research prototype. It is not a medical device, has not been clinically validated, and is intended to support, not replace, qualified healthcare professionals.

## What works

- Landing page, navigation, mobile menu and screening page.
- Image upload with drag and drop or browse, JPG/JPEG/PNG only, 10 MB limit, preview, replace and remove.
- Preliminary technical quality checks (brightness and sharpness) before analysis. A photograph that fails is not analysed; the screen explains which check failed and lets you choose a different image.
- Upload progress bar, analysis loading state and clear error messages. No report is shown when analysis fails.
- Backend API (`backend/`) that validates the image, runs the pretrained model (ONNX Runtime, CPU) and returns the model's probabilities as JSON.
- Report screen with a screening reference ID, analysis timestamp, image details, the predicted ICDR grade, all five raw class scores, the quality checks, limitations, next steps, model licence and a research-prototype disclaimer.
- Downloadable PDF of the report, generated in the browser. The image itself is not included in the PDF.
- Automated tests for file validation, image-quality checks, API responses, model-unavailable handling and checksum handling. The real-model tests run when the model file is present.

## What needs configuration

- **Model file:** the backend downloads `model.onnx` (about 87 MB) on first start and checks its SHA-256. Nothing else is needed on a normal start.
- **Backend address:** the frontend needs `VITE_API_BASE_URL` pointing at the backend.
- **Allowed origins:** the backend needs `ALLOWED_ORIGINS` set to the frontend's address in production.

## What is pending

- **Heatmap / visual explanation:** not implemented. The ONNX export of this model has no verified explanation method, so the report shows "Heatmap pending" instead of a fabricated highlight. A Grad-CAM style method would need the original PyTorch checkpoint and a gradient-capable runtime, which are not included here.
- **Image-quality thresholds:** the brightness and sharpness defaults are preliminary and have not been calibrated on labelled retinal photographs. They are configurable (see below). The checks do not establish whether a photograph is clinically adequate.
- **Clinical validation:** the model's accuracy is self-reported by its author (about 82% on a held-out split of a rebalanced training set). It has not been validated on your population, cameras or clinical setting.
- **Commercial use:** the model is licensed CC BY-NC 4.0, which prohibits commercial use. See the licence section below.

## The AI model

| Item | Value |
| --- | --- |
| Model | `fundusnap/fundusnap-v1-severitycls-rn34-22m` (ResNet34 classifier, ONNX export) |
| Source | https://huggingface.co/fundusnap/fundusnap-v1-severitycls-rn34-22m |
| Task | Five-grade ICDR severity classification from a single fundus photograph |
| Labels | 0 No DR, 1 Mild, 2 Moderate, 3 Severe, 4 Proliferative |
| Input | RGB, shorter side resized to 224 px, centre crop 224 × 224, ImageNet normalisation |
| Output | Five raw logits, converted to probabilities with softmax |
| Training data | Kaggle resized 2015 EyePACS and APTOS 2019, class-balanced resampling |
| Licence | CC BY-NC 4.0 (non-commercial, attribution required). The underlying datasets have their own terms. |
| Intended use | Research and engineering use; the model card says it is not for clinical use |
| SHA-256 (`model.onnx`) | `5761ebf08d85172114a073a12a9d6a15e684bdd2e95368e4e716481e413f87de` |

The model was selected because it is trained on labelled retinal fundus images for diabetic retinopathy grading and ships as ONNX, so it runs without PyTorch. Its accuracy has not been independently verified. In this project, inference was verified end to end on a synthetic image and on the real model file, but not against labelled clinical images.

## Requirements

- Node.js 18 or newer and npm (frontend)
- Python 3.11 (backend)
- About 1 GB of free disk space for the model and dependencies (local development)

## Local setup

### 1. Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
```

Run the tests:

```bash
pytest
```

Start the API (the model downloads to `backend/models/model.onnx` on the first start):

```bash
uvicorn app.main:app --reload --port 8000
```

Check it is running: open http://localhost:8000/api/health. `"loaded": true` means the model is ready.

Configuration is read from environment variables. The values are documented in `backend/.env.example`. The defaults are fine for local development.

### 2. Frontend

In a second terminal, from the project root:

```bash
cp .env.example .env
npm install
npm run dev
```

`.env` sets `VITE_API_BASE_URL=http://localhost:8000`. Open the address printed in the terminal, go to Retinal Screening, upload a JPG or PNG and select Analyse Image.

### Running real inference tests

The real-model tests are skipped unless you point them at the downloaded file:

```bash
cd backend
OPTISCAN_TEST_MODEL_PATH=models/model.onnx pytest -v
```

### Other scripts

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service status and whether the model is loaded. Always returns 200 while the process is running. |
| POST | `/api/v1/analyses` | Multipart upload with a field named `file`. Returns a screening report. |

Successful responses return HTTP 200 with a JSON report: `reportId`, `generatedAt`, `model`, `predictedGrade`, `probabilities`, `explanation`, `limitations`, `nextSteps`, `disclaimer`, `image`, `quality` and `explainability` (always `pending` for now).

Errors use one shape: `{"error": {"code": "...", "message": "..."}}`. The 422 response for a failed quality check also includes `details.checks`, a list of the failed checks with `code`, `label`, `status` and `message`.

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | `missing_file`, `empty_file`, `unsupported_format`, `invalid_image`, `image_too_small`, `image_dimensions_too_large` | The upload was rejected |
| 413 | `file_too_large` | Larger than `MAX_UPLOAD_MB` |
| 422 | `image_quality_failed` | The photograph failed a technical quality check. No report is returned and the model is not run. |
| 500 | `inference_failed`, `internal_error` | Analysis failed on the server. No report is returned. |
| 503 | `model_unavailable` | The model file is missing or failed to load. No report is returned. |

## Environment variables

### Backend (`backend/`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated frontend origins allowed by CORS. Set to your frontend URL in production. |
| `MODEL_PATH` | `backend/models/model.onnx` | Where the model file is stored or loaded from |
| `MODEL_URL` | Hugging Face link above | Download source if `MODEL_PATH` is missing. Set to an empty value to disable downloads. |
| `MODEL_SHA256` | Pinned checksum above | The model is rejected if its checksum differs |
| `MAX_UPLOAD_MB` | `10` | Largest accepted upload |
| `QUALITY_MIN_MEAN_BRIGHTNESS` | `25` | Images whose mean grey level (0-255) is below this are rejected as too dark. Preliminary, uncalibrated. |
| `QUALITY_MAX_MEAN_BRIGHTNESS` | `235` | Images whose mean grey level is above this are rejected as too bright. Preliminary, uncalibrated. |
| `QUALITY_MIN_SHARPNESS` | `5` | Images whose Laplacian variance (on the grey image scaled to at most 512 px) is below this are rejected as blurred. Preliminary, uncalibrated; it only catches strongly out-of-focus images. |
| `PORT` | set by Render | Port for the start command (`uvicorn ... --port $PORT`) |

### Frontend (project root)

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend address, with no trailing slash, for example `https://optiscan-api.onrender.com` |

Vite embeds `VITE_*` values in the built site. They are public, so never put secrets in them. Set this variable before building; if you change it, rebuild and redeploy the frontend.

No API keys or secrets are required by either service.

## Privacy and data handling

- Uploaded images are read into memory for validation and analysis. They are not written to disk or stored in a database, and the file name is not returned or logged.
- Reports are not saved on the server. The reference ID is a random identifier generated for each analysis, and the PDF is created in the browser when you choose to download it.
- Error responses use fixed, generic messages and never include internal details.

## Deploying on Render

The `render.yaml` blueprint defines two services: a Python web service for the API and a static site for the frontend.

### Python version

The backend is pinned to **Python 3.11.9**. The pinned ONNX Runtime (`onnxruntime==1.20.1`) publishes wheels for Python 3.11 to 3.13 only, so a service that defaults to a newer Python fails with `Could not find a version that satisfies the requirement onnxruntime==1.20.1`.

The version is set in two places, which are kept in sync:

- `backend/.python-version` (contains `3.11.9`)
- `PYTHON_VERSION=3.11.9` in the Render environment (set in `render.yaml` and required on manual services)

Render keeps the Python version a service was created with. Changing `render.yaml` does not change a backend service that already exists, so add `PYTHON_VERSION` to that service's Environment page as described below.

### Option A: blueprint

1. In Render, choose New, then Blueprint, and connect this repository.
2. When prompted, enter `ALLOWED_ORIGINS` for `optiscan-api` (the frontend's URL, for example `https://optiscan.onrender.com`) and `VITE_API_BASE_URL` for `optiscan` (the backend's URL, for example `https://optiscan-api.onrender.com`).
3. Apply the blueprint and wait for both services to deploy.

### Option B: manual services

**Backend (Web Service)**

- Root directory: `backend`
- Runtime: Python 3
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/api/health`
- Environment: `PYTHON_VERSION=3.11.9`, `ALLOWED_ORIGINS=<frontend URL>`, `MAX_UPLOAD_MB=10`

**Frontend (Static Site)**

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment: `VITE_API_BASE_URL=<backend URL>`
- Rewrite rule: source `/*`, destination `/index.html`, action Rewrite

### Redeploying an existing backend after the Python fix

1. Open the backend service in Render, go to Environment, and add `PYTHON_VERSION` with the value `3.11.9`. Save.
2. Open Manual Deploy and choose Clear build cache & deploy, so the failed install is not reused.
3. Check the build log shows Python 3.11.9 and that `onnxruntime 1.20.1` installs.
4. Open `<backend URL>/api/health`. It should show `"loaded": true` once the model has downloaded.
5. If it shows `"loaded": false`, check the service logs for a model download or checksum message.

### Order and checks

1. Deploy the backend first and open `<backend URL>/api/health`. The first deploy downloads the model, so allow a few minutes.
2. Deploy the frontend with `VITE_API_BASE_URL` set to the backend URL.
3. Confirm `ALLOWED_ORIGINS` on the backend matches the frontend URL exactly, including `https://` and no trailing slash.
4. Upload a test image on the live site and confirm a report appears.

Free Render instances sleep when idle. The first request after a sleep can be slow while the service wakes and the model loads. The model's memory use has not been measured on Render; if the backend restarts with out-of-memory errors, use a larger instance.

## Model licence and clinical use

The model is released under CC BY-NC 4.0. You may use and adapt it for non-commercial purposes with attribution. Any commercial deployment of OptiScan requires permission from the model's authors or a different, appropriately licensed model. The training datasets carry their own terms, which also need to be checked before any use beyond research.

Results are estimates from one photograph. They are not a diagnosis and must not be used to make treatment decisions without review by a qualified eye care professional. OptiScan does not consider symptoms, blood glucose, history or other clinical tests.

## Project structure

```
src/
  App.tsx                       Route selection
  pages/                        Landing, screening and not-found pages
  components/
    common/                     Shared UI (buttons, logo, alerts, section headers)
    layout/                     Header, footer and page layout
    landing/                    Landing page sections
    screening/                  Upload card, dropzone, preview, progress, quality checks, report sections
  hooks/useScreeningFlow.ts     Screening state: selection, validation, upload, analysis and quality rejection
  services/
    retinalAnalysis.ts          Upload to the API with progress and error mapping
    parseScreeningReport.ts     Checks the API response shape
  lib/                          Routing, image validation, formatting, PDF writer and report PDF layout
  config/                       Navigation links and API address
  types/screening.ts            Report and analysis state types
backend/
  app/
    main.py                     FastAPI app, CORS, error handling, routes wiring
    config.py                   Environment settings, including quality thresholds
    model_info.py               Model metadata, labels, limitations and advice
    model_store.py              Model download and checksum verification
    model_state.py              Model loading at startup
    inference.py                Preprocessing, ONNX inference and softmax
    validation.py               Upload type, size and image checks
    quality.py                  Preliminary brightness and sharpness checks
    report.py                   Builds the report from model output
    schemas.py                  Response models
    routes/                     Health and analysis endpoints
  tests/                        Validation, quality, API, model store and real-model tests
  requirements.txt              Runtime dependencies (pinned)
  requirements-dev.txt          Adds pytest
```
