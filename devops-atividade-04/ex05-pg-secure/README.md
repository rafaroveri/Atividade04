# Exercício 05: Conexão Segura com PostgreSQL

##  Objetivo

Criar uma imagem que se conecta a um PostgreSQL usando variáveis de ambiente, sem expor credenciais em logs ou build context.

##  O que será criado

- Imagem Alpine com `postgresql-client`
- Script `check.sh` que valida conexão de forma segura
- `.dockerignore` para bloquear arquivos sensíveis

##  Como executar

### Build da imagem

```bash
docker build -t cofre:1 .
```

### Executar com credenciais

```bash
docker run --rm \
  -e DB_HOST=localhost \
  -e DB_USER=postgres \
  -e DB_PASS=minhasenha \
  cofre:1
```

**IMPORTANTE**: Em produção, use Docker secrets ou ferramentas como Vault!

### Testar contra o DB do ex04

```bash
# Inicie o ex04 primeiro
cd ../ex04-healthcheck-compose
docker compose up -d

# Aguarde o DB ficar healthy, então:
cd ../ex05-pg-secure
docker run --rm --network ex04-healthcheck-compose_app-network \
  -e DB_HOST=ex04-db \
  -e DB_USER=devops \
  -e DB_PASS=senha123 \
  cofre:1
```

### Usando o Makefile (raiz do projeto)

```bash
make ex05
```

##  Critérios de aceite

- [x] Script valida presença de variáveis obrigatórias
- [x] Conexão com PostgreSQL funciona
- [x] Credenciais **não** aparecem em logs (use PGPASSWORD, não echo)
- [x] `.dockerignore` bloqueia `.env` e `*.pem`
- [x] Exit code != 0 se variáveis estiverem faltando

##  Resultados dos Testes

**Status:** APROVADO 

### Build da Imagem
-  Imagem baseada em Alpine 3.20
-  PostgreSQL client instalado
-  Script check.sh copiado e com permissão de execução
-  Tamanho: 19.6MB (muito eficiente!)

### Validação de Variáveis Obrigatórias
-  Sem DB_HOST: Erro exibido corretamente
-  Exit code != 0: Confirmado
-  Mensagens de erro direcionadas para stderr

### Conexão Segura com PostgreSQL
-  Conexão bem-sucedida com credenciais corretas
-  Falha de autenticação com credenciais incorretas
-  Senha não exposta nos logs
-  PGPASSWORD usado para autenticação automática
-  Informações do banco exibidas: PostgreSQL 16.11

### Segurança Implementada
-  `set -euo pipefail`: Script robusto com tratamento de erros
-  `cleanup trap`: Remove PGPASSWORD ao sair
-  Validações: Todas as variáveis verificadas antes de uso
-  Logs seguros: Senha nunca impressa

### .dockerignore Configurado
-  Bloqueia `*.env`
-  Bloqueia `*.pem`
-  Proteção contra arquivos sensíveis

### Como Reproduzir os Testes
```bash
# 1. Build da imagem
docker build -t cofre:1 .

# 2. Testar validação (deve falhar sem variáveis)
docker run --rm cofre:1

# 3. Subir o PostgreSQL do ex04
cd ../ex04-healthcheck-compose
docker compose up -d db

# 4. Aguardar DB inicializar (15-20 segundos)
# Então testar conexão segura
cd ../ex05-pg-secure
docker run --rm --network ex04-healthcheck-compose_app-network \
  -e DB_HOST=ex04-db \
  -e DB_USER=devops \
  -e DB_PASS=senha123 \
  cofre:1

# 5. Testar com senha incorreta (deve falhar)
docker run --rm --network ex04-healthcheck-compose_app-network \
  -e DB_HOST=ex04-db \
  -e DB_USER=devops \
  -e DB_PASS=senhaerrada \
  cofre:1

# 6. Limpar
cd ../ex04-healthcheck-compose
docker compose down
```

###  Nota sobre Line Endings (Windows)
Se o script `check.sh` apresentar erro de `pipefail` no Windows, converta os line endings:
```powershell
$content = Get-Content check.sh -Raw
$content = $content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("$PWD\check.sh", $content, [System.Text.UTF8Encoding]::new($false))
# Depois, rebuild a imagem
docker build -t cofre:1 .
```
- [ ] Exit code != 0 se variáveis estiverem faltando

##  Conceitos aprendidos

- Uso seguro de variáveis de ambiente
- Validação de pré-requisitos em scripts
- `set -euo pipefail` para robustez
- `.dockerignore` como camada de segurança
- Variável `PGPASSWORD` para evitar expor senha

##  Boas práticas de segurança

###  NÃO FAÇA
```bash
echo "Conectando com senha: $DB_PASS"  # Expõe em logs!
psql -h $DB_HOST -U $DB_USER -W         # Pede senha interativamente
```

###  FAÇA
```bash
export PGPASSWORD="$DB_PASS"            # Variável de ambiente
psql -h "$DB_HOST" -U "$DB_USER" -c ... # Usa PGPASSWORD implicitamente
unset PGPASSWORD                        # Limpa após uso
```

##  Teste de falha

```bash
# Sem variáveis (deve falhar com mensagem clara)
docker run --rm cofre:1

# Com variáveis incompletas
docker run --rm -e DB_HOST=localhost cofre:1
```

Ambos devem retornar exit code != 0 e mensagem de erro clara.

##  Checklist de segurança

- [ ] Nenhuma senha em Dockerfile
- [ ] Nenhuma senha em logs
- [ ] `.dockerignore` configurado
- [ ] Script valida inputs
- [ ] Usa `PGPASSWORD` em vez de `-W`
