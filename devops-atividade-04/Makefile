.PHONY: help ex01 ex02 ex03 ex04 ex05 ex06 ex07 ex08 clean

# Cores para output (compatível com PowerShell via echo)
BOLD := 
RESET := 

help: ## Exibe esta mensagem de ajuda
	@echo "=========================================="
	@echo "  DevOps Atividade 04 - Makefile"
	@echo "=========================================="
	@echo ""
	@echo "Alvos disponíveis:"
	@echo ""
	@powershell -Command "Get-Content Makefile | Select-String '##' | ForEach-Object { $$_ -replace ':', '' -replace '##', '-' }"
	@echo ""

ex01: ## Executa exercício 01 (Alpine MOTD)
	@echo "[ex01] Construindo imagem cafe:1..."
	@cd ex01-alpine-motd && docker build -t cafe:1 .
	@echo "[ex01] Para testar, execute: docker run -it --rm cafe:1"

ex02: ## Executa exercício 02 (Node App)
	@echo "[ex02] Construindo imagem biblioteca:1..."
	@cd ex02-node-app && docker build -t biblioteca:1 .
	@echo "[ex02] Iniciando container na porta 3000..."
	@docker run -d --name biblioteca-app -p 3000:3000 biblioteca:1
	@timeout /t 2 /nobreak >nul
	@echo "[ex02] Testando endpoint..."
	@curl -s http://localhost:3000 || echo "Curl nao disponivel. Teste manualmente: http://localhost:3000"
	@echo "[ex02] Para parar: docker stop biblioteca-app && docker rm biblioteca-app"

ex03: ## Executa exercício 03 (Java Multi-stage)
	@echo "[ex03] Construindo imagem Java multi-stage..."
	@cd ex03-java-multistage && docker build -t java-multi:1 .
	@echo "[ex03] Executando aplicação..."
	@docker run --rm java-multi:1
	@echo "[ex03] Comparando tamanhos de imagem:"
	@docker images | findstr java-multi

ex04: ## Executa exercício 04 (Healthcheck Compose)
	@echo "[ex04] Iniciando stack com healthcheck..."
	@cd ex04-healthcheck-compose && docker compose up -d
	@echo "[ex04] Aguardando healthcheck (pode levar ~30s)..."
	@timeout /t 5 /nobreak >nul
	@echo "[ex04] Status dos serviços:"
	@cd ex04-healthcheck-compose && docker compose ps
	@echo "[ex04] Para parar: cd ex04-healthcheck-compose && docker compose down"

ex05: ## Executa exercício 05 (PostgreSQL Seguro)
	@echo "[ex05] Construindo imagem cofre:1..."
	@cd ex05-pg-secure && docker build -t cofre:1 .
	@echo "[ex05] Imagem pronta. Teste com:"
	@echo "  docker run --rm -e DB_HOST=localhost -e DB_USER=user -e DB_PASS=pass cofre:1"

ex06: ## Executa exercício 06 (Frontend Dev)
	@echo "[ex06] Iniciando ambiente de desenvolvimento..."
	@cd ex06-frontend-dev && docker compose up -d
	@echo "[ex06] Frontend disponível em http://localhost:5173"
	@echo "[ex06] Hot-reload ativo. Para parar: cd ex06-frontend-dev && docker compose down"

ex07: ## Executa exercício 07 (CI Local)
	@echo "[ex07] Iniciando pipeline CI local..."
	@cd ex07-ci-local && docker compose up --build
	@echo "[ex07] Pipeline concluído. Verifique os logs acima."

ex08: ## Executa exercício 08 (Configs Seguras)
	@echo "[ex08] Construindo e iniciando API..."
	@cd ex08-configs-seguras && docker compose up -d --build
	@timeout /t 3 /nobreak >nul
	@echo "[ex08] Testando endpoint /info..."
	@curl -s http://localhost:8080/info || echo "Curl nao disponivel. Acesse: http://localhost:8080/info"
	@echo "[ex08] Para parar: cd ex08-configs-seguras && docker compose down"

clean: ## Remove containers e imagens intermediárias
	@echo "[clean] Removendo containers parados..."
	@docker container prune -f
	@echo "[clean] Removendo imagens dangling..."
	@docker image prune -f
	@echo "[clean] Limpeza concluída!"
