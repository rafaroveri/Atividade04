# Imagem Node.js Alpine (leve e eficiente)
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências primeiro (cache de layer)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
