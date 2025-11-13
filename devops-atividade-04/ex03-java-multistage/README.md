# Exercício 03: Java Multi-Stage Build

## 🎯 Objetivo

Demonstrar o poder do multi-stage build para reduzir drasticamente o tamanho da imagem final de aplicações Java.

## 📦 O que será criado

- Aplicação Java simples (Hello World)
- Dockerfile com 2 estágios:
  - **Build**: Maven + JDK completo para compilar
  - **Runtime**: JRE Alpine mínimo para executar

## 🔨 Como executar

### Build da imagem

```bash
docker build -t java-multi:1 .
```

### Executar aplicação

```bash
docker run --rm java-multi:1
```

Deve imprimir: `Hello Multi-Stage`

### Comparar tamanhos

```bash
docker images | grep java-multi
```

### Usando o Makefile (raiz do projeto)

```bash
make ex03
```

## ✅ Critérios de aceite

- [ ] Imagem constrói sem erros usando Maven
- [ ] Aplicação executa e imprime "Hello Multi-Stage"
- [ ] Imagem final < 200MB (vs ~600MB+ single-stage)
- [ ] Apenas JRE está presente na imagem final (não Maven/JDK completo)

## 💡 Conceitos aprendidos

- **Multi-stage builds**: separação entre build e runtime
- Otimização de tamanho de imagem
- Uso de Alpine para reduzir footprint
- Diferença entre JDK (desenvolvimento) e JRE (runtime)
- Cache de layers do Docker

## 🔍 Comparação de tamanhos

### Single-stage (NÃO otimizado)
```dockerfile
FROM maven:3.9-eclipse-temurin-17
# ... build e runtime no mesmo stage
# Resultado: ~600-700MB
```

### Multi-stage (OTIMIZADO)
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
# ... compila aqui

FROM eclipse-temurin:17-jre-alpine
# ... copia apenas o JAR
# Resultado: ~170-200MB
```

**Economia: ~70-75% de espaço!**

## 🧪 Teste adicional

Verifique o que está dentro da imagem final:

```bash
docker run --rm java-multi:1 sh -c "ls -lh /app && java -version"
```

Não deve haver Maven, código-fonte ou dependências de build.
