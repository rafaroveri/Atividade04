# Imagem Alpine leve
FROM alpine:3.20

# Instala cliente PostgreSQL
RUN apk add --no-cache postgresql-client

# Copia script de verificação
COPY check.sh /check.sh

# Garante permissão de execução
RUN chmod +x /check.sh

# Define o script como entrypoint
ENTRYPOINT ["sh", "/check.sh"]
