# HMDSI Web — Final Implementation Notes

## Perubahan utama

- Menyamakan kontrak data admin Members dengan endpoint backend dan menambahkan assignment jabatan/departemen per periode.
- Program studi anggota dikunci di backend dan UI menjadi `D3 Sistem Informasi`.
- Menambahkan validasi bisnis struktur organisasi untuk jabatan inti dan jabatan kepala/wakil departemen.
- Periode 2026 ditetapkan sebagai periode aktif dengan tema `Kabinet Narakarsa`; pembuatan kabinet dibatasi satu periode per tahun.
- Menambahkan migrasi kompatibilitas department slug per periode dan normalisasi role lama.
- Menambahkan Arsip Dokumen Himpunan dengan upload file atau URL.
- Menambahkan drag-and-drop multi-foto untuk Gallery.
- Admin News, Gallery, dan Resources sekarang dapat melihat data non-published/draft.
- Halaman Structure publik mengambil data pengurus langsung dari Member + Management Structure dan menyediakan pemilih periode.
- Memperbaiki route model binding pada edit/delete periode.
- Menambahkan konfigurasi Axios agar upload `FormData` tidak memaksa `Content-Type: application/json`.

## Setelah checkout/deploy

Backend:

```bash
cd hmdsi-api
composer install
php artisan migrate --force
php artisan storage:link
```

Frontend:

```bash
cd hmdsi_vercel
npm install
npm run lint
npm run build
```

File `.env` tidak termasuk dalam paket ini.

## Catatan validasi

TypeScript (`npm run lint`) telah lolos pada source final menggunakan dependency tree dari paket awal. Build Vite di environment pemeriksaan ini tidak dapat diselesaikan karena optional native Rollup binary tidak tersedia pada `node_modules` hasil arsip; jalankan `npm install`/`npm ci` pada machine/deployment target sebelum `npm run build`.

Backend route listing dan PHP syntax check telah lolos. Pengujian database runtime belum dapat dijalankan pada environment pemeriksaan karena driver PDO MySQL/SQLite tidak tersedia.
