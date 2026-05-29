# Deploy ke Vercel

## 1. Push ke GitHub

```bash
git add .
git commit -m "Next.js app ready for Vercel"
git push origin main
```

## 2. Import di Vercel

1. [vercel.com/new](https://vercel.com/new) → Import repository
2. Framework: **Next.js** (otomatis)
3. Root Directory: `.`
4. Build Command: `npm run build` (default)
5. Install Command: `npm install` (default)

## 3. Environment Variables

Di **Vercel → Project → Settings → Environment Variables**, tambahkan untuk **Production** (dan Preview jika perlu):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fhguqrwogroyzbfmhrbx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dari Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | dari Supabase → Settings → API (**secret**) |
| `NEXT_PUBLIC_SITE_URL` | URL production, mis. `https://nama-project.vercel.app` |

**Penting:** Set `NEXT_PUBLIC_SITE_URL` ke domain final setelah deploy pertama (copy dari Vercel dashboard). Tanpa ini, link generate tetap jalan via `VERCEL_URL`, tapi custom domain perlu env ini.

## 4. Supabase Auth (wajib agar login jalan)

Supabase → **Authentication** → **URL Configuration**:

| Field | Contoh |
|-------|--------|
| **Site URL** | `https://nama-project.vercel.app` |
| **Redirect URLs** | `https://nama-project.vercel.app/**` |

Tambahkan juga URL preview jika dipakai:

```
https://*-nama-team.vercel.app/**
```

Klik **Save**.

## 5. Deploy

Klik **Deploy**. Setelah sukses:

1. Buka `https://nama-project.vercel.app/login`
2. Login dengan user admin Supabase
3. Generate link → copy URL `https://nama-project.vercel.app/r/xxxxx`

## 6. Custom domain (opsional)

Vercel → **Domains** → tambah domain → update `NEXT_PUBLIC_SITE_URL` ke domain baru → **Redeploy**.

## Checklist

- [ ] SQL migration `001_initial.sql` & `002_storage.sql` sudah di-run
- [ ] Bucket `og-images` public
- [ ] User admin ada di Supabase Auth
- [ ] 4 env vars di Vercel
- [ ] Site URL + Redirect URLs di Supabase Auth
- [ ] `NEXT_PUBLIC_SITE_URL` = URL production

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Login gagal / redirect loop | Cek Redirect URLs di Supabase Auth |
| Gagal upload gambar | Cek bucket `og-images` + policy storage SQL |
| Link redirect 404 | Cek `SUPABASE_SERVICE_ROLE_KEY` di Vercel |
| OG Facebook tidak muncul | Pastikan gambar URL HTTPS (Supabase Storage) |
