# Exercício 04: Healthcheck com Docker Compose

## 🎯 Objetivo

Demonstrar o uso de healthchecks e dependências condicionais entre serviços no Docker Compose.

## 📦 O que será criado

- Serviço de banco de dados PostgreSQL com healthcheck
- Serviço de aplicação (imagem Java multi-stage do exercício 03) que só inicia após o DB estar saudável
- Uso de `depends_on` com `condition: service_healthy`

## 🔨 Como executar

> 💡 O Docker Compose vai **construir automaticamente** a imagem Java multi-stage usando o Dockerfile do exercício `ex03-java-multistage` e só depois subir a aplicação quando o PostgreSQL estiver saudável.

### Iniciar stack

```bash
docker compose up -d
```

### Verificar status dos healthchecks

```bash
docker compose ps
```

O serviço `db` deve mostrar status `healthy` e o `app` só inicia após isso, comprovando o uso do `condition: service_healthy`.

### Ver logs

```bash
docker compose logs -f
```

Repare que o container do app exibe o log `⏳ Aguardando DB saudável...` antes de executar o `java -jar`, evidenciando que a aplicação só prossegue quando o banco está pronto.

### Parar stack

```bash
docker compose down
```

### Usando o Makefile (raiz do projeto)

```bash
make ex04
```

## ✅ Critérios de aceite

- [x] Banco PostgreSQL inicia e healthcheck passa
- [x] Aplicação só inicia após DB estar healthy (não apenas "started")
- [x] Logs mostram ordem correta: DB healthy → App iniciado
- [x] `docker compose ps` mostra status "healthy" para db

## 💡 Conceitos aprendidos

- **Healthcheck**: verificação ativa da saúde de um serviço
- **depends_on conditions**: controle fino de ordem de inicialização
- Diferença entre `started` vs `healthy` vs `completed`
- Uso de `pg_isready` para verificar PostgreSQL
- Tolerância a falhas e retry policies

## 🔍 Entendendo o healthcheck

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER"]
  interval: 10s      # Testa a cada 10s
  timeout: 5s        # Timeout de 5s por teste
  retries: 5         # 5 tentativas antes de marcar como unhealthy
  start_period: 10s  # Grace period inicial
```

O Docker executará o comando periodicamente. Após 5 sucessos consecutivos iniciais, o serviço é marcado como `healthy`.

## 🧪 Teste de falha

Tente modificar o healthcheck para falhar:

```yaml
test: ["CMD-SHELL", "exit 1"]  # Sempre falha
```

A aplicação nunca iniciará!

## 📊 Monitoramento

```bash
# Ver tentativas de healthcheck em tempo real
docker compose logs db -f

# Inspecionar detalhes do healthcheck
docker inspect ex04-healthcheck-compose-db-1 | grep -A 20 Health
```
