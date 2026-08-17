# Dev Container — Astro 7.2 (Node 24 LTS) + Python 3.14 / uv

A quality-focused Dev Container for building the `seriotools.github.io` site with
[Astro 7.2](https://astro.build/).

## Quick start

1. Make sure **Docker Desktop** (latest) is installed and running.
2. In VS Code, run **"Dev Containers: Reopen in Container"** (Ctrl+Shift+P).
3. The first build takes a few minutes (base image + Python via uv); rebuilds are fast.
4. When ready, scaffold the Astro project:

   ```bash
   bash .devcontainer/scripts/scaffold-astro.sh
   ```

5. Run the dev server:

   ```bash
   npm run dev        # http://localhost:4321 (auto-forwarded)
   ```

## What's inside

| Tool | Version / Note |
|------|----------------|
| Node.js | 24 LTS (Debian trixie — current stable), base image `mcr.microsoft.com/devcontainers/javascript-node:4-24-trixie` |
| npm | Global install dir preconfigured; `nvm` also available |
| Python | 3.14, **uv-managed** (prebuilt CPython — no source compilation) |
| uv | Astral's Python package/venv/version manager (`uv`, `uvx`) |
| GitHub CLI | `gh` (auth, repo + GitHub Pages workflow) |
| OS | git, zsh + oh-my-zsh, curl, wget, common build utilities |

`python3` / `python` on PATH point to the uv-managed CPython 3.14.

## Robustness choices

- **Named volumes** for `node_modules` and the uv cache — avoids Windows↔Linux
  `node_modules` mismatch and makes rebuilds fast.
- **`--init`** — zombie process reaping inside the container.
- **`SYS_PTRACE`** — enables `node --inspect` debugging, strace, etc.
- **Astro telemetry disabled**, Python output unbuffered.
- **Idempotent `postCreate.sh`** — verifies the toolchain and installs npm deps
  when a `package.json` appears.
- Container auto-stops when the VS Code window closes.

## Reproducibility knobs (`.devcontainer/devcontainer.json`)

- `UV_VERSION` — set e.g. `"0.12.5"` to pin uv exactly.
- `PYTHON_VERSION` — bump the CPython version if needed.
- `VARIANT` — switch Debian variant (`24-bookworm` = Debian 12, `24-trixie` = Debian 13, ...).

## Notes

- The Astro project is **not** scaffolded automatically; run
  `scaffold-astro.sh` when you want it.
- This configuration is compatible with both Docker and Podman.
