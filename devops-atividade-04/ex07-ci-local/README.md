# Exercício 07: Pipeline CI Local

## 🎯 Objetivo

Simular pipeline CI/CD local usando Docker-in-Docker (DinD) e registry privado. Testes devem passar antes de publicar imagem.

## 📦 O que será criado

- Registry Docker local (porta 5000)
- Docker-in-Docker (DinD) para builds isolados
- Aplicação Node.js com testes
- Builder que só faz push se testes passarem

## 🔨 Como executar

### Iniciar pipeline

```bash
docker compose up --build
```

O pipeline executará:
1. Build da imagem da aplicação
2. Execução dos testes (`npm test`)
3. **Se testes passarem**: push para registry local
4. **Se testes falharem**: pipeline interrompe, sem push

### Verificar imagens no registry

```bash
curl http://localhost:5000/v2/_catalog
```

### Forçar falha nos testes

Edite `app/test.spec.js` e mude `expect(true).toBe(true)` para `expect(true).toBe(false)`.

Rode novamente:
```bash
docker compose up --build
```

A imagem **não** será publicada no registry!

### Limpar

```bash
docker compose down
```

### Usando o Makefile (raiz do projeto)

```bash
make ex07
```

## ✅ Critérios de aceite

- [ ] Registry local inicia corretamente
- [ ] App é construída e testada
- [ ] Testes passando: imagem aparece no registry
- [ ] Testes falhando: imagem NÃO aparece no registry (pipeline falha)
- [ ] Logs mostram output dos testes

## 💡 Conceitos aprendidos

- **Docker-in-Docker (DinD)**: build de imagens dentro de containers
- **Registry privado**: armazenamento local de imagens
- **Gating**: bloquear deployment se qualidade falhar
- CI/CD local para testes rápidos
- Privileged mode e suas implicações de segurança

## 🔍 Arquitetura do pipeline

```
┌─────────────┐
│   app       │ → Código Node.js + testes
└─────────────┘
       ↓
┌─────────────┐
│   builder   │ → Build + test + push (condicional)
└─────────────┘
       ↓
┌─────────────┐
│   dind      │ → Docker daemon isolado
└─────────────┘
       ↓
┌─────────────┐
│  registry   │ → Registry privado (localhost:5000)
└─────────────┘
```

## 🚨 Segurança: DinD em produção

⚠️ **ATENÇÃO**: `privileged: true` é necessário para DinD, mas é um risco de segurança!

**Alternativas para produção**:
- Kaniko (rootless builds)
- BuildKit
- CI/CD managed (GitHub Actions, GitLab CI, etc.)

## 🧪 Teste de qualidade

### Cenário 1: Testes passam ✅
```javascript
// test.spec.js
expect(2 + 2).toBe(4);  // ✅ Passa
```
**Resultado**: Imagem publicada no registry

### Cenário 2: Testes falham ❌
```javascript
// test.spec.js
expect(2 + 2).toBe(5);  // ❌ Falha
```
**Resultado**: Pipeline interrompe, nenhuma imagem publicada

## 📊 Verificar logs

```bash
# Ver logs do builder (onde ocorrem testes e push)
docker compose logs builder

# Ver logs do app (aplicação em si)
docker compose logs app

# Ver imagens no registry
curl http://localhost:5000/v2/biblioteca-ci/tags/list
```

## 🔧 Customização

Para adaptar a outro projeto:

1. Substitua `app/` pelo seu código
2. Ajuste `npm test` no Dockerfile
3. Configure variáveis no `docker-compose.yml`
4. Adapte o script do builder
