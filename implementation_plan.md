# HMDSI Web System — Architecture & Implementation Plan

## Overview

Sistem Informasi HMDSI adalah platform multi-periode yang terdiri dari:
- **Public Website** — Landing page, profil organisasi, proker, galeri, berita, aspirasi
- **Admin Dashboard** — CMS internal untuk manajemen konten tanpa menyentuh kode

Stack yang digunakan: React + Vite (Frontend) · Laravel REST API (Backend) · MySQL Cloud (Database) · Cloudinary (Media Storage)

---

## Roadmap Eksekusi

| Langkah | Status | Deskripsi |
|---------|--------|-----------|
| **Step 1** | ✅ Selesai | ERD & Database Schema Lengkap (20 tabel) |
| **Step 2** | ✅ Selesai | Laravel Migrations + Models + Seeders |
| **Step 3** | ✅ Selesai | Frontend Service Layer (Axios + React Query) |
| **Step 4** | ✅ Selesai | Laravel Controllers, Services, Resources (API) |
| **Step 5** | ✅ Selesai | Admin Dashboard (Protected Routes + Login) |
| **Step 6** | ✅ Selesai | Deployment Configuration |

---

## Step 1 — Database Schema (ERD)

Lihat detail lengkap di: **`hmdsi_database_schema.md`**

### Ringkasan Tabel (20 tabel)

| # | Table Name | Rows (Est.) | Key Relations |
|---|------------|-------------|---------------|
| 1 | `periods` | ~10 | Root of all org data |
| 2 | `departments` | ~12/period | → periods |
| 3 | `members` | ~60/period | → departments, periods |
| 4 | `management_roles` | ~10 | Lookup/enum table |
| 5 | `management_structures` | ~60/period | → members, departments, roles, periods |
| 6 | `work_programs` | ~40/period | → departments, periods |
| 7 | `work_program_tags` | variable | → work_programs |
| 8 | `aspirations` | variable | — |
| 9 | `aspiration_responses` | variable | → aspirations, users |
| 10 | `news_articles` | variable | → users |
| 11 | `article_tags` | variable | → news_articles |
| 12 | `news_categories` | ~5 | Lookup, Many-to-Many ke news_articles |
| 13 | `news_category_article` | variable | Pivot table |
| 14 | `gallery_events` | variable | → periods |
| 15 | `gallery_items` | variable | → gallery_events |
| 16 | `resources` | variable | → users |
| 17 | `about_contents` | 1 active | — |
| 18 | `site_stats` | ~5 | — |
| 19 | `users` | ~5 | Admin accounts |
| 20 | `activity_logs` | variable | Audit trail → users |

---

## Status File yang Sudah Ada

### Backend (`hmdsi-api/`)
- ✅ 19 Migrations (16 core + sessions + personal_access_tokens + 1 enhancement)
- ✅ 17 Models
- ✅ 12 Repositories
- ✅ 12 Services
- ✅ 12 API Controllers
- ✅ 12 Form Requests
- ✅ 17 API Resources
- ✅ Routes (`api.php`)

### Frontend (`hmdsi_vercel/`)
- ✅ Axios client + endpoints config + query keys
- ✅ 11 Service modules
- ✅ 9 Custom hooks (TanStack Query)
- ✅ 3 Public Pages (Home, About, Structure)
- ✅ AuthContext (React Context for auth state)
- ✅ ProtectedRoute component
- ✅ Admin Layout (sidebar + topbar)
- ✅ Admin Login Page
- ✅ Admin Dashboard (stats overview)
- ✅ 7 Admin Management Pages (Members, Proker, News, Gallery, Resources, Aspirations, Settings)

### Yang Masih Belum
- 🔲 Testimonial/feedback (opsional)
- 🔲 Cloudinary integration di backend (file upload helper)

### Deployment Files
- ✅ `DEPLOYMENT_GUIDE.md` — Panduan deployment lengkap
- ✅ `hmdsi-api/render.yaml` — Render Blueprint untuk backend
- ✅ `hmdsi_vercel/vercel.json` — Vercel config untuk frontend

---

*Updated: 2026-09-07*
