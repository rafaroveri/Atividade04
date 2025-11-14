#!/bin/sh
set -euo pipefail

printf '\n==> Instalando dependências do projeto\n'
npm install --no-fund --no-audit >/dev/null

printf '\n==> Executando suíte de testes\n'
npm test
