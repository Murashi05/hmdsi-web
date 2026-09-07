# HMDSI API — Laravel REST API Backend

> **HMDSI** = Himpunan Mahasiswa Diploma Sistem Informasi · FIT Telkom University  
> **Tech Stack:** Laravel 11+ · PHP 8.2+ · MySQL 8.x · Laravel Sanctum · Cloudinary

Backend ini menyediakan **RESTful API** untuk seluruh fitur website HMDSI (public + admin panel). Arsitekturnya mengikuti pola **Controller-Service-Repository (Clean Architecture)** agar skalabel dan mudah di-maintain lintas developer.

---

## 🎯 Fungsi & Alur Program

```
PUBLIC ENDPOINTS (tanpa auth):
  ├─ GET  /api/about                → Konten About Us
  ├─ GET  /api/stats                → Statistik homepage (quick stats)
  ├─ GET  /api/periods              → Daftar periode kepengurusan
  ├─ GET  /api/periods/active       → Periode aktif saat ini
  ├─ GET  /api/departments          → Daftar departemen
  ├─ GET  /api/departments/{slug}   → Detail departemen
  ├─ GET  /api/departments/{slug}/structure → Struktur org chart
  ├─ GET  /api/work-programs        → Daftar proker (filterable)
  ├─ GET  /api/work-programs/highlights  → Proker unggulan
  ├─ GET  /api/work-programs/{slug} → Detail proker
  ├─ GET  /api/news                 → Daftar berita
  ├─ GET  /api/news/{slug}          → Detail berita
  ├─ GET  /api/gallery              → Daftar album galeri
  ├─ GET  /api/gallery/{slug}       → Detail album + items
  ├─ GET  /api/resources            → Daftar dokumen
  ├─ GET  /api/aspirations/stats    → Statistik status aspirasi
  ├─ GET  /api/aspirations/track/{code} → Cek status via tracking code
  └─ POST /api/aspirations          → Kirim aspirasi (anon/user)

ADMIN ENDPOINTS (auth: Sanctum Bearer):
  ├─ POST /api/admin/periods
  ├─ POST /api/admin/departments
  ├─ PUT  /api/admin/departments/{id}
  ├─ DELETE /api/admin/departments/{id}
  ├─ POST /api/admin/members
  ├─ PUT  /api/admin/members/{id}
  ├─ POST /api/admin/management-structures
  ├─ POST /api/admin/work-programs
  ├─ PUT  /api/admin/work-programs/{id}
  ├─ DELETE /api/admin/work-programs/{id}
  ├─ POST /api/admin/news
  ├─ PUT  /api/admin/news/{id}
  ├─ DELETE /api/admin/news/{id}
  ├─ POST /api/admin/gallery
  ├─ POST /api/admin/gallery/{id}/items
  ├─ DELETE /api/admin/gallery/items/{item_id}
  ├─ POST /api/admin/resources
  ├─ PUT  /api/admin/resources/{id}
  ├─ DELETE /api/admin/resources/{id}
  ├─ PUT  /api/admin/about/{id}
  ├─ PUT  /api/admin/stats
  ├─ GET  /api/admin/aspirations
  └─ POST /api/admin/aspirations/{id}/respond
```

### Alur Request (Use Case: Submit Aspirasi)

```
1. Pengguna POST /api/aspirations  { category, subject, message, is_anonymous }
       │
       ▼
2. StoreAspirationRequest → validasi input (required fields, enum check)
       │
       ▼
3. AspirationController::store → panggil AspirationService::create()
       │
       ▼
4. AspirationService::create() → generate tracking_code (ASP-YYYY-XXXXX)
       │
       ▼
5. AspirationRepository::create() → INSERT ke tabel aspirations
       │
       ▼
6. Response: { success: true, data: { tracking_code, status: 'submitted' } }
```

### Alur Request (Use Case: Admin Update Proker)

```
1. Admin PATCH /api/admin/work-programs/{id} { status: 'completed', ... }
       │
       ▼
2. StoreWorkProgramRequest → validasi input
       │
       ▼
3. WorkProgramController::update() → panggil WorkProgramService::update()
       │
       ▼
4. WorkProgramService::update() → update record + sync tags
       │
       ▼
5. WorkProgramRepository::update() → UPDATE database
       │
       ▼
6. ActivityLog dibuat → record aksi admin (audit trail)
       │
       ▼
7. Response: { success: true, data: { ...updated proker... } }
```

---

## 📁 Struktur Direktori

```
hmdsi-api/
├── app/
│   ├── Console/              # Artisan Commands (mis: update stats)
│   ├── Exceptions/           # Handler & exception rendering
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php              # Base controller (ApiResponse trait)
│   │   │   └── Api/                        # REST controllers
│   │   │       ├── AboutController.php
│   │   │       ├── AspirationController.php
│   │   │       ├── AuthController.php
│   │   │       ├── DepartmentController.php
│   │   │       ├── GalleryController.php
│   │   │       ├── ManagementStructureController.php
│   │   │       ├── NewsArticleController.php
│   │   │       ├── PeriodController.php
│   │   │       ├── ResourceArchiveController.php
│   │   │       ├── SiteStatController.php
│   │   │       └── WorkProgramController.php
│   │   ├── Requests/                     # Form validation (input sanitization)
│   │   │   ├── About/UpdateAboutContentRequest.php
│   │   │   ├── Archive/StoreArchiveResourceRequest.php
│   │   │   ├── Aspiration/RespondAspirationRequest.php
│   │   │   ├── Aspiration/StoreAspirationRequest.php
│   │   │   ├── Auth/LoginRequest.php
│   │   │   ├── Department/StoreDepartmentRequest.php
│   │   │   ├── Gallery/StoreGalleryEventRequest.php
│   │   │   ├── Gallery/StoreGalleryItemRequest.php
│   │   │   ├── Management/StoreMemberRequest.php
│   │   │   ├── News/StoreNewsArticleRequest.php
│   │   │   ├── WorkProgram/StoreWorkProgramRequest.php
│   │   │   └── Management/StoreManagementStructureRequest.php
│   │   └── Resources/                    # API Resource / Serializers
│   │       ├── AboutContentResource.php
│   │       ├── ArchiveResourceResource.php
│   │       ├── AspirationResource.php
│   │       ├── AspirationResponseResource.php
│   │       ├── DepartmentResource.php
│   │       ├── GalleryEventResource.php
│   │       ├── GalleryItemResource.php
│   │       ├── ManagementRoleResource.php
│   │       ├── ManagementStructureResource.php
│   │       ├── MemberResource.php
│   │       ├── NewsArticleResource.php
│   │       ├── NewsCategoryResource.php
│   │       ├── PeriodResource.php
│   │       ├── SiteStatResource.php
│   │       ├── UserResource.php
│   │       └── WorkProgramResource.php
│   ├── Models/                 # Eloquent Models
│   │   ├── AboutContent.php
│   │   ├── ActivityLog.php
│   │   ├── ArticleTag.php
│   │   ├── Aspiration.php
│   │   ├── AspirationResponse.php
│   │   ├── Department.php
│   │   ├── GalleryEvent.php
│   │   ├── GalleryItem.php
│   │   ├── ManagementRole.php
│   │   ├── ManagementStructure.php
│   │   ├── Member.php
│   │   ├── NewsArticle.php
│   │   ├── NewsCategory.php
│   │   ├── Period.php
│   │   ├── Resource.php
│   │   ├── SiteStat.php
│   │   └── User.php
│   ├── Repositories/           # Data Access Layer
│   │   ├── BaseRepository.php
│   │   ├── AboutContentRepository.php
│   │   ├── AspirationRepository.php
│   │   ├── DepartmentRepository.php
│   │   ├── GalleryEventRepository.php
│   │   ├── ManagementStructureRepository.php
│   │   ├── MemberRepository.php
│   │   ├── NewsArticleRepository.php
│   │   ├── PeriodRepository.php
│   │   ├── ResourceArchiveRepository.php
│   │   ├── SiteStatRepository.php
│   │   └── WorkProgramRepository.php
│   ├── Services/               # Business Logic Layer
│   │   ├── AboutContentService.php
│   │   ├── AspirationService.php
│   │   ├── AuthService.php
│   │   ├── DepartmentService.php
│   │   ├── GalleryService.php
│   │   ├── ManagementStructureService.php
│   │   ├── NewsArticleService.php
│   │   ├── PeriodService.php
│   │   ├── ResourceArchiveService.php
│   │   ├── SiteStatService.php
│   │   └── WorkProgramService.php
│   ├── Support/
│   │   └── ApiResponse.php      # Standardized JSON response trait
│   └── Providers/
├── config/
│   ├── app.php, auth.php, cache.php, cors.php
│   ├── database.php, sanctum.php, services.php
├── database/
│   ├── migrations/              # 22 migration files (20 table + sessions + news_categories + activity_logs)
│   ├── seeders/                 # 6 seeders
│   └── factories/               # Model factories
├── routes/
│   ├── api.php                  # Semua API routes
│   ├── web.php
│   └── console.php
├── public/                      # Web root (index.php)
└── storage/                     # Logs, cache, uploaded files
```

---

## 🗄️ Database Schema

Database terdiri dari **20 tabel** utama. Lihat dokumen lengkap: [`hmdsi_database_schema.md`](../hmdsi_database_schema.md)

---

## 🚀 Instalasi & Konfigurasi

### Prasyarat

- PHP 8.2+
- Composer 2.x+
- MySQL 8.0+ (lokal via Laragon atau cloud: Aiven/Railway/PlanetScale)

### Langkah 1: Install Dependencies

```bash
cd hmdsi-api
composer install
```

### Langkah 2: Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
APP_NAME="HMDSI API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hmdsi_db
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Cloudinary (opsional, untuk file upload)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Langkah 3: Generate Key & Jalankan Migrasi

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### Langkah 4: Jalankan Server

```bash
php artisan serve
```

Server berjalan di `http://localhost:8000`.

---

## 🔐 API Authentication (Sanctum)

### Super Admin Default Credentials

> **PENTING:** Jalankan `php artisan db:seed` untuk membuat akun super admin.

| Field | Value |
|-------|-------|
| Email | `superadmin@hmdsi.or.id` |
| Password | `HMDSI@2026Super` |
| Role | `super_admin` |

⚠️ **Ganti password default segera setelah deployment pertama!**

### Login (dapatkan token)

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@hmdsi.or.id","password":"HMDSI@2026Super"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "Super Administrator", "email": "superadmin@hmdsi.or.id", "role": "super_admin" },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

### Gunakan Token

```bash
curl http://localhost:8000/api/admin/work-programs \
  -H "Authorization: Bearer 1|abc123..."
```

---

## 📋 Endpoint Reference

### Public (tanpa auth)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/periods` | Daftar semua periode |
| GET | `/api/periods/active` | Periode aktif saat ini |
| GET | `/api/departments` | Daftar departemen |
| GET | `/api/departments/{slug}` | Detail departemen |
| GET | `/api/departments/{slug}/structure` | Struktur org chart |
| GET | `/api/work-programs` | Daftar proker (filterable) |
| GET | `/api/work-programs/highlights` | Proker unggulan |
| GET | `/api/work-programs/{slug}` | Detail proker |
| GET | `/api/news` | Daftar berita |
| GET | `/api/news/{slug}` | Detail berita |
| GET | `/api/gallery` | Daftar album galeri |
| GET | `/api/gallery/{slug}` | Detail album |
| GET | `/api/resources` | Daftar dokumen |
| GET | `/api/aspirations/stats` | Statistik status aspirasi |
| GET | `/api/aspirations/track/{code}` | Cek status aspirasi |
| POST | `/api/aspirations` | Kirim aspirasi |
| GET | `/api/about` | Konten about us |
| GET | `/api/stats` | Statistik homepage |

### Admin (auth: Sanctum)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/admin/periods` | Buat periode |
| POST | `/api/admin/departments` | Buat departemen |
| PUT | `/api/admin/departments/{id}` | Update departemen |
| DELETE | `/api/admin/departments/{id}` | Hapus departemen |
| POST | `/api/admin/members` | Tambah anggota |
| PUT | `/api/admin/members/{id}` | Update anggota |
| POST | `/api/admin/management-structures` | Atur struktur org |
| POST | `/api/admin/work-programs` | Buat proker |
| PUT | `/api/admin/work-programs/{id}` | Update proker |
| DELETE | `/api/admin/work-programs/{id}` | Hapus proker |
| POST | `/api/admin/news` | Buat artikel |
| PUT | `/api/admin/news/{id}` | Update artikel |
| DELETE | `/api/admin/news/{id}` | Hapus artikel |
| POST | `/api/admin/gallery` | Buat album |
| POST | `/api/admin/gallery/{id}/items` | Tambah media |
| DELETE | `/api/admin/gallery/items/{id}` | Hapus media |
| POST | `/api/admin/resources` | Upload dokumen |
| PUT | `/api/admin/resources/{id}` | Update dokumen |
| DELETE | `/api/admin/resources/{id}` | Hapus dokumen |
| PUT | `/api/admin/about/{id}` | Update about content |
| PUT | `/api/admin/stats` | Update statistik |
| GET | `/api/admin/aspirations` | Daftar aspirasi |
| POST | `/api/admin/aspirations/{id}/respond` | Balas aspirasi |

---

## ⚙️ Development Commands

| Perintah | Deskripsi |
|----------|-----------|
| `php artisan migrate` | Jalankan migrasi |
| `php artisan migrate:fresh --seed` | Reset + migrasi + seed |
| `php artisan db:seed` | Jalankan seeders |
| `php artisan serve` | Start dev server |
| `php artisan route:list --path=api` | Daftar API routes |
| `php artisan tinker` | Interactive PHP shell |

---

## ☁️ Deployment

### Backend: Render / Railway / DigitalOcean

1. Deploy ke **Render** (PostgreSQL fallback tersedia, atau gunakan MySQL)
2. Set environment variables di dashboard:
   - `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
   - `FRONTEND_URL` → URL frontend production
3. Jalankan `php artisan migrate --force`

### Database Cloud

- **Railway MySQL** — paling mudah, gratis tier tersedia
- **Aiven MySQL** — gratis 1 bulan, SSL required
- **PlanetScale** — MySQL-compatible, gratis tier permanen

---

## 📊 Response Format

Semua response mengikuti format standar (via `ApiResponse` trait):

```json
{
  "success": true,
  "message": "OK",
  "data": { ... },
  "errors": null
}
```

Pagination response:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [ ... ],
    "pagination": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 12,
      "total": 35
    }
  }
}
```

---

## 🔒 Security

- Input sanitization via FormRequest validation
- CORS configured for frontend only
- Sanctum token-based auth
- Soft deletes pada semua tabel utama
- Password di-hash dengan Bcrypt
- `.env` tidak di-commit (lihat `.gitignore`)

---

*© HMDSI — Built with Laravel, powered by passionate developers.*