# Gunakan image Nginx resmi sebagai base image
FROM nginx:alpine

# Salin file konfigurasi Nginx kustom
COPY uastopsus.conf /etc/nginx/conf.d/default.conf

# Ekspos port 80
EXPOSE 80

# Jalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]