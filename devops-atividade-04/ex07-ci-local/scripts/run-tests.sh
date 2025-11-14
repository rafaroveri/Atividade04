#!/bin/sh
set -euo pipefail

printf '\n==> Instalando dependÃªncias do projeto\n'
npm install --no-fund --no-audit >/dev/null

printf '\n==> Executando suÃ­te de testes\n'
npm test
