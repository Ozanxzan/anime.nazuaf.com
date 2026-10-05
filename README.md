# Nazuaf Anime — Cloudflare Pages Starter

Starter website anime berbasis AniList API.

## Deploy ke Cloudflare Pages
1. Upload folder ini ke GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Framework preset: None.
4. Build command: kosong.
5. Build output directory: `/` (atau root repository).
6. Deploy.

## Catatan
Website ini mengambil metadata dari AniList dan hanya menampilkan tautan streaming yang diberikan oleh AniList (`streamingEpisodes`).
Tidak ada video berhak cipta yang disimpan di project ini.

Untuk video milik sendiri/berlisensi, halaman player dapat ditambahkan kemudian dengan HLS.js + Cloudflare Stream/R2.
