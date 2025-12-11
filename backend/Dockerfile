# Builder stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests first for better caching
COPY package*.json ./

# Install deps (full) to be able to build
RUN npm install --silent

# Copy sources and build
COPY . .
RUN npm run build --silent

# Remove devDependencies to keep final image slim
RUN npm prune --production --silent

# Runtime stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy production deps and build output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
