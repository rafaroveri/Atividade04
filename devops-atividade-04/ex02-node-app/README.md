# Exercício 02 · Aplicação Node.js

## 🎯 Objetivo
Containerizar a API simples em `index.js` utilizando uma imagem leve do Node.js e aplicando boas práticas no Dockerfile e no `.dockerignore`.

## 📁 Estrutura criada
- `Dockerfile` baseado em `node:20-alpine`, com etapas separadas para dependências (`npm ci`) e cópia do código.
- `.dockerignore` bloqueando `node_modules/`, `.git/` e arquivos `*.log` do contexto de build.
- `package-lock.json` garantindo que `npm ci` funcione de forma determinística.

## ▶️ Como construir
Dentro da pasta `ex02-node-app/`:

```bash
docker build -t biblioteca:1 .
```

## 🚀 Como testar
1. Suba o container mapeando a porta 3000:
   ```bash
   docker run -d -p 3000:3000 biblioteca:1
   ```
2. Acesse em um navegador ou via `curl`:
   ```bash
   curl http://localhost:3000
   ```
3. Você deverá ver a mensagem **Biblioteca online ok**.

## 🧹 Limpeza opcional
```bash
docker ps --filter ancestor=biblioteca:1
# pegue o ID do container e remova, se desejar
docker stop <id>
docker rm <id>
```

## ✅ Checklist
- [x] Imagem baseada em `node:20-alpine`.
- [x] Dependências instaladas com `npm ci` após copiar somente `package*.json`.
- [x] Código copiado em camada posterior e porta 3000 exposta.
- [x] `.dockerignore` evita envio de `node_modules`, `.git` e arquivos `.log`.
- [x] Passos claros para testar com `docker run -d -p 3000:3000 biblioteca:1` e validar em `http://localhost:3000`.
