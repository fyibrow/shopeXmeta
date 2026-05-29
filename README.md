# ShopeXmeta

Admin panel untuk generator link affiliate Shopee dengan preview Open Graph untuk Facebook, analytics klik, dan redirect pintar (FB crawler vs FB in-app).

**Stack:** Next.js 16 · Supabase (Auth, DB, Storage) · Vercel

## Fitur

- Login admin (Supabase Auth)
- Generator link + upload gambar OG
- Redirect `/r/[slug]` dengan deteksi User-Agent Facebook
- Analytics: total klik, FB crawler, FB in-app, chart harian, top links
- Soft-delete link dari dashboard

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. **SQL Editor** → jalankan `supabase/migrations/001_initial.sql`
3. **Storage** → buat bucket `og-images` (public), lalu jalankan `supabase/migrations/002_storage.sql`
4. **Authentication** → buat user admin:
   - Email + password (disable public sign-up di Auth settings)
5. **Project Settings → API** → salin URL, `anon` key, dan `service_role` key

## Setup lokal

```bash
cp .env.example .env.local
# isi env dari Supabase

npm install
npm run dev
```

Buka http://localhost:3000 → login → dashboard.

## Deploy Vercel

Panduan lengkap: **[DEPLOY.md](./DEPLOY.md)**

Ringkas:

1. Push repo ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Set 4 environment variables (lihat `.env.example`)
4. Supabase Auth → Site URL & Redirect URLs = URL Vercel Anda
5. Deploy → set `NEXT_PUBLIC_SITE_URL` → redeploy

Tanpa `NEXT_PUBLIC_SITE_URL`, Vercel otomatis memakai `VERCEL_URL` untuk link generate.

## Environment variables

| Variable | Keterangan |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server only, jangan expose ke client) |
| `NEXT_PUBLIC_SITE_URL` | URL publik app (untuk link redirect & OG) |

## Struktur

```
src/app/
  dashboard/     # Admin UI
  login/         # Auth
  r/[slug]/      # Public redirect + OG
  api/links/     # CRUD links
  api/analytics/ # Stats
```

## Catatan

Preview OG membutuhkan URL gambar **HTTPS publik** (Supabase Storage). Facebook Debugger mungkin perlu re-scrape setelah deploy.
