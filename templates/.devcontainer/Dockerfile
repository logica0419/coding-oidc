FROM mcr.microsoft.com/devcontainers/base:bookworm

RUN curl -fsSL https://mise.run | sh \
  && mv /root/.local/bin/mise /usr/local/bin/mise \
  && chmod +x /usr/local/bin/mise
