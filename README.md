# Nazuaf Anime V5.3

Perbaikan dari V5.2:
- Genre pada halaman detail sekarang tampil sebagai pill/chip yang lebih terang dan menarik, bukan link biru bawaan browser.
- Setiap genre diarahkan ke `genre.html?name=...` agar halaman genre terpisah dan tidak tercampur dengan halaman trending.
- Halaman genre memakai filter AniList berdasarkan genre yang dipilih.
- Ada validasi tambahan di browser: kartu hanya ditampilkan jika data anime benar-benar memiliki genre yang dipilih.
- Pencarian tetap tersedia dari halaman genre.
- Fitur terjemahan sinopsis Google Translate gratis dan perbaikan V5.1 tetap dipertahankan.

## Deploy
Upload semua file V5.3 ke repository GitHub dan commit. Cloudflare Pages akan melakukan deploy otomatis.

File tambahan:
- `genre.html`
- `genre.js`
