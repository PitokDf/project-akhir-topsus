FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source code
COPY . .

RUN npm run build

FROM node:20-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
