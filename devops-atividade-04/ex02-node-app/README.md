# Exercício 02: Aplicação Node.js

## 🎯 Objetivo

Containerizar uma aplicação Node.js simples seguindo boas práticas de Docker.

## 📦 O que será criado

- Servidor HTTP básico em Node.js (porta 3000)
- Dockerfile otimizado com Alpine
- `.dockerignore` para evitar arquivos desnecessários no build context

## 🔨 Como executar

### Build da imagem

```bash
docker build -t biblioteca:1 .
```

### Executar container

```bash
docker run -d --name biblioteca-app -p 3000:3000 biblioteca:1
```

### Testar aplicação

```bash
curl http://localhost:3000
```

Deve retornar: `Biblioteca online ok`

### Parar e remover container

```bash
docker stop biblioteca-app
docker rm biblioteca-app
```

### Usando o Makefile (raiz do projeto)

```bash
make ex02
```

## ✅ Critérios de aceite

- [ ] Imagem constrói sem erros
- [ ] Servidor responde na porta 3000
- [ ] Mensagem "Biblioteca online ok" é retornada
- [ ] `.dockerignore` impede cópia de `node_modules` e outros arquivos desnecessários
- [ ] Imagem usa Alpine (menor tamanho)

## 💡 Conceitos aprendidos

- Dockerfile multi-layer para Node.js
- Uso de `npm ci` (mais rápido e determinístico que `npm install`)
- Importância do `.dockerignore`
- Exposição de portas com `EXPOSE`
- Boas práticas: WORKDIR, COPY package*.json antes do código

## 🔍 Verificações adicionais

```bash
# Ver tamanho da imagem
docker images biblioteca:1

# Ver logs do container
docker logs biblioteca-app

# Inspecionar processos dentro do container
docker exec biblioteca-app ps aux
```
