# Exercício 08: Configurações Seguras

## 🎯 Objetivo

Demonstrar gestão segura de configurações usando variáveis de ambiente (.env) e arquivos de config montados como read-only.

## 📦 O que será criado

- API Node.js que lê configurações de múltiplas fontes
- `.env` para variáveis sensíveis (não commitado)
- `config.yml` para configurações de aplicação
- Endpoint `/info` que expõe configs (exceto segredos)

## 🔨 Como executar

### Preparar ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas configurações (não commite!)
```

### Iniciar API

```bash
docker compose up -d --build
```

API estará disponível em: **http://localhost:8080**

### Testar endpoint

```bash
curl http://localhost:8080/info
```

Deve retornar JSON com:
- Variáveis do `.env` (selecionadas)
- Conteúdo do `config.yml`
- **SEM expor** segredos completos

### Ver logs (não devem conter senhas!)

```bash
docker compose logs api
```

### Parar

```bash
docker compose down
```

### Usando o Makefile (raiz do projeto)

```bash
make ex08
```

## ✅ Critérios de aceite

- [ ] API inicia e responde na porta 8080
- [ ] Endpoint `/info` retorna configurações do `.env` e `config.yml`
- [ ] Senhas/tokens **não** aparecem em logs
- [ ] Arquivo `config.yml` montado como read-only
- [ ] `.env` real **não** está commitado no Git
- [ ] `.env.example` documenta variáveis necessárias

## 💡 Conceitos aprendidos

- **Separação de configuração**: 12-factor app
- Uso de `.env` vs. arquivos de config
- Montagem read-only para segurança
- Mascaramento de segredos em logs/responses
- Diferença entre `.env.example` e `.env`

## 🔒 Boas práticas de segurança

### ✅ FAÇA

```javascript
// Exponha apenas o necessário
app.get('/info', (req, res) => {
  res.json({
    appName: process.env.APP_NAME,
    environment: process.env.NODE_ENV,
    // Mascara segredos
    databaseUrl: process.env.DB_URL ? '***CONFIGURED***' : 'NOT_SET'
  });
});
```

### ❌ NÃO FAÇA

```javascript
// NUNCA exponha process.env completo!
app.get('/info', (req, res) => {
  res.json(process.env);  // ⚠️ Expõe TODOS os segredos!
});

// NUNCA logue senhas
console.log('Senha do DB:', process.env.DB_PASS);  // ⚠️ Perigoso!
```

## 📋 Hierarquia de configuração

1. **Variáveis de ambiente** (.env): Segredos, credenciais, URLs
2. **Arquivos de config** (config.yml): Feature flags, configurações de app
3. **Defaults no código**: Fallbacks seguros

Exemplo:
```javascript
const port = process.env.PORT || 8080;  // .env > default
```

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
    "apiV2": false
  },
  "secrets": {
    "apiKey": "***CONFIGURED***",
    "databaseUrl": "***CONFIGURED***"
  },
  "config": {
    "app_name": "atividade04",
    "feature_flags": {
      "demo": true
    }
  }
}
```

## 🧪 Teste de segurança

### Verificar que segredos não aparecem:

```bash
# Logs não devem conter senhas
docker compose logs api | grep -i password
# (deve retornar vazio)

# Endpoint não deve expor segredos completos
curl http://localhost:8080/info | grep -i "secret_api_key"
# (deve aparecer mascarado: "***CONFIGURED***")
```

## 📝 Checklist de segurança

- [ ] `.env` no `.gitignore`
- [ ] `.env.example` commitado (valores fake)
- [ ] `config.yml` montado como `:ro` (read-only)
- [ ] Endpoint não expõe segredos completos
- [ ] Logs não contêm credenciais
- [ ] Validação de variáveis obrigatórias no startup
