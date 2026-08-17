# syntax=docker/dockerfile:1.7

# ===========================================================================
# seriotools.github.io — Astro 7.2 Dev Container image
#
#   Node.js 24 LTS (Debian trixie — current stable) — official Microsoft devcontainer image
#   Python 3.14 + uv (Astral)        — prebuilt CPython, no from-source compile
#
# Build args (override from devcontainer.json or `docker build`):
#   VARIANT         Debian/Node variant of the base image   (default 24-trixie)
#   PYTHON_VERSION  CPython version installed via uv        (default 3.14)
#   UV_VERSION      uv version to install                   (default latest)
# ===========================================================================

ARG VARIANT=24-trixie
ARG PYTHON_VERSION=3.14

FROM mcr.microsoft.com/devcontainers/javascript-node:4-${VARIANT}

ARG PYTHON_VERSION
ARG UV_VERSION=latest

USER root

# --- uv (Astral) -------------------------------------------------------------
# Official installer (pinnable via the version-in-URL form). UV_INSTALL_DIR
# keeps uv in a stable location that we symlink into /usr/local/bin so every
# user can call `uv` / `uvx`. UV_NO_MODIFY_PATH keeps the installer from
# editing shell rc files.
RUN if [ "${UV_VERSION}" = "latest" ]; then \
        INSTALL_URL="https://astral.sh/uv/install.sh"; \
    else \
        INSTALL_URL="https://astral.sh/uv/${UV_VERSION}/install.sh"; \
    fi \
    && curl -LsSf "${INSTALL_URL}" | env UV_INSTALL_DIR=/opt/uv UV_NO_MODIFY_PATH=1 sh \
    && ln -sf /opt/uv/uv  /usr/local/bin/uv \
    && ln -sf /opt/uv/uvx /usr/local/bin/uvx \
    && uv --version

# --- Python 3.14 (managed by uv) ----------------------------------------------
# uv downloads prebuilt CPython from python-build-standalone, so no gcc/build
# toolchain or slow compilation is required.
# UV_PYTHON_INSTALL_DIR is a stable, shared store (visible to root and `node`).
ENV UV_PYTHON_INSTALL_DIR=/opt/uv-python \
    UV_CACHE_DIR=/opt/uv-cache \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

RUN uv python install "${PYTHON_VERSION}" \
    && UV_PY="$(uv python find "${PYTHON_VERSION}")" \
    && ln -sf "${UV_PY}" /usr/local/bin/python3 \
    && ln -sf "${UV_PY}" /usr/local/bin/python \
    && uv python list

# Make the uv stores usable by the default non-root user (add pythons / cache).
RUN mkdir -p "${UV_CACHE_DIR}" \
    && chown -R node:node "${UV_PYTHON_INSTALL_DIR}" "${UV_CACHE_DIR}"

USER node

# [Optional] Extra OS packages (the `node` user has passwordless sudo):
# RUN sudo apt-get update \
#     && sudo apt-get -y install --no-install-recommends ripgrep \
#     && sudo rm -rf /var/lib/apt/lists/*
