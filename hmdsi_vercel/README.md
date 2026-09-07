# HMDSI Frontend — React + Vite Public Website

> **HMDSI** = Himpunan Mahasiswa Diploma Sistem Informasi · FIT Telkom University  
> **Tech Stack:** React 18+ · TypeScript · Vite · TanStack Query · Tailwind CSS · Lucide React · React Router v6

Frontend ini adalah **website landing page publik** untuk HMDSI. Dibangun dengan arsitektur **Feature-Based Component Structure + Service Layer Pattern** menggunakan TanStack Query (React Query) untuk state management dan data fetching. Backend API terpisah (Laravel).

---

## 🎯 Fungsi & Alur Program

```
Website User (Tanpa Login)
│
├─ Homepage (/) ────────────────────── Hero Banner, Quick Stats, Values, CTA
│     │
│     ├─ useSiteStats() → GET /api/stats
│     └─ Static content (values, CTA)
│
├─ About (/about) ──────────────────── Visi, Misi, Sejarah HMDSI
│     │
│     └─ Static layout (hardcoded content)
│
├─ Structure (/structure) ──────────── Org Chart (Leader → Core → Department)
│     │
│     └─ Static data (src/data/structure.ts)
│
└─ Future Pages
      ├─ /news ──────────────────────── Berita & Artikel
      │     └─ useNews() → GET /api/news
      ├─ /gallery ──────────────────── Galeri Dokumentasi
      │     └─ useGallery() → GET /api/gallery
      ├─ /proker ────────────────────── Program Kerja
      │     └─ useWorkPrograms() → GET /api/work-programs
      └─ /aspiration ────────────────── Kotak Aspirasi
            └─ useAspirations() → POST /api/aspirations

Admin Panel (/admin/*)
│
├─ Login (/admin/login) ────────────── Sanctum authentication
│     └─ authService.login() → POST /api/auth/login
│
└─ Dashboard (Protected) ────────────── CMS untuk kelola konten
      ├─ /admin ──────────────── Dashboard overview & statistics
      ├─ /admin/members ──────── CRUD anggota
      ├─ /admin/programs ─────── CRUD proker
      ├─ /admin/news ─────────── CRUD artikel/berita
      ├─ /admin/gallery ──────── CRUD album galeri
      ├─ /admin/resources ────── CRUD dokumen
      ├─ /admin/aspirations ──── Kelola & balas aspirasi
      └─ /admin/settings ─────── Konfigurasi (about, stats, period)
```

### Alur Fetch Data (TanStack Query Pattern)

```
Component mounts
     │
     ▼
Custom Hook (useWorkPrograms)
     │
     ▼
TanStack Query.useQuery({ queryKey, queryFn })
     │
     ├── Cache HIT? ──→ Return cached data (instant render)
     │
     └── Cache MISS ──→ Fetch via workProgramService
                             │
                             ▼
                       Axios GET /api/work-programs
                             │
                             ▼
                       Laravel Controller → Service → Repository
                             │
                             ▼
                       MySQL Database
                             │
                             ▼
                       JSON Response: { success, data: { items, pagination } }
                             │
                             ▼
                       Cache data → Render Component
```

---

## 📁 Struktur Direktori

```
hmdsi_vercel/
├── public/
│   └── images/
│       └── hmdsi.svg         # Logo HMDSI
├── src/
│   ├── assets/               # Static assets (fonts, images)
│   ├── components/           # Global reusable components
│   │   ├── Footer.tsx        # Footer with links & social media
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── ProtectedRoute.tsx # HOC to protect admin routes
│   │   ├── ScrollToTop.tsx   # Scroll to top on route change
│   │   ├── SectionHeader.tsx # Reusable section header component
│   │   └── admin/
│   │       └── AdminLayout.tsx # Admin panel layout (sidebar + topbar)
│   ├── config/               # Axios & endpoint configuration
│   │   ├── axios.ts          # Axios client instance
│   │   ├── endpoints.ts      # API endpoint constants
│   │   └── query-keys.ts     # TanStack Query key factory
│   ├── data/                 # Static data (hardcoded)
│   │   └── structure.ts     # Static organization structure data
│   ├── features/             # Feature-based modules (reserved for future)
│   ├── hooks/                # Custom React hooks (TanStack Query wrappers)
│   │   ├── useAboutContent.ts
│   │   ├── useAspirations.ts
│   │   ├── useDepartments.ts
│   │   ├── useGallery.ts
│   │   ├── useManagementStructures.ts
│   │   ├── useNews.ts
│   │   ├── useResources.ts
│   │   ├── useSiteStats.ts
│   │   └── useWorkPrograms.ts
│   ├── pages/                # Page-level components (routes)
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── AboutPage.tsx    # About page
│   │   ├── StructurePage.tsx # Organizational structure page
│   │   └── admin/           # Admin CMS pages
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminMembersPage.tsx
│   │       ├── AdminProgramsPage.tsx
│   │       ├── AdminNewsPage.tsx
│   │       ├── AdminGalleryPage.tsx
│   │       ├── AdminResourcesPage.tsx
│   │       ├── AdminAspirationsPage.tsx
│   │       └── AdminSettingsPage.tsx
│   ├── contexts/             # React Context
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── features/             # Feature-based modules (reserved for future)
│   ├── services/             # API service layer
│   │   ├── api.types.ts      # TypeScript interfaces
│   │   ├── index.ts          # Re-export all services
│   │   ├── about.service.ts
│   │   ├── aspiration.service.ts
│   │   ├── auth.service.ts
│   │   ├── department.service.ts
│   │   ├── gallery.service.ts
│   │   ├── news.service.ts
│   │   ├── resource.service.ts
│   │   ├── site-stat.service.ts
│   │   ├── structure.service.ts
│   │   └── work-program.service.ts
│   ├── utils/                # Helper functions
│   │   └── date.ts           # Date formatting utilities
│   ├── App.tsx               # Root component with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔗 Alur Integrasi Frontend ↔ Backend

```
┌─────────────────────────────────────────────┐
│           FRONTEND (React + Vite)            │
│                                             │
│  Page Component                              │
│     │                                        │
│     ├── Custom Hook (useWorkPrograms)       │
│     │     │                                  │
│     │     └── TanStack Query (useQuery)     │
│     │           │                           │
│     │           └── Service Layer            │
│     │                 │                      │
│     │                 └── apiClient (Axios) │
│     │                       │                │
└─────┼───────────────────────┼────────────────┘
      │                       │
      ▼                       ▼
┌─────────────────────────────────────────────┐
│           BACKEND (Laravel API)              │
│                                             │
│  GET /api/work-programs                     │
│     │                                        │
│     └── WorkProgramController               │
│           │                                  │
│           ├── WorkProgramService            │
│           │     │                            │
│           │     └── WorkProgramRepository   │
│           │           │                      │
│           │           └── Eloquent Model    │
│           │                 │                │
│           └── WorkProgramResource (transform)│
│                 │                            │
│                 └── JSON Response           │
└─────────────────────────────────────────────┘
```

---

## 🚀 Instalasi & Konfigurasi

### Prasyarat

- Node.js 18+
- npm / pnpm / yarn
- Backend API sudah berjalan (Laravel)

### Langkah 1: Install Dependencies

```bash
cd hmdsi_vercel
npm install
```

### Langkah 2: Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:8000/api
```

Untuk production (Vercel), set environment variable di dashboard Vercel:
- `VITE_API_URL` = URL API production

### Langkah 3: Jalankan Development Server

```bash
npm run dev
```

Website akan berjalan di `http://localhost:5173`.

### Langkah 4: Build untuk Production

```bash
npm run build
npm run preview   # Preview production build locally
```

---

## 📦 Package Dependencies

| Package | Fungsi |
|---------|--------|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state management & caching |
| `axios` | HTTP client untuk API calls |
| `tailwindcss` | Utility-first CSS framework |
| `lucide-react` | Icon library |
| `motion` | Animation library |
| `react-helmet-async` | SEO meta tags management |

---

## 📝 Service Layer Pattern

Setiap fitur memiliki 3 layer:

```
┌─────────────────────────────────────────────────────┐
│  1. Service Layer (src/services/*.service.ts)       │
│     - Axios calls: GET, POST, PUT, DELETE           │
│     - Type-safe params & return                     │
│     - No business logic                             │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  2. Custom Hook (src/hooks/*.ts)                    │
│     - Wraps TanStack Query useQuery / useMutation  │
│     - Query key factory integration                 │
│     - Provides loading / error / data states        │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  3. Page Component (src/pages/*.tsx)               │
│     - Calls the custom hook                         │
│     - Renders UI based on data                      │
│     - No direct API calls                           │
└─────────────────────────────────────────────────────┘
```

### Contoh: Work Program

```typescript
// src/services/work-program.service.ts
export const workProgramService = {
  async getWorkPrograms(params?: WorkProgramFilters) {
    const response = await apiClient.get<ApiResponse<PaginatedData<WorkProgram>>>(
      endpoints.workPrograms,
      { params }
    );
    return response.data.data;
  },
};

// src/hooks/useWorkPrograms.ts
export function useWorkPrograms(filters?: WorkProgramFilters) {
  return useQuery({
    queryKey: queryKeys.workPrograms(filters),
    queryFn: () => workProgramService.getWorkPrograms(filters),
  });
}
```

---

## 📱 Routing

| Path | Component | Deskripsi |
|------|-----------|-----------|
| `/` | `HomePage` | Landing page |
| `/about` | `AboutPage` | About us |
| `/structure` | `StructurePage` | Org chart |
| `/proker` | (future) | Work programs list |
| `/proker/:slug` | (future) | Work program detail |
| `/news` | (future) | News list |
| `/gallery` | (future) | Gallery |
| `/aspiration` | (future) | Aspiration form |
| `/admin/*` | (future) | Protected admin routes |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push ke GitHub repository
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variable:
   - `VITE_API_URL` → URL backend production
4. Deploy!

### Environment Variables untuk Production

```env
VITE_API_URL=https://hmdsi-api.yourdomain.com/api
```

---

## 🔧 Development Commands

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Start dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔒 Security Notes

- Token auth disimpan di `localStorage`
- 401 response → auto logout (token removed)
- Frontend tidak menyimpan password
- Admin routes harus dilindungi dengan `ProtectedRoute` component
- `.env` dengan `VITE_` prefix aman di-commit

---

*© HMDSI — Built with React + Vite, powered by passionate developers.*
