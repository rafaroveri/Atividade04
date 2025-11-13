# Imagem base Alpine (mínima e segura)
FROM alpine:3.20

# Instala bash e curl
RUN apk add --no-cache bash curl

# Copia arquivo com mensagem do dia
COPY motd.txt /motd.txt

# Exibe a mensagem ao iniciar o container
RUN echo 'cat /motd.txt' >> /etc/profile

# Inicia shell bash interativo
CMD ["bash", "-l"]
