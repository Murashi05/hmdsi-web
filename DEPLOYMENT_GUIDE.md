# HMDSI Web — Deployment Guide

Panduan lengkap untuk mendeploy HMDSI website ke production.

---

## 🏗️ Arsitektur Deployment

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vercel)                        │
│                  vercel.com/hmdsi-web                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  vite build → static files (HTML/CSS/JS)              │   │
│  │  • Deployed to Vercel Edge Network                     │   │
│  │  • CDN untuk asset statis                              │   │
│  │  • Environment: VITE_API_URL → hmdsi-api URL           │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    BACKEND (Render / Railway)                 │
│                  hmdsi-api.onrender.com                      │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Laravel PHP API                                        │  │
│  │  • PHP 8.2 + Composer                                   │  │
│  │  • Database: MySQL (Railway / Aiven / PlanetScale)    │  │
│  │  • Cache: Redis (optional)                             │  │
│  │  • Storage: Cloudinary (untuk upload media)             │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 📋 Prasyarat Deployment

1. **GitHub Repository** — Kedua project harus di-push ke GitHub
   - `hmdsi-api/` → Repository untuk backend
   - `hmdsi-vercel/` → Repository untuk frontend

2. **Cloud Database** — Siapkan database MySQL
   - **Railway** (Recommended) — Gratis tier tersedia
   - **Aiven MySQL** — Gratis 1 bulan, perlu SSL
   - **PlanetScale** — MySQL-compatible, gratis tier permanen
   - **Neon** — PostgreSQL, gratis tier

3. **Account Platform**
   - Vercel (for frontend)
   - Render / Railway (for backend)

---

## 🚀 Deployment Steps

### Langkah 1: Persiapan Database

#### Opsi A: Railway MySQL (Recommended)

1. Buka [railway.app](https://railway.app) → Login dengan GitHub
2. Klik **New Project** → **Provision MySQL**
3. Buka tab **MySQL** → Copy connection details:
   - Host
   - Port (biasanya `3306`)
   - Username
   - Password
   - Database name

#### Opsi B: PlanetScale

1. Buka [app.planetscale.com](https://app.planetscale.com)
2. Buat database baru
3. Buat branch `main`
4. Buka **Connect** → Get connection string

#### Opsi C: Aiven MySQL

1. Buka [aiven.io](https://aiven.io) → Sign up
2. Buat service MySQL (tier Free)
3. Buka **Connection Information**
4. Copy: Host, Port, User, Password, Database
5. **PENTING:** Download `ca.pem` untuk SSL connection

---

### Langkah 2: Deploy Backend (Render)

1. Buka [dashboard.render.com](https://dashboard.render.com)
2. Klik **New +** → **Blueprint**
3. Connect GitHub repo `hmdsi-api`
4. Pilih file `render.yaml`
5. Klik **Apply**

#### Konfigurasi Environment Variables di Render:

Buka service `hmdsi-api` → **Environment**:

```env
# App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hmdsi-api.yourdomain.com

# Database (isi dari Railway/Aiven)
DB_CONNECTION=mysql
DB_HOST=your-mysql-host
DB_PORT=3306
DB_DATABASE=hmdsi_db
DB_USERNAME=your-username
DB_PASSWORD=your-password

# CORS (URL frontend Vercel)
FRONTEND_URL=https://hmdsi-web.vercel.app
SANCTUM_STATEFUL_DOMAINS=hmdsi-web.vercel.app

# Cache (optional)
CACHE_STORE=database
```

6. Klik **Save Changes** → Render akan auto-deploy

---

### Langkah 3: Deploy Frontend (Vercel)

1. Buka [vercel.com](https://vercel.com)
2. Klik **Add New** → **Project**
3. Import GitHub repo `hmdsi-vercel`
4. Klik **Deploy**

#### Konfigurasi Environment Variables di Vercel:

Buka project → **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://hmdsi-api.onrender.com/api
```

5. Klik **Save**
6. Klik **Deployments** → **Redeploy** (untuk apply env var)

---

### Langkah 4: Verifikasi Deployment

#### Test Backend API:

```bash
curl https://hmdsi-api.onrender.com/api/stats
```

Response yang diharapkan:
```json
{
  "success": true,
  "message": "OK",
  "data": [...]
}
```

#### Test Frontend:

1. Buka `https://hmdsi-web.vercel.app`
2. Buka DevTools → Network tab
3. Refresh halaman
4. Pastikan tidak ada CORS error
5. Cek apakah data dari API muncul

---

## 🌐 Custom Domain (Opsional)

### Vercel (Frontend)

1. Project Settings → **Domains**
2. Add domain: `hmdsi.com` atau `www.hmdsi.com`
3. Tambahkan DNS records:
   ```
   Type: A / CNAME
   Name: @ / www
   Value: cname.vercel-dns.com
   ```

### Render (Backend)

1. Service Settings → **Custom Domains**
2. Add domain: `api.hmdsi.com`
3. Tambahkan DNS records:
   ```
   Type: A
   Name: api
   Value: <Render IPv4>
   ```
   Atau
   ```
   Type: CNAME
   Name: api
   Value: hmdsi-api.onrender.com
   ```

### Update Frontend Environment:

```env
VITE_API_URL=https://api.hmdsi.com/api
```

---

## 🔧 Troubleshooting

### CORS Error

```
Access to fetch at 'https://api.hmdsi.com' from origin 'https://hmdsi.com'
has been blocked by CORS policy
```

**Solusi:**
1. Cek `FRONTEND_URL` di backend `.env` sudah benar
2. Cek `SANCTUM_STATEFUL_DOMAINS` di backend
3. Rebuild backend di Render

### Database Connection Error

```
SQLSTATE[HY000] [2002] Connection refused
```

**Solusi:**
1. Cek credentials database di Render
2. Pastikan IP whitelist (jika pakai Aiven)
3. Pastikan SSL mode sesuai

### 401 Unauthorized pada Admin API

```
{"success":false,"message":"Unauthenticated."}
```

**Solusi:**
1. Cek token auth sudah disave dengan benar
2. Cek Sanctum configuration
3. Pastikan cookie domain match

---

## 🔄 Update & Maintenance

### Update Frontend

1. Push kode baru ke GitHub
2. Vercel auto-deploy dari branch `main`
3. Atau manual: `vercel --prod`

### Update Backend

1. Push kode baru ke GitHub
2. Render auto-deploy
3. Jika perlu migrasi: Edit service → **Manual Deploy** → **Deploy latest commit**

### Reset Database

```bash
php artisan migrate:fresh --seed
```

Jalankan di Render Shell atau via webhook.

---

## 📊 Monitoring

### Backend Logs

Buka Render → Service `hmdsi-api` → **Logs**

### Frontend Analytics

Vercel Analytics (included free) atau integrate Google Analytics.

### Uptime Monitoring

Gunakan:
- UptimeRobot (free tier: 50 monitors)
- Better Uptime

---

## 💰 Estimasi Biaya

| Service | Plan | Biaya |
|---------|------|-------|
| Vercel Frontend | Hobby | Gratis |
| Render Backend | Starter | Gratis |
| Railway MySQL | Starter | Gratis |
| PlanetScale | Starter | Gratis |
| Cloudinary | Free | Gratis (25 credits/bulan) |
| Domain (hmdsi.com) | Annual | ~$10-15/tahun |

**Total: ~$10-15/tahun** (hanya domain)

---

## 📁 File Deployment

```
hmdsi-web/
├── DEPLOYMENT_GUIDE.md        ← Dokumen ini
├── hmdsi-api/                 # Backend Laravel
│   ├── render.yaml           ← Render Blueprint
│   ├── .env.example          ← Template env
│   └── README.md
└── hmdsi_vercel/              # Frontend React
    ├── vercel.json            ← Vercel config
    ├── .env.example          ← Template env
    └── README.md
```

---

*© HMDSI — Last Updated: 2026-09-07*
