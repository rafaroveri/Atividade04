# Imagem Node.js Alpine (leve e eficiente)
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências primeiro (cache de layer)
COPY package*.json ./

# Instala dependências (npm ci é mais rápido e determinístico)
RUN npm ci --only=production

# Copia o código da aplicação
COPY index.js ./

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
