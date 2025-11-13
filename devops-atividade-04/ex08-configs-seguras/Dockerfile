FROM node:20-alpine

WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm ci --only=production

# Copia código da aplicação
COPY app.js ./

# Expõe porta
EXPOSE 8080

# Inicia aplicação
CMD ["node", "app.js"]
