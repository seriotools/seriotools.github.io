#!/usr/bin/env bash
# ===========================================================================
# Post-create setup — Astro 7.2 (Node 24 LTS) Dev Container.
# Runs once after container creation, as the `node` user.
# Idempotent — safe to re-run at any time.
# ===========================================================================
set -euo pipefail

PYTHON_VERSION="${PYTHON_VERSION:-3.14}"

echo "==> Node.js toolchain"
node --version
npm --version

echo "==> uv + Python toolchain"
uv --version
# Idempotent: no-op if already installed; picks up a newer patch if available.
uv python install "${PYTHON_VERSION}" >/dev/null 2>&1 || true

# Refresh the /usr/local/bin python symlinks to the newest installed patch
# (the `node` user has passwordless sudo in the base image).
if command -v sudo >/dev/null 2>&1; then
  sudo -n ln -sf "$(uv python find "${PYTHON_VERSION}")" \
    /usr/local/bin/python3 /usr/local/bin/python 2>/dev/null || true
fi

uv python list
python3 --version

echo "==> GitHub CLI"
if command -v gh >/dev/null 2>&1; then gh --version | head -n 1; fi

# Ensure the `node_modules` named-volume root is writable by the `node` user.
# Docker initializes fresh named volumes as root-owned, which would otherwise
# block `npm install` with EACCES. Idempotent.
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
sudo -n mkdir -p "${WORKSPACE_DIR}/node_modules"
sudo -n chown -R node:node "${WORKSPACE_DIR}/node_modules"

# Install project dependencies when a manifest exists but node_modules doesn't.
if [[ -f package.json ]] && [[ ! -d node_modules ]]; then
  echo "==> Installing npm dependencies"
  npm install
fi

echo
echo "Dev container ready."
echo "  - Astro dev server : npm run dev      -> http://localhost:4321"
echo "  - Scaffold Astro   : bash .devcontainer/scripts/scaffold-astro.sh"
echo "  - Python (uv)      : uv venv && uv pip install ..."
