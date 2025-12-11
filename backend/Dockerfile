# Builder stage (use Debian base so native modules build reliably)
FROM node:18-bullseye AS builder

WORKDIR /app

# Install native build deps required for some npm modules (sqlite3 etc.)
RUN apt-get update && apt-get install -y \
  python3 \
  build-essential \
  make \
  g++ \
  libsqlite3-dev \
  libpq-dev \
  default-libmysqlclient-dev \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for better caching
COPY package*.json ./

# Install deps (full) to be able to build
RUN npm ci --silent

# Copy sources and build
COPY . .
RUN npm run build --silent

# Remove devDependencies to keep final image slim
RUN npm prune --production --silent

# Runtime stage (smaller Debian slim image)
FROM node:18-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production

# Copy production deps and build output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
