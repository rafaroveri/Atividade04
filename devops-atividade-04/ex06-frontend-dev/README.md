# Exercício 06: Ambiente de Desenvolvimento Frontend

##  Objetivo

Configurar ambiente de desenvolvimento com hot-reload usando Docker Compose e bind mounts.

##  O que será criado

- Dockerfile com Node.js para frontend
- Docker Compose com bind mount para código
- Hot-reload automático ao salvar arquivos

##  Como executar

### Iniciar ambiente de desenvolvimento

```bash
docker compose up
```

>  Durante o primeiro `docker compose up`, o serviço instalará as dependências
> automaticamente (quando existir um `package.json`) e, em seguida, iniciará o
> servidor de desenvolvimento.

O servidor estará disponível em: **http://localhost:5173**

### Testar hot-reload

1. Acesse http://localhost:5173 no navegador
2. Edite qualquer arquivo do projeto (ex: adicione HTML/JS)
3. Salve o arquivo
4. O navegador deve recarregar automaticamente

### Parar ambiente

```bash
docker compose down
```

### Usando o Makefile (raiz do projeto)

```bash
make ex06
```

##  Critérios de aceite

- [x] Container inicia e expõe porta 5173
- [x] Bind mount funciona (mudanças no host refletem no container)
- [x] Hot-reload funciona (sem rebuild de imagem)
- [x] Servidor acessível via navegador

##  Resultados dos Testes

**Status:** APROVADO 

### Build e Execução
-  Imagem baseada em `node:20-alpine`
-  Tamanho: 251MB
-  Container iniciou com sucesso
-  Servidor Vite rodando na porta 5173

### Bind Mount e Hot-Reload
-  Bind mount funcionando: Mudanças no host refletem instantaneamente no container
-  Hot-reload do Vite ativo: Servidor detecta mudanças automaticamente
-  Arquivo editado no host foi visto dentro do container
-  Sem necessidade de rebuild de imagem

### Configuração
-  Servidor respondendo em http://localhost:5173
-  HTTP 200 OK ao acessar a aplicação
-  Vite dev server iniciado com sucesso
-  Network frontend-network criada

### Como Reproduzir os Testes

#### 1. Preparação (primeira vez)
```bash
# Instalar dependências
docker compose run --rm web npm install
```

#### 2. Iniciar servidor de desenvolvimento
```bash
# Subir o ambiente
docker compose up -d

# Verificar se está rodando
docker ps --filter name=ex06

# Ver logs
docker logs ex06-frontend-dev
```

#### 3. Testar no navegador
- Acesse: http://localhost:5173
- Você verá a página padrão do Vite

#### 4. Testar Hot-Reload
```bash
# Edite src/main.js (altere o título ou adicione conteúdo)
# Exemplo: mude "Hello Vite!" para "Hello Vite! - DevOps Atividade 04 "

# Verifique que a mudança reflete no container
docker exec ex06-frontend-dev cat /usr/src/app/src/main.js

# Atualize o navegador - você verá as mudanças!
```

#### 5. Parar ambiente
```bash
docker compose down
```

### 🪟 Nota para Windows

No Windows, o volume anônimo para `node_modules` pode causar conflitos. A configuração foi ajustada:

1.  Adicionado `user: root` no docker-compose para evitar problemas de permissão
2.  Comentado o volume anônimo de node_modules
3.  `npm install` deve ser executado via `docker compose run` antes de `up`

Se tiver problemas de permissão, execute:
```bash
docker compose run --rm web npm install
```

##  Conceitos aprendidos

- **Bind mounts**: sincronização bidirecional host ↔ container
- **Hot-reload**: desenvolvimento sem rebuild constante
- Diferença entre volumes e bind mounts
- Flag `--host` para aceitar conexões externas
- Benefícios de Compose para dev vs. produção

##  Como funciona o bind mount

```yaml
volumes:
  - .:/usr/src/app  # Mapeia diretório atual → /usr/src/app
```

Qualquer mudança no host é visível no container **instantaneamente**.

##  Troubleshooting

### Problema: "EACCES: permission denied"

**Solução (Linux/Mac)**:
```bash
# Ajusta permissões do projeto para o usuário "node" do container
./scripts/fix-permissions.sh
```

> O script executa `docker compose run --rm web chown -R node:node /usr/src/app`.
> Execute-o sempre que notar arquivos criados como `root` no host.

### Problema: Hot-reload não funciona

**Verificar**:
1. Servidor dev está rodando com `--host`
2. Bind mount está configurado corretamente
3. Firewall não está bloqueando porta 5173

### Problema: "node_modules" do host conflita

**Solução**: Use volume anônimo para node_modules:
```yaml
volumes:
  - .:/usr/src/app
  - /usr/src/app/node_modules  # Volume anônimo (isolado)
```

##  Comparação: Dev vs. Prod

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Volumes | Bind mount (sync) | Named volume ou COPY |
| Build | Dev server | Build otimizado |
| Hot-reload | Sim | Não |
| Otimização | Não | Minificação, tree-shaking |
| Segurança | Relaxada | Restrita |

##  Exemplo de projeto frontend

Para testar, crie um `index.html` simples:

```html
<!DOCTYPE html>
<html>
<head>
    <title>DevOps - Ex06</title>
</head>
<body>
    <h1>Frontend com Hot-Reload! </h1>
    <p>Edite este arquivo e veja a mágica acontecer.</p>
</body>
</html>
```

Ou use Vite/Vite+React:
```bash
npm create vite@latest . -- --template vanilla
docker compose up
```
