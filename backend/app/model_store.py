import hashlib
import logging
import os
from pathlib import Path

import httpx

logger = logging.getLogger(__name__)

DOWNLOAD_TIMEOUT_SECONDS = 300
CHUNK_BYTES = 1024 * 1024


class ModelLoadError(Exception):
    pass


def sha256_of(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(CHUNK_BYTES), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_model_file(path: Path, url: str | None, sha256: str | None) -> Path:
    if path.is_file():
        if sha256 is None or sha256_of(path) == sha256:
            return path
        logger.warning("Existing model file failed checksum verification and will be replaced")

    if not url:
        raise ModelLoadError(f"Model file is missing at {path} and no MODEL_URL is configured.")

    path.parent.mkdir(parents=True, exist_ok=True)
    partial = path.with_name(path.name + ".part")
    logger.info("Downloading analysis model to %s", path)
    try:
        with httpx.stream("GET", url, follow_redirects=True, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:
            response.raise_for_status()
            with partial.open("wb") as handle:
                for chunk in response.iter_bytes(CHUNK_BYTES):
                    handle.write(chunk)
    except httpx.HTTPError as exc:
        partial.unlink(missing_ok=True)
        raise ModelLoadError(f"Model download failed: {exc}") from exc

    if sha256 is not None and sha256_of(partial) != sha256:
        partial.unlink(missing_ok=True)
        raise ModelLoadError("Downloaded model failed checksum verification.")

    os.replace(partial, path)
    return path
