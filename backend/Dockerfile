# Builder stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Installer les dépendances de build seulement
COPY package*.json ./
RUN npm ci

# Copier le code et builder
COPY . .
RUN npm run build

# Supprimer devDependencies pour image finale
RUN npm prune --production

# Runtime stage (production)
FROM node:18-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
# Par défaut le backend écoute sur le port 3000
ENV PORT=3000

# Copier build + dépendances prod
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
