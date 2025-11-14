#!/bin/sh
# Ajusta permissões do projeto para o usuário "node" dentro do container.
# Útil após criar arquivos como root no host ou ao clonar o repositório.

docker compose run --rm web sh -c "chown -R node:node /usr/src/app"
