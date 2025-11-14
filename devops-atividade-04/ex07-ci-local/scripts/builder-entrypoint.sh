#!/bin/sh
set -euo pipefail

REGISTRY_URL=${REGISTRY_URL:-registry:5000}
IMAGE_NAME=${IMAGE_NAME:-biblioteca-ci}
IMAGE_TAG=${IMAGE_TAG:-ci}
APP_DIR=${APP_DIR:-/workspace/app}

cleanup() {
  if [ -n "${DOCKERD_PID:-}" ]; then
    kill "$DOCKERD_PID" 2>/dev/null || true
    wait "$DOCKERD_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

printf '\n==> Inicializando Docker-in-Docker\n'
DOCKER_TLS_CERTDIR="" dockerd-entrypoint.sh >/var/log/dockerd.log 2>&1 &
DOCKERD_PID=$!

printf 'Aguardando daemon Docker iniciar'
until docker info >/dev/null 2>&1; do
  printf '.'
  sleep 1
  if ! kill -0 "$DOCKERD_PID" 2>/dev/null; then
    echo "\nErro: dockerd nÃ£o estÃ¡ em execuÃ§Ã£o"
    cat /var/log/dockerd.log
    exit 1
  fi
done
printf '\nDocker pronto!\n'

FULL_IMAGE="$IMAGE_NAME:$IMAGE_TAG"
REGISTRY_IMAGE="$REGISTRY_URL/$IMAGE_NAME:$IMAGE_TAG"

printf '\n==> Construindo imagem %s\n' "$FULL_IMAGE"
docker build -t "$FULL_IMAGE" "$APP_DIR"

echo "==> Executando testes dentro da imagem"
docker run --rm "$FULL_IMAGE" npm test

echo "==> Publicando imagem em $REGISTRY_IMAGE"
docker tag "$FULL_IMAGE" "$REGISTRY_IMAGE"
docker push "$REGISTRY_IMAGE"

echo '\nðŸš€ Pipeline finalizado com sucesso!'
