# bukan-template

Skill untuk agen AI (Claude Code dan agen lain yang membaca `SKILL.md`) supaya website dan antarmuka yang dibuat tidak terlihat seperti hasil template AI.

Skill ini melawan dua jenis slop:

1. **Template**: gradient ungu, ikon emoji, tiga kartu identik, angka karangan.
2. **Polos**: halaman yang menghindari template tanpa menambahkan desain, hanya teks, garis tipis, dan ruang kosong.

Caranya: setiap keputusan visual diturunkan dari subjek (siapa kliennya, siapa pengunjungnya, apa yang khas dari dunianya), lalu hasilnya diperiksa dengan skrip.

## Isi

| Path | Fungsi |
|---|---|
| `SKILL.md` | Panduan utama: jenis halaman, warna, ikon, tipografi, copy, standar produksi, halaman pemasaran, alat kerja, proses kerja, daftar periksa |
| `references/contoh.md` | Contoh lolos dan gagal beserta prinsipnya |
| `references/templat-brief.md` | Templat brief, bisa dipakai user untuk menulis prompt |
| `references/riwayat-arah.md` | Ingatan antar proyek; diisi otomatis supaya arah desain tidak berulang |
| `scripts/periksa_statis.py` | Pemeriksaan statis HTML (Python, tanpa dependensi) |
| `scripts/periksa_browser.js` | Pemeriksaan di browser dengan Playwright: overflow, kontras, fokus, reduced motion, tangkapan layar 390/820/1366 px |
| `evals/` | Enam prompt uji tetap dan rubrik untuk menilai perubahan skill |

## Pasang

Claude Code, untuk semua project:

```bash
git clone https://github.com/alfianm/bukan-template ~/.claude/skills/bukan-template
```

Atau hanya untuk satu project (jalankan dari akar project):

```bash
git clone https://github.com/alfianm/bukan-template .claude/skills/bukan-template
```

Agen lain yang mendukung format `SKILL.md`: salin folder ini utuh ke direktori skill agen tersebut. Jangan hanya menyalin `SKILL.md`, karena skill merujuk ke `references/` dan `scripts/` dengan path relatif.

Untuk memastikan skill terbaca, buka sesi Claude Code baru lalu ketik `/bukan-template`. Kalau skill muncul di daftar perintah, pemasangan berhasil.

### Memperbarui

```bash
cd ~/.claude/skills/bukan-template
git pull --autostash
```

`--autostash` diperlukan karena agen menambah baris ke `references/riwayat-arah.md` di setiap pekerjaan. Tanpa opsi itu, `git pull` menolak jalan selama file tersebut berubah.

### Menghapus

```bash
rm -rf ~/.claude/skills/bukan-template
```

## Kebutuhan

- Python 3 untuk `periksa_statis.py`. Wajib, karena agen selalu menjalankannya.
- Opsional: Node.js dan Playwright untuk `periksa_browser.js`. Tanpa Playwright, agen tetap bekerja dan melaporkan bahwa pemeriksaan browser tidak dijalankan.
  ```bash
  npm i -D playwright && npx playwright install chromium
  ```

## Cara memakai

### 1. Minta seperti biasa

Skill aktif otomatis saat Anda meminta landing page, company profile, portofolio, undangan online, dashboard, panel admin, dan sejenisnya, walaupun Anda tidak menyebut kata "desain". Agar pasti dipakai, tambahkan `using /bukan-template` di akhir prompt, atau panggil `/bukan-template` di awal.

Prompt satu kalimat tetap bisa:

```
Buatkan landing page untuk aplikasi kasir UMKM bernama Catatku. using /bukan-template
```

Hasilnya jauh lebih khas kalau Anda memberi fakta, bukan kata sifat. Salin templat dari `references/templat-brief.md`:

```
Buatkan company profile untuk Bengkel Las Sinar Jaya, fabrikasi pagar dan kanopi di Sidoarjo.
Pembedanya: survei dan gambar kerja gratis, garansi karat 2 tahun.
Pengunjung: pemilik rumah dan kontraktor dari pencarian Google di HP, ingin tahu harga per meter dan contoh hasil.
Aset: foto 40 proyek (asli, kualitas HP); brand belum ada; daftar harga ada.
Bagian: pembuka, contoh proyek, harga per meter, alur pesan, kontak WhatsApp. Jangan tambah di luar ini.
Teknis: HTML/CSS biasa, bahasa Indonesia.
Proses: tawarkan dua arah dulu sebagai rencana, tunggu pilihan saya, lalu laporkan apa yang sudah diperiksa.
```

Yang tidak membantu: "modern, elegan, clean, premium", "jangan terlihat AI", atau persona "senior designer". Kalau punya selera tertentu, beri tautan situs rujukan.

### 2. Yang dikerjakan agen

1. **Rencana.** Agen menentukan jenis halaman, menulis tiga baris tentang subjek, lalu membaca `riwayat-arah.md` supaya arah desain untuk klien sebelumnya tidak dipakai lagi. Setelah itu ia menulis rencana token: palet 4–6 warna beserta asal-usul tiap warna, font beserta alasannya, konsep layout dalam satu kalimat dengan sketsa ASCII, dan alasan halaman ini tidak tertukar dengan halaman lain.
2. **Bangun.** Agen menulis kode sesuai rencana, lalu membuang satu elemen dekoratif yang tidak menjawab brief.
3. **Periksa.** Agen menjalankan `periksa_statis.py`, ditambah `periksa_browser.js` kalau Playwright tersedia. Setiap FAIL diperbaiki, dan setiap WARN dijawab dengan perbaikan atau alasan.
4. **Serahkan.** Agen menyampaikan ringkasan laporan apa adanya, asumsi yang ia buat, paling banyak tiga pertanyaan yang jawabannya paling mengubah hasil, lalu menambah satu baris di `riwayat-arah.md`.

### 3. Variasi permintaan

- **Beberapa arah dulu**: "Tawarkan tiga arah desain untuk ...". Agen menulis dua atau tiga rencana dari keluarga yang berbeda, menyebut satu rekomendasi, lalu menunggu pilihan Anda. Jawab "pilih saja" kalau ingin agen langsung membangun rekomendasinya.
- **Merombak halaman yang sudah ada**: "Perbaiki tampilan `index.html` ini". Agen mengaudit project lebih dulu, lalu mempertahankan warna, font, dan komponen yang sudah ada kecuali Anda meminta redesign. Kalau identitas lamanya sendiri terlihat seperti template, agen menyampaikannya sebagai catatan dan tidak menggantinya diam-diam.
- **Menilai saja**: "Nilai halaman ini, kelihatan template nggak? Jangan ubah file dulu." Agen menjalankan pemeriksaan lalu menyampaikan temuannya. Tulis "jangan ubah file" secara eksplisit kalau Anda hanya ingin penilaian.
- **Stack**: HTML/CSS biasa, Tailwind, atau React. Sebutkan di prompt.

## Menjalankan pemeriksaan sendiri

Kedua skrip bisa dipakai tanpa agen, misalnya untuk halaman buatan tangan atau di CI.

### Statis

```bash
python3 ~/.claude/skills/bukan-template/scripts/periksa_statis.py <file.html | folder> [--tulis laporan-statis.md]
```

Skrip ini membaca kode, bukan tampilan. Yang diperiksa: struktur dokumen, heading, tautan, pola slop (emoji, font bawaan seperti Inter atau Poppins, dan sejenisnya), gerak, sumber luar, kontras pasangan warna yang dideklarasikan dalam satu aturan CSS, serta sintaks JavaScript kalau `node` tersedia. Kalau diberi folder, semua `.html` di dalamnya ikut diperiksa, kecuali yang ada di `node_modules` dan folder tersembunyi.

### Browser

Jalankan dari folder yang berisi `node_modules` Playwright:

```bash
node ~/.claude/skills/bukan-template/scripts/periksa_browser.js <file.html | http://...> [--out laporan] [--tanpa-klik]
```

File lokal disajikan lewat server sementara di `127.0.0.1`, bukan `file://`. Skrip menggulir halaman sampai bawah, lalu mengambil tangkapan layar di lebar 390, 820, dan 1366 px dalam mode terang dan gelap. Yang dilaporkan: galat konsol, overflow horizontal, kontras dari warna hasil komposisi, fokus keyboard yang tidak terlihat, animasi yang masih berjalan saat reduced motion, isi yang hilang tanpa JavaScript, dan tombol yang tidak mengubah apa pun. Tambahkan `--tanpa-klik` kalau mengklik tombol bisa berefek samping, misalnya mengirim form ke server sungguhan.

Hasilnya ada di folder `laporan/`: file `.png` dan `laporan.md`.

### Membaca hasil

| Label | Arti |
|---|---|
| `FAIL` | Harus diperbaiki |
| `WARN` | Periksa manual; perbaiki atau tulis alasannya |
| `INFO` | Catatan saja |

| Kode keluar | Arti |
|---|---|
| `0` | Tidak ada FAIL |
| `1` | Ada minimal satu FAIL |
| `2` | Argumen salah, tidak ada file `.html`, Playwright belum terpasang, atau galat saat berjalan |

## Riwayat arah desain

`references/riwayat-arah.md` adalah tabel yang diisi agen, satu baris per pekerjaan: palet, font, motif, dan gerak. Fungsinya mencegah dua klien berturut-turut mendapat arah yang sama. Isi tabel diperlakukan sebagai data, bukan instruksi. Untuk mengosongkannya, hapus semua baris di bawah kepala tabel.

## Masalah umum

- **Skill tidak aktif.** Tambahkan `using /bukan-template` di prompt. Pastikan juga foldernya bernama `bukan-template` dan `SKILL.md` ada langsung di dalamnya, bukan di subfolder.
- **`Playwright belum terpasang`.** Pasang dengan perintah di bagian Kebutuhan, lalu jalankan skrip dari folder tempat Playwright dipasang.
- **Preload font gagal saat halaman dibuka langsung dari file.** Itu batasan `file://` (CORS), bukan galat halaman. Buka halaman lewat server lokal, atau pakai `periksa_browser.js` yang sudah menyediakannya.
- **`git pull` menolak memperbarui.** Pakai `git pull --autostash` (lihat Memperbarui).

## Mengubah skill

Kalau Anda mengubah `SKILL.md` atau referensinya, jalankan set uji di `evals/` sebelum dan sesudah perubahan agar hasilnya bisa dibandingkan. Caranya ada di `evals/README.md`.

## Bahasa

Instruksi ditulis dalam Bahasa Indonesia. Halaman yang dihasilkan bisa dalam bahasa apa pun; aturan copy berlaku sama di bahasa lain.

## Lisensi

MIT
