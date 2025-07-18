# --- Multi-stage build for smaller production image ---
# Stage 1: Build and compile
FROM node:20-alpine AS builder

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate
 
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app/backend

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

RUN apk add --no-cache openssl libstdc++ ca-certificates

# Hanya install Prisma CLI sebagai runtime dependency (tidak perlu generate lagi di sini)
RUN npm install prisma --omit=dev --no-fund --no-audit --ignore-scripts

EXPOSE 3001
CMD ["npm", "start"]