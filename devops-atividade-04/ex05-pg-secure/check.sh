#!/bin/sh
# Script para verificar conexão com PostgreSQL de forma segura
# Uso: docker run --rm -e DB_HOST=... -e DB_USER=... -e DB_PASS=... cofre:1

set -euo pipefail

cleanup() {
  unset PGPASSWORD || true
}
trap cleanup EXIT

# ============================================
# VALIDAÇÃO DE VARIÁVEIS OBRIGATÓRIAS
# ============================================

if [ -z "${DB_HOST:-}" ]; then
  echo "❌ ERRO: Variável DB_HOST não definida!" >&2
  exit 1
fi

if [ -z "${DB_USER:-}" ]; then
  echo "❌ ERRO: Variável DB_USER não definida!" >&2
  exit 1
fi

if [ -z "${DB_PASS:-}" ]; then
  echo "❌ ERRO: Variável DB_PASS não definida!" >&2
  exit 1
fi

# ============================================
# CONEXÃO SEGURA (sem expor senha em logs)
# ============================================

echo "🔒 Conectando ao PostgreSQL..."
echo "   Host: $DB_HOST"
echo "   User: $DB_USER"
# ⚠️ NÃO imprime a senha!

# Define PGPASSWORD para autenticação automática (sem echo)
export PGPASSWORD="$DB_PASS"

# Tenta executar query simples
if psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "SELECT 1 AS test;" > /dev/null 2>&1; then
  echo "✅ Conexão bem-sucedida!"
  echo ""
  echo "📊 Informações do banco:"
  psql -h "$DB_HOST" -U "$DB_USER" -d postgres -t -c "SELECT version();" | head -n 1
else
  echo "❌ Falha na conexão com o banco de dados!" >&2
  exit 1
fi
