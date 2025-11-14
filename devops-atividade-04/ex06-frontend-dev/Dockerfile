# Imagem base Node.js enxuta para desenvolvimento frontend
FROM node:20-alpine

# Define diretório de trabalho da aplicação
WORKDIR /usr/src/app

# Atualiza o npm e garante que o diretório pertença ao usuário não-root "node"
RUN npm install -g npm@latest \
    && chown -R node:node /usr/src/app

# Usa o usuário "node" por padrão para evitar problemas de permissões
USER node

# Expõe a porta padrão utilizada por Vite e outros dev servers modernos
EXPOSE 5173

# Comando padrão (substituível pelo docker compose) para rodar o dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
