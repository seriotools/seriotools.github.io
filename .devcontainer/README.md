# Dev Container — Astro 7.3 (Node 26) + Python 3.14 / uv

A quality-focused Dev Container for building the `seriotools.github.io` site with
[Astro 7.3](https://astro.build/).

## Quick start

1. Make sure **Docker Desktop** (latest) is installed and running.
2. In VS Code, run **"Dev Containers: Reopen in Container"** (Ctrl+Shift+P).
3. The first build takes a few minutes (base image + Python via uv); rebuilds are fast.
4. Run the dev server:

   ```bash
   npm run dev        # http://localhost:4321 (auto-forwarded)
   ```

5. Type-check when needed:

   ```bash
   npm run check      # astro check
   ```

> The project is already scaffolded. `scaffold-astro.sh` is only for starting a
> fresh project elsewhere — it refuses to run over an existing `package.json`.

## What's inside

| Tool | Version / Note |
|------|----------------|
| Node.js | 26 (Debian trixie — current stable), base image `mcr.microsoft.com/devcontainers/javascript-node:5-26-trixie` |
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
- `VARIANT` — switch Debian/Node variant (`26-bookworm` = Debian 12, `26-trixie` = Debian 13, ...).
  The Dockerfile composes the base image as `javascript-node:5-<VARIANT>` — see the
  correlation notes below for why the image major is `5`.

## Notes

- This configuration is compatible with both Docker and Podman.

## Toolchain correlation notes

- **Node 26** lives on devcontainer image major line **`5`** — line `4` stops at
  Node 24, so the base image is `javascript-node:5-26-trixie`.
- **TypeScript is pinned to 6.x**, not the newer 7.x. `@astrojs/check` (which
  powers `astro check`) declares `peerDependencies.typescript: "^5.0.0 || ^6.0.0"`,
  and Astro's own repo pins `typescript: ^6.0.3`. Installing TypeScript 7 makes
  `npm i @astrojs/check` fail with `ERESOLVE`, disabling `astro check` entirely.
- **`allowScripts` in `package.json`** — npm 11.19+ blocks dependency install
  scripts by default. `esbuild`'s `postinstall` is explicitly denied because its
  platform binary ships as the `@esbuild/linux-x64` optional dependency and the
  build is verified to work without the script (keeps `npm ci` warning-free).
