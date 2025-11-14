# Exercício 03 – Java Multi-Stage

##  Objetivo

Demonstrar o uso de multi-stage build para criar uma imagem Java otimizada, separando o ambiente de build do ambiente de runtime.

##  O que será criado

- **Estágio 1 (BUILD)**: Maven 3.9 com JDK 17 completo para compilação
- **Estágio 2 (RUNTIME)**: Eclipse Temurin 17 JRE Alpine apenas com o JAR compilado
- Imagem final otimizada sem ferramentas de build

## Como construir
```bash
docker build -t java-multi:1 .
```

## Como executar
```bash
docker run --rm java-multi:1
```

##  Resultados dos Testes

**Status:** APROVADO 

### Build Multi-Stage
-  **Estágio 1**: Maven 3.9 com JDK 17 - Dependências baixadas e aplicação compilada
-  **Estágio 2**: Eclipse Temurin 17 JRE Alpine - Apenas JAR copiado
-  Imagem final: 252MB (muito menor que com Maven/JDK completo)

### Execução da Aplicação
-  Aplicação executou corretamente
-  Mensagem "Hello Multi-Stage" exibida
-  Informações do ambiente:
  - Java Version: 17.0.17
  - Java Vendor: Eclipse Adoptium
  - OS: Linux

### Boas Práticas Verificadas
-  Multi-stage build com 2 estágios bem definidos
-  Cache de dependências: `mvn dependency:go-offline`
-  COPY separado: pom.xml primeiro, depois src
-  Imagem Alpine no runtime para redução de tamanho
-  Apenas artefato necessário: JAR copiado com `COPY --from=build`
-  ENTRYPOINT definido para execução direta

### Benefícios Demonstrados
-  Imagem final não contém Maven, código-fonte ou dependências de build
-  Superfície de ataque reduzida (apenas JRE + app)
-  Tamanho otimizado (252MB vs ~600MB+ com Maven completo)
-  Cache de layers eficiente para builds subsequentes

### Como Reproduzir os Testes
```bash
# 1. Build da imagem multi-stage
docker build -t java-multi:1 .

# 2. Executar a aplicação
docker run --rm java-multi:1

# 3. Verificar tamanho da imagem
docker images java-multi:1
```
