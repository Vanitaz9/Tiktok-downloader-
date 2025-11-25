# TikTok Downloader (Demo)

## Persiapan
1. `git clone` atau buat folder.
2. Salin file-file yang diberikan (server.js, package.json, public/*).
3. Jalankan `npm install`.

## Konfigurasi
Buat file `.env` berdasarkan `.env.example`.
- Untuk mengaktifkan fungsi unduh nyata, isi `THIRD_PARTY_API_URL` dan `THIRD_PARTY_API_KEY` dari provider yang legal.

## Jalankan lokal
- `npm run dev` (butuh nodemon) atau `npm start`
- Buka http://localhost:3000

## Deploy
- Deploy ke Render/Heroku/Vercel sebagai Node.js app (pastikan `PORT` di env sesuai).
- Jika menggunakan Vercel, atur "Build & Output settings" sehingga `public/` sebagai static dir dan server.js sebagai API (Vercel serverless/edge function). Render dan Heroku mudah dipakai untuk aplikasi Express tradisional.

## Catatan hukum & etika
- Pastikan untuk tidak men-download atau mendistribusikan konten tanpa izin pemilik karya.
- Patuhi Terms of Service TikTok dan hak cipta setempat.
- Gunakan provider resmi atau yang memberi izin untuk melakukan download.
