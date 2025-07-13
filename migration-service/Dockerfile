# Gunakan Node.js 20 Alpine sebagai base image
FROM node:20-alpine

# Instal dependensi sistem yang diperlukan oleh Prisma (libssl)
RUN apk add --no-cache openssl

# Tetapkan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi Node.js
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Jalankan migrasi Prisma
CMD ["npx", "prisma", "migrate", "deploy"]