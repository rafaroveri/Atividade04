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
