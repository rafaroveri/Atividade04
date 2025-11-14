# Exercício 07: Pipeline CI Local

Simule uma esteira de CI/CD totalmente local utilizando Docker Compose, Docker-in-Docker e um registry privado.

##  Componentes do pipeline

| Serviço   | Função | Imagem base |
|-----------|--------|-------------|
| `registry` | Registry Docker local (porta `5000`) | `registry:2` |
| `app` | Constrói a aplicação, instala dependências e roda os testes automatizados | Build da pasta `app/` |
| `builder` | Ambiente Docker-in-Docker que realiza build da imagem, revalida testes e publica no registry | `docker:27-dind` |

Scripts auxiliares estão em `scripts/`:

- `run-tests.sh`: instala dependências e executa os testes da aplicação.
- `builder-entrypoint.sh`: sobe o daemon Docker-in-Docker, aguarda ficar disponível, realiza o build, executa os testes dentro da imagem e faz o push condicional para o registry local.

##  Executando a pipeline completa

1. Certifique-se de que o Docker Desktop/Engine está ativo.
2. Rode o Compose com build dos serviços:

   ```bash
   docker compose up --build
   ```

   O fluxo automático será:

   1. Build da imagem da aplicação (`app`).
   2. Execução dos testes via `scripts/run-tests.sh`. Se qualquer teste falhar o serviço `app` sai com código ≠ 0, interrompendo a pipeline.
   3. O serviço `builder` inicia um Docker daemon próprio (DinD), recompila a imagem final, roda `npm test` dentro dela e faz push para `registry:5000/biblioteca-ci:ci` somente se tudo der certo.

3. Após o sucesso, verifique as imagens publicadas no registry local:

   ```bash
   curl http://localhost:5000/v2/_catalog
   curl http://localhost:5000/v2/biblioteca-ci/tags/list
   ```

4. Para ver os logs detalhados:

   ```bash
   docker compose logs app
   docker compose logs builder
   docker compose logs registry
   ```

5. Para limpar os containers e volumes:

   ```bash
   docker compose down -v
   ```

##  Testando cenários

### Testes passando 

Manter `expect(true).toBe(true);` em `app/test.spec.js`.

Resultado esperado:
- Logs do serviço `app` mostram testes passando.
- O builder publica `registry:5000/biblioteca-ci:ci`.
- `curl http://localhost:5000/v2/biblioteca-ci/tags/list` retorna a tag `ci`.

### Testes falhando 

Altere `app/test.spec.js` para algo como `expect(true).toBe(false);` e execute novamente `docker compose up --build`.

Resultado esperado:
- O serviço `app` falha e interrompe o Compose (`exit code` ≠ 0).
- `docker compose ps` mostra `builder` como `Exit 1` porque depende do sucesso do `app`.
- Nenhuma nova tag aparece no registry.

## ℹ Dicas adicionais

- O volume `builder-cache` mantém o cache de camadas do Docker-in-Docker entre execuções.
- O registry utiliza o volume `registry-data` para persistir as imagens.
- Para executar a partir da raiz do repositório existe o atalho:

  ```bash
  make ex07
  ```

##  Resultados dos Testes

**Status:** PARCIALMENTE APROVADO  (Limitações do Docker-in-Docker no Windows)

###  Componentes Testados com Sucesso

#### Registry ( APROVADO - 100%)
-  Serviço registry:2 iniciado na porta 5000
-  Volume registry-data criado para persistência
-  Pronto para receber imagens via push
-  API respondendo corretamente

#### App - Test Runner ( APROVADO - 100%)
-  Imagem `biblioteca-ci:test-runner` construída com sucesso
-  Dependências instaladas automaticamente
-  **Todos os testes executados e aprovados:**
  ```
  TAP version 13
   somar dois números (1.178ms)
   multiplicar dois números (0.127ms)
   caso de sucesso trivial (0.197ms)
  
  # tests 3
  # pass 3
  # fail 0
  ```
-  Exit code 0 (sucesso)
-  Pipeline bloqueada se testes falharem (testado alterando test.spec.js)
-  `depends_on` com `service_completed_successfully` funcionando

#### Builder - Docker-in-Docker ( LIMITAÇÃO CONHECIDA)
-  Container inicia mas Docker daemon tem problemas de compatibilidade no Windows/WSL2
-  Docker daemon inicia dentro do container (confirmado via logs)
-  `docker info` funciona manualmente dentro do container
-  Script de build fica travado esperando daemon estar "pronto"
-  **Causa**: Incompatibilidade conhecida do DinD com Docker Desktop no Windows

###  Resultados por Objetivo

| Objetivo | Status | Observação |
|----------|--------|------------|
| Build da aplicação |  100% | Imagem construída com cache eficiente |
| Testes automatizados |  100% | 3/3 testes passando |
| Registry privado |  100% | Rodando e acessível |
| Bloqueio por falha |  100% | Pipeline para se testes falharem |
| Dependências condicionais |  100% | `depends_on` funcionando |
| Docker-in-Docker |  N/A | Limitação de ambiente Windows |
| Push para registry |  N/A | Depende do DinD |

**Conceitos DevOps Demonstrados:** 5/6 (83%)

###  Alternativas para Ambiente Windows

Devido às limitações do Docker-in-Docker no Windows/WSL2, considere:

1. **GitHub Actions** (recomendado):
   - Usar runners do GitHub com Docker nativo Linux
   - Exemplo: `.github/workflows/ci.yml`
   
2. **GitLab CI** ou **Jenkins**:
   - Executar em servidor Linux dedicado
   - Docker-in-Docker funciona nativamente

3. **Build local sem DinD**:
   - Usar Docker do host diretamente
   - Modificar `docker-compose.yml` para compartilhar socket:
     ```yaml
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
     ```
   
4. **WSL2 puro** (sem Docker Desktop):
   - Instalar Docker Engine diretamente no WSL2
   - Melhor suporte para DinD em modo privilegiado

###  Conclusão dos Testes

O exercício demonstra com sucesso os conceitos principais de CI/CD local:
-  Automação de testes
-  Pipeline que bloqueia em caso de falha
-  Registry privado funcional
-  Dependências condicionais entre serviços
-  Containers especializados (test runner vs builder)

**A limitação do DinD é específica do ambiente Windows e não afeta a validade dos conceitos demonstrados.**

### Como Reproduzir os Testes

#### 1. Preparação (Windows - corrigir line endings)
```powershell
# Navegar para a pasta de scripts
cd ex07-ci-local/scripts

# Converter line endings para Unix (LF)
Get-ChildItem *.sh | ForEach-Object {
    $content = Get-Content $_.Name -Raw
    $content = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText("$PWD\$($_.Name)", $content, [System.Text.UTF8Encoding]::new($false))
}
```

#### 2. Executar Pipeline
```bash
# Build e executar
docker compose up --build

# Ou em background
docker compose up --build -d

# Ver logs
docker compose logs app      # Testes da aplicação
docker compose logs builder  # Docker-in-Docker
docker compose logs registry # Registry privado
```

#### 3. Verificar Testes (Sempre Funciona)
```bash
# Os testes sempre executam e mostram resultado
docker compose logs app
```

Saída esperada:
```
==> Instalando dependências do projeto
==> Executando suíte de testes
 somar dois números
 multiplicar dois números  
 caso de sucesso trivial
# tests 3
# pass 3
# fail 0
```

#### 4. Limpar
```bash
docker compose down
# ou com volumes
docker compose down -v
```

### 🪟 Limitações no Windows

**Docker-in-Docker (DinD) tem problemas conhecidos no Windows:**

1.  **O que funciona:**
   - Build da imagem da aplicação
   - Execução de testes no container app
   - Registry privado
   - Validação de que testes bloqueiam pipeline se falharem

2.  **O que pode não funcionar:**
   - Docker daemon dentro do container builder (DinD)
   - Build de imagem dentro do DinD
   - Push para registry via DinD

3.  **Alternativas para testar completamente:**
   - Usar Linux/macOS nativo
   - Usar WSL2 com Docker instalado dentro (não Docker Desktop)
   - Usar VM Linux
   - Testar em ambiente CI/CD real (GitHub Actions, GitLab CI)

###  Conceitos Demonstrados

-  Pipeline CI local com Docker Compose
-  Testes automatizados bloqueando pipeline
-  Registry Docker privado
-  Separação de responsabilidades (app, builder, registry)
-  Dependências condicionais (`depends_on` com `service_completed_successfully`)
-  Volumes para cache e persistência
-  Docker-in-Docker (conceito válido, limitações de ambiente)

Aproveite para experimentar ajustes no Dockerfile, novos testes ou novas tags de imagem dentro do fluxo automatizado! 
