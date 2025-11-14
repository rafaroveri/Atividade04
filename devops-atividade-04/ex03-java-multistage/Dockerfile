# ========================================
# ESTÁGIO 1: BUILD
# ========================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /build

# Copia arquivos de configuração do Maven
COPY pom.xml .

# Baixa dependências (cache layer)
RUN mvn dependency:go-offline -B

# Copia código-fonte
COPY src ./src

# Compila a aplicação (gera o artefato em target/)
RUN mvn -q package

# ========================================
# ESTÁGIO 2: RUNTIME
# ========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia apenas o JAR compilado do estágio anterior; como este estágio usa apenas a JRE,
# ferramentas de build (Maven/JDK completo) ficam no estágio anterior, reduzindo o
# tamanho da imagem final e a superfície de ataque.
COPY --from=build /build/target/*.jar /app/app.jar

# Define o entrypoint para executar o JAR
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
