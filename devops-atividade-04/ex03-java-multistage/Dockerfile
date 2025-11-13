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

# Compila a aplicação (skip tests para build mais rápido)
RUN mvn -q clean package -DskipTests

# ========================================
# ESTÁGIO 2: RUNTIME
# ========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia apenas o JAR compilado do estágio anterior
COPY --from=build /build/target/*.jar /app/app.jar

# Define o entrypoint para executar o JAR
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
