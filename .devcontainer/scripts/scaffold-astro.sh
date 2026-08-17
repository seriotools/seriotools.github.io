#!/usr/bin/env bash
# ===========================================================================
# Scaffold a new Astro project (v7.x) into the current workspace directory.
#
#   bash .devcontainer/scripts/scaffold-astro.sh [template]
#
# Templates (Astro 7): minimal (default), base, blog, portfolio, docs, ...
# Safe: refuses to overwrite an existing project (package.json present).
# ===========================================================================
set -euo pipefail

ASTRO_TEMPLATE="${1:-minimal}"

if [[ -f package.json ]]; then
  echo "ERROR: package.json already exists — refusing to scaffold over an existing project." >&2
  exit 1
fi

echo "==> Scaffolding Astro (template: ${ASTRO_TEMPLATE})"
npm create astro@latest -- . \
  -- --template "${ASTRO_TEMPLATE}" \
     --install \
     --no-git \
     --typescript strictest \
     --yes

echo
echo "Done. Start developing with:"
echo "  npm run dev   # http://localhost:4321"
