# Exercício 07: Pipeline CI Local

Simule uma esteira de CI/CD totalmente local utilizando Docker Compose, Docker-in-Docker e um registry privado.

## 🧱 Componentes do pipeline

| Serviço   | Função | Imagem base |
|-----------|--------|-------------|
| `registry` | Registry Docker local (porta `5000`) | `registry:2` |
| `app` | Constrói a aplicação, instala dependências e roda os testes automatizados | Build da pasta `app/` |
| `builder` | Ambiente Docker-in-Docker que realiza build da imagem, revalida testes e publica no registry | `docker:27-dind` |

Scripts auxiliares estão em `scripts/`:

- `run-tests.sh`: instala dependências e executa os testes da aplicação.
- `builder-entrypoint.sh`: sobe o daemon Docker-in-Docker, aguarda ficar disponível, realiza o build, executa os testes dentro da imagem e faz o push condicional para o registry local.

## ▶️ Executando a pipeline completa

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

## 🧪 Testando cenários

### Testes passando ✅

Manter `expect(true).toBe(true);` em `app/test.spec.js`.

Resultado esperado:
- Logs do serviço `app` mostram testes passando.
- O builder publica `registry:5000/biblioteca-ci:ci`.
- `curl http://localhost:5000/v2/biblioteca-ci/tags/list` retorna a tag `ci`.

### Testes falhando ❌

Altere `app/test.spec.js` para algo como `expect(true).toBe(false);` e execute novamente `docker compose up --build`.

Resultado esperado:
- O serviço `app` falha e interrompe o Compose (`exit code` ≠ 0).
- `docker compose ps` mostra `builder` como `Exit 1` porque depende do sucesso do `app`.
- Nenhuma nova tag aparece no registry.

## ℹ️ Dicas adicionais

- O volume `builder-cache` mantém o cache de camadas do Docker-in-Docker entre execuções.
- O registry utiliza o volume `registry-data` para persistir as imagens.
- Para executar a partir da raiz do repositório existe o atalho:

  ```bash
  make ex07
  ```

Aproveite para experimentar ajustes no Dockerfile, novos testes ou novas tags de imagem dentro do fluxo automatizado! 
