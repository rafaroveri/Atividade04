# Imagem Node.js para desenvolvimento
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /usr/src/app

# Instala dependências globais úteis para dev
RUN npm install -g npm@latest

# Expõe porta padrão do Vite/dev servers
EXPOSE 5173

# Comando padrão (será sobrescrito pelo Compose)
CMD ["npm", "run", "dev", "--", "--host"]
