# Exercício 08: Configurações Seguras

## 🎯 Objetivo

Demonstrar gestão segura de configurações usando variáveis de ambiente (.env) e arquivos de config montados como read-only via `configs` do Docker Compose.

## 📦 O que será criado

- API Node.js que lê configurações de múltiplas fontes
- `.env` (não commitado) para segredos e variáveis sensíveis
- `config.yml` distribuído como Docker config, montado em modo somente leitura
- Endpoint `/info` que expõe apenas informações sanitizadas

## 🗂️ Arquivos importantes

| Arquivo | Descrição |
| --- | --- |
| `Dockerfile` | Build da API Node.js |
| `docker-compose.yml` | Define serviço `api` com `env_file` e `configs` |
| `.env.example` | Modelo de variáveis de ambiente (copie para `.env`) |
| `config.yml` | Configurações não sensíveis montadas em `/etc/app/config.yml` |
| `app.js` | Código da API com leitura segura de configs |

## 🔨 Como executar

### Preparar ambiente

```bash
cd ex08-configs-seguras/

# Copie o arquivo de exemplo e preencha com valores reais
cp .env.example .env
vim .env  # ou editor de sua preferência
```

> ⚠️ O arquivo `.env` é lido automaticamente pelo Compose e **não deve ser commitado**.

### Iniciar API

```bash
docker compose up -d --build
```

API estará disponível em: **http://localhost:8080**

### Testar endpoint `/info`

```bash
curl http://localhost:8080/info | jq
```

A resposta deve conter:

- Metadados da aplicação vindos do `.env`
- Flags e opções vindas do `config.yml`
- Campos de segredo mascarados como `***CONFIGURED***`

### Validar que segredos não vazam em logs

1. Gere uma requisição:
   ```bash
   curl http://localhost:8080/info >/dev/null
   ```
2. Consulte os logs do serviço:
   ```bash
   docker compose logs api
   ```
3. Verifique que os valores sensíveis aparecem apenas mascarados (`***CONFIGURED***`).
4. Confirme que não há trechos contendo partes do segredo:
   ```bash
   docker compose logs api | grep -iE 'senha|secret|key' && echo "⚠️ Encontrado" || echo "✅ Limpo"
   ```

### Encerrar

```bash
docker compose down
```

### Usando o Makefile (raiz do projeto)

```bash
make ex08
```

## ✅ Critérios de aceite

- [x] API inicia e responde na porta 8080
- [x] Endpoint `/info` retorna configurações do `.env` e do `config.yml`
- [x] Segredos aparecem mascarados tanto no log quanto na resposta
- [x] Arquivo `config.yml` montado como config read-only (`mode: "0440"`)
- [x] `.env` real não está commitado no Git
- [x] `.env.example` documenta variáveis necessárias

## 💡 Conceitos aprendidos

- **Separação de configuração**: 12-factor app
- Uso de `.env` vs. arquivos de config montados via Compose
- Montagem read-only para segurança
- Mascaramento de segredos em logs/responses
- Diferença entre `.env.example` e `.env`

## 🔍 Estrutura de resposta `/info`

```json
{
  "app": {
    "name": "atividade04",
    "version": "1.0.0",
    "environment": "development"
  },
  "features": {
    "demo": true,
    "beta_features": false
  },
  "secrets": {
    "apiKey": "***CONFIGURED***",
    "databaseUrl": "***CONFIGURED***",
    "jwtSecret": "***CONFIGURED***"
  },
  "config": {
    "app_name": "atividade04",
    "feature_flags": {
      "demo": true
    }
  }
}
```

## 🧪 Teste de segurança adicional

```bash
# Logs não devem conter senhas
if docker compose logs api | grep -i password; then
  echo "⚠️ Atenção: encontrado termo sensível nos logs"
else
  echo "✅ Logs limpos"
fi

# Endpoint não deve expor segredos completos
curl http://localhost:8080/info | grep '***CONFIGURED***'
```

## 📝 Checklist de segurança

- [x] `.env` no `.gitignore`
- [x] `.env.example` commitado (valores fictícios)
- [x] `config.yml` montado como `:ro` via `configs`
- [x] Endpoint não expõe segredos completos
- [x] Logs não contêm credenciais
- [x] Validação de variáveis obrigatórias no startup

---

## ✅ Resultados dos Testes

**Status:** APROVADO ✅ (100%)

### ✓ Testes Executados

#### 1. Build e Inicialização (✅ APROVADO)
```
✅ Imagem construída com sucesso
✅ Container ex08-api iniciado
✅ API respondendo na porta 8080
✅ Configurações carregadas de /etc/app/config.yml
```

#### 2. Mascaramento de Segredos nos Logs (✅ APROVADO)
```
🔒 App Name: atividade04
🔒 API Key: ***CONFIGURED***
🔒 Database URL: ***CONFIGURED***
🔒 JWT Secret: ***CONFIGURED***
```
- ✅ Nenhum segredo exposto em texto plano
- ✅ Todos os valores sensíveis mascarados como `***CONFIGURED***`

#### 3. Endpoint /info (✅ APROVADO)
**Resposta recebida:**
```json
{
  "app": {
    "name": "atividade04",
    "version": "1.0.0",
    "environment": "development"
  },
  "features": {
    "demo": true,
    "beta_features": false,
    "experimental_ui": false
  },
  "secrets": {
    "apiKey": "***CONFIGURED***",
    "databaseUrl": "***CONFIGURED***",
    "jwtSecret": "***CONFIGURED***"
  },
  "config": {
    "app_name": "atividade04",
    "version": "1.0.0",
    "feature_flags": {
      "demo": true,
      "beta_features": false,
      "experimental_ui": false
    },
    "api": {
      "timeout_ms": 5000,
      "max_retries": 3,
      "rate_limit": {
        "window_ms": 60000,
        "max_requests": 100
      }
    },
    "logging": {
      "level": "info",
      "format": "json",
      "enabled": true
    },
    "cache": {
      "enabled": true,
      "ttl_seconds": 3600
    }
  }
}
```

**Validações:**
- ✅ Status HTTP 200
- ✅ Todos os segredos mascarados (`***CONFIGURED***`)
- ✅ Configurações do `.env` carregadas (APP_NAME, APP_VERSION)
- ✅ Configurações do `config.yml` carregadas (feature_flags, api, logging, cache)
- ✅ Estrutura JSON correta e completa

#### 4. Montagem Read-Only do config.yml (✅ APROVADO)
```bash
$ docker exec ex08-api sh -c "echo 'teste' >> /etc/app/config.yml"
sh: can't create /etc/app/config.yml: Read-only file system
```
- ✅ Arquivo montado como read-only (mode: "0440" no compose)
- ✅ Sistema bloqueia tentativas de escrita
- ✅ Proteção contra modificações acidentais/maliciosas

#### 5. Proteção do .env (✅ APROVADO)
```bash
$ git status --short ex08-configs-seguras/
(nenhuma mudança detectada)
```
- ✅ Arquivo `.env` criado localmente com valores sensíveis
- ✅ `.env` bloqueado pelo `.gitignore`
- ✅ `.env.example` presente com valores de exemplo
- ✅ Nenhum segredo commitado no repositório

#### 6. Busca por Vazamento nos Logs (✅ APROVADO)
```bash
$ docker compose logs api | Select-String -Pattern "senha|secret|key|p@ssw0rd|sk_live"
ex08-api  | 🔒 API Key: ***CONFIGURED***
ex08-api  | 🔒 JWT Secret: ***CONFIGURED***
```
- ✅ Nenhum valor sensível encontrado em texto plano
- ✅ Apenas strings mascaradas aparecem nos logs
- ✅ Termos como "secret" e "key" aparecem apenas nos labels, não nos valores

### 📊 Resumo dos Critérios de Aceite

| Critério | Status | Observação |
|----------|--------|------------|
| API inicia na porta 8080 | ✅ 100% | Container saudável e respondendo |
| Endpoint /info retorna configs | ✅ 100% | JSON completo com .env + config.yml |
| Segredos mascarados em logs | ✅ 100% | Todos aparecem como `***CONFIGURED***` |
| Segredos mascarados em response | ✅ 100% | JSON não expõe valores reais |
| config.yml read-only | ✅ 100% | Montado via `configs` com mode 0440 |
| .env não commitado | ✅ 100% | Bloqueado pelo .gitignore |
| .env.example presente | ✅ 100% | Documentação para desenvolvedores |

**Conceitos de Segurança Demonstrados:** 7/7 (100%)

### 🎓 Conceitos DevOps Validados

1. ✅ **12-Factor App (Config)**: Separação de configuração do código
2. ✅ **Secrets Management**: Variáveis sensíveis em `.env`, nunca em código
3. ✅ **Read-Only Mounts**: Proteção de arquivos críticos contra modificação
4. ✅ **Log Sanitization**: Mascaramento automático de credenciais
5. ✅ **Environment Variables**: Uso correto de `env_file` no Compose
6. ✅ **Docker Configs**: Feature nativa para distribuir configs imutáveis
7. ✅ **Security by Default**: Validação obrigatória de variáveis no startup

### 📝 Reprodução dos Testes

```bash
# 1. Preparar ambiente
cd ex08-configs-seguras/
cp .env.example .env
# Editar .env com valores de teste

# 2. Iniciar serviço
docker compose up -d --build

# 3. Verificar logs (segredos mascarados)
docker compose logs api

# 4. Testar endpoint
curl http://localhost:8080/info

# 5. Validar read-only
docker exec ex08-api sh -c "echo 'teste' >> /etc/app/config.yml"
# Deve retornar: Read-only file system

# 6. Verificar que .env não vaza no Git
git status --short ex08-configs-seguras/

# 7. Limpar
docker compose down
```

**Data do teste:** 13 de novembro de 2025  
**Ambiente:** Docker Desktop 28.5.2 no Windows  
**Resultado:** ✅ TODOS OS TESTES PASSARAM (100%)
