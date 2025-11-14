# Imagem base Alpine mínima
FROM alpine

# Instala bash e curl sem cache para manter imagem leve
RUN apk add --no-cache bash curl

# Copia a mensagem do dia para dentro do contêiner
COPY motd.txt /motd.txt

# Copia script de inicialização que mostra a mensagem e mantém o bash aberto
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Define o comando padrão para exibir o MOTD e iniciar uma sessão bash interativa
CMD ["/usr/local/bin/start.sh"]
