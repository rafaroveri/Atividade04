# DevOps - Atividade 04: Docker e Compose

Repositório com 8 exercícios práticos de Docker e Docker Compose, focando em boas práticas, segurança e automação.

## 📋 Exercícios

1. **ex01-alpine-motd**: Imagem Alpine customizada com mensagem de boas-vindas
2. **ex02-node-app**: Aplicação Node.js containerizada com boas práticas
3. **ex03-java-multistage**: Build multi-stage Java para otimização de tamanho
4. **ex04-healthcheck-compose**: Healthchecks e dependências entre serviços
5. **ex05-pg-secure**: Conexão segura com PostgreSQL sem expor credenciais
6. **ex06-frontend-dev**: Ambiente de desenvolvimento com hot-reload
7. **ex07-ci-local**: Pipeline CI local com testes e registry
8. **ex08-configs-seguras**: Gestão segura de configurações e secrets

## 🚀 Como usar

### Pré-requisitos
- Docker Engine 24+
- Docker Compose V2
- Make (opcional, facilita comandos)

### Comandos rápidos

```bash
# Listar todos os comandos disponíveis
make help

# Executar um exercício específico
make ex01
make ex02
# ... até ex08

# Limpar recursos intermediários
make clean
```

### Executar sem Make

Cada exercício possui seu próprio README.md com instruções detalhadas. Navegue até a pasta e siga os passos.

## ✅ Critérios de aceite gerais

- [ ] Todos os comandos de build/run executam sem erros
- [ ] Portas corretas expostas (3000, 5173, 5432, 8080)
- [ ] `.dockerignore` aplicado onde necessário
- [ ] Nenhum segredo aparece em logs ou build context
- [ ] Imagem multi-stage é significativamente menor
- [ ] Healthcheck funciona e gateia dependências
- [ ] Pipeline CI bloqueia push se testes falharem
- [ ] Configurações são carregadas de forma segura

## 📚 Conceitos abordados

- Dockerfile best practices (Alpine, multi-stage, .dockerignore)
- Docker Compose (healthchecks, depends_on, networks, volumes)
- Segurança (secrets, variáveis de ambiente, read-only configs)
- Desenvolvimento local (hot-reload, bind mounts)
- CI/CD local (Docker-in-Docker, registry, testes automatizados)

## 🎯 Checklist final

- [ ] ex01: Mensagem MOTD exibida ao iniciar container
- [ ] ex02: Servidor Node responde na porta 3000
- [ ] ex03: Imagem runtime < 200MB (vs ~600MB single-stage)
- [ ] ex04: App só inicia após DB estar healthy
- [ ] ex05: Script valida credenciais sem expor em logs
- [ ] ex06: Mudanças no código refletem sem rebuild
- [ ] ex07: Push no registry só ocorre se `npm test` passar
- [ ] ex08: Endpoint `/info` retorna configs do .env e config.yml

## 📝 Notas

- Este é um esqueleto funcional mínimo. Expanda conforme necessário.
- Todos os exemplos usam credenciais DEMO. **Nunca** commite `.env` real.
- Para produção, use Docker secrets, Vault ou equivalente.

---

**Autor**: [Seu Nome]  
**Data**: Outubro 2025  
**Disciplina**: Gerência de Configuração e DevOps
