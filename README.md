# Proyek Akhir Topik Khusus: Sistem Kasir Berbasis Layanan Mikro

Selamat datang di repositori Proyek Akhir Topik Khusus. Proyek ini adalah implementasi sistem kasir modern yang dibangun di atas arsitektur layanan mikro, dirancang untuk menjadi tangguh, skalabel, dan mudah dikelola.

## 🌟 Arsitektur Sistem

Proyek ini memecah fungsionalitas aplikasi menjadi beberapa layanan independen yang berkomunikasi satu sama lain. Nginx bertindak sebagai _reverse proxy_ (API Gateway) yang mengarahkan permintaan dari klien ke layanan yang sesuai, sementara RabbitMQ menangani komunikasi asinkron antar layanan.

### Komponen Sistem

- **🌐 `nginx`**: **API Gateway**. Bertindak sebagai _reverse proxy_ yang menerima semua permintaan masuk dan meneruskannya ke layanan frontend atau backend yang relevan.
- **🖥️ `frontend`**: **Antarmuka Pengguna**. Dibangun dengan Next.js, ini adalah tempat pengguna berinteraksi dengan sistem.
- **🦸‍♂️ `auth-service`**: **Layanan Otentikasi**. Menangani otentikasi (login, register) dan manajemen pengguna menggunakan JWT.
- **🍔 `menu-service`**: **Layanan Menu**. Mengelola semua data terkait menu, kategori, dan item yang tersedia.
- **💸 `transaction-service`**: **Layanan Transaksi**. Memproses dan mencatat semua transaksi penjualan, serta berinteraksi dengan payment gateway.
- **📊 `report-service`**: **Layanan Laporan**. Mengagregasi data untuk menghasilkan laporan penjualan dan analitik lainnya.
- **📜 `migration-service`**: **Layanan Migrasi**. Menjalankan migrasi skema database secara otomatis untuk memastikan semua layanan bekerja dengan struktur data yang konsisten.
- **🐇 `rabbitmq`**: **Message Broker**. Memfasilitasi komunikasi asinkron, terutama untuk notifikasi pembayaran, memastikan sistem tetap responsif.
- **🗄️ `postgres_db`**: **Database Terpusat**. Database PostgreSQL yang menyimpan semua data aplikasi.

## 📂 Struktur Proyek

```
.
├── 🐳 docker-compose.yml      # Mendefinisikan dan menjalankan semua layanan
├── 📁 auth-service/           # Layanan untuk otentikasi & manajemen pengguna
├── 📁 menu-service/           # Layanan untuk mengelola menu dan produk
├── 📁 transaction-service/    # Layanan untuk memproses transaksi
├── 📁 report-service/         # Layanan untuk menghasilkan laporan
├── 📁 migration-service/      # Menangani migrasi skema database
├── 📁 frontend/               # Aplikasi antarmuka pengguna (Next.js)
├── 📁 nginx/                  # Konfigurasi Nginx sebagai reverse proxy
└── 📜 README.md               # Dokumentasi proyek
```

## 🚀 Memulai (Getting Started)

Pastikan Anda sudah menginstal **Docker** dan **Docker Compose** di sistem Anda.

### 1. Kloning Repositori

```bash
git clone https://github.com/pitok-p/project-akhir-topsus.git
cd project-akhir-topsus
```

### 2. Konfigurasi Variabel Lingkungan

Proyek ini membutuhkan beberapa file `.env` untuk berjalan.

**a. Konfigurasi Utama (Root)**

Buat file `.env` di direktori utama dengan menyalin dari contohnya. File ini berisi konfigurasi untuk Docker Compose, seperti kredensial database.

```bash
cp .env.example .env
```

> **Penting:** Buka file `.env` yang baru dibuat dan sesuaikan nilainya jika diperlukan.

**b. Konfigurasi per Layanan**

Setiap layanan backend juga memerlukan file `.env`-nya sendiri. Salin dari file `.env.example` yang ada di masing-masing direktori layanan.

```bash
# Contoh untuk auth-service
cp auth-service/.env.example auth-service/.env

# Lakukan hal yang sama untuk menu-service, transaction-service, dan report-service
cp menu-service/.env.example menu-service/.env
cp transaction-service/.env.example transaction-service/.env
cp report-service/.env.example report-service/.env
```

### 3. Jalankan Aplikasi

Dengan satu perintah, Docker Compose akan membangun dan menjalankan seluruh ekosistem aplikasi.

```bash
docker-compose up -d --build
```

Perintah `--build` memastikan Docker membangun ulang _image_ jika ada perubahan pada `Dockerfile` atau kode sumber.

### 4. Akses Aplikasi

- **Frontend/UI**: `http://localhost`
- **API Gateway**: `http://localhost/api`

## 🛠️ Skrip Pengembangan

Setiap layanan backend memiliki skrip `npm` yang berguna untuk pengembangan. Untuk menjalankannya, masuk ke dalam _container_ layanan yang relevan.

Contoh untuk `auth-service`:

```bash
# Masuk ke dalam container auth-service
docker-compose exec auth-service sh

# Setelah berada di dalam container, Anda bisa menjalankan skrip:
npm run test          # Menjalankan pengujian
npm run db:generate   # Membuat ulang Prisma Client
npm run db:seed       # Mengisi database dengan data awal
```

## 🌐 API Endpoints

Berikut adalah daftar endpoint yang tersedia untuk setiap layanan.

### Auth Service (`/api/auth`)

- **`POST /register`**: Mendaftarkan pengguna baru.
- **`POST /login`**: Mengotentikasi pengguna dan mengembalikan token JWT.
- **`GET /users`**: Mengambil daftar semua pengguna.
- **`POST /users`**: Membuat pengguna baru.
- **`GET /users/:userId`**: Mengambil detail pengguna spesifik.
- **`PATCH /users/:userId`**: Memperbarui informasi pengguna spesifik.
- **`DELETE /users/:userId`**: Menghapus pengguna spesifik.

### Menu Service (`/api/menu`)

- **`GET /categories`**: Mengambil semua kategori menu.
- **`POST /categories`**: Membuat kategori baru.
- **`GET /categories/:id`**: Mengambil detail kategori spesifik.
- **`PUT /categories/:id`**: Memperbarui kategori spesifik.
- **`DELETE /categories/:id`**: Menghapus kategori spesifik.
- **`GET /menus`**: Mengambil semua item menu.
- **`POST /menus`**: Membuat item menu baru.
- **`GET /menus/:id`**: Mengambil detail item menu spesifik.
- **`PUT /menus/:id`**: Memperbarui item menu spesifik.
- **`DELETE /menus/:id`**: Menghapus item menu spesifik.

### Transaction Service (`/api/transaction`)

- **`POST /`**: Membuat transaksi baru.
- **`GET /`**: Mengambil riwayat semua transaksi.
- **`GET /:id`**: Mengambil detail transaksi spesifik.
- **`POST /webhook`**: Menerima notifikasi status pembayaran dari Midtrans.

### Report Service (`/api/report`)

- **`GET /sales`**: Mengambil data laporan penjualan dalam format JSON.
- **`GET /sales/download`**: Mengunduh laporan penjualan dalam format PDF.

## 💻 Teknologi yang Digunakan

| Kategori           | Teknologi                    |
| ------------------ | ---------------------------- |
| **Backend**        | Node.js, Express, TypeScript |
| **Frontend**       | Next.js, React               |
| **Database**       | PostgreSQL                   |
| **ORM**            | Prisma                       |
| **Kontainerisasi** | Docker, Docker Compose       |
| **Reverse Proxy**  | Nginx                        |
| **Message Broker** | RabbitMQ                     |
| **Pengujian**      | Jest, Supertest              |
| **Validasi**       | Zod                          |

## 🤝 Kontribusi

Kontribusi dalam bentuk apapun sangat kami hargai! Jika Anda menemukan bug, memiliki ide untuk fitur baru, atau ingin meningkatkan dokumentasi, jangan ragu untuk membuat _issue_ atau _pull request_.

## 📜 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).
