#!/bin/bash
# Inicia o backend FastAPI
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/venv/bin/activate"
cd "$SCRIPT_DIR/backend"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
