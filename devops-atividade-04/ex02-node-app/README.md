# Exercício 02 · Aplicação Node.js

##  Objetivo
Containerizar a API simples em `index.js` utilizando uma imagem leve do Node.js e aplicando boas práticas no Dockerfile e no `.dockerignore`.

##  Estrutura criada
- `Dockerfile` baseado em `node:20-alpine`, com etapas separadas para dependências (`npm ci`) e cópia do código.
- `.dockerignore` bloqueando `node_modules/`, `.git/` e arquivos `*.log` do contexto de build.
- `package-lock.json` garantindo que `npm ci` funcione de forma determinística.

##  Como construir
Dentro da pasta `ex02-node-app/`:

```bash
docker build -t biblioteca:1 .
```

##  Como testar
1. Suba o container mapeando a porta 3000:
   ```bash
   docker run -d -p 3000:3000 biblioteca:1
   ```
2. Acesse em um navegador ou via `curl`:
   ```bash
   curl http://localhost:3000
   ```
3. Você deverá ver a mensagem **Biblioteca online ok**.

##  Limpeza opcional
```bash
docker ps --filter ancestor=biblioteca:1
# pegue o ID do container e remova, se desejar
docker stop <id>
docker rm <id>
```

##  Checklist
- [x] Imagem baseada em `node:20-alpine`.
- [x] Dependências instaladas com `npm ci` após copiar somente `package*.json`.
- [x] Código copiado em camada posterior e porta 3000 exposta.
- [x] `.dockerignore` evita envio de `node_modules`, `.git` e arquivos `.log`.
- [x] Passos claros para testar com `docker run -d -p 3000:3000 biblioteca:1` e validar em `http://localhost:3000`.

##  Resultados dos Testes

**Status:** APROVADO 

### Build
-  Imagem construída com sucesso baseada em `node:20-alpine`
-  Tamanho: 191MB
-  Tag: `biblioteca:1`

### Funcionalidades Testadas
-  Container iniciou corretamente
-  Aplicação respondendo na porta 3000
-  Resposta HTTP 200 com mensagem: "Biblioteca online ok"
-  Logs do servidor exibindo requisições

### Boas Práticas Verificadas
-  Cache de layers: `package*.json` copiado antes do código
-  npm ci: Instalação determinística de dependências
-  .dockerignore: Bloqueando `node_modules`, `.git` e `*.log`
-  WORKDIR definido: `/app`
-  Porta exposta: 3000

### Como Reproduzir os Testes
```bash
# 1. Build da imagem
docker build -t biblioteca:1 .

# 2. Executar container
docker run -d -p 3000:3000 --name biblioteca-test biblioteca:1

# 3. Testar a API
curl http://localhost:3000

# 4. Verificar logs
docker logs biblioteca-test

# 5. Limpar
docker stop biblioteca-test
docker rm biblioteca-test
```
