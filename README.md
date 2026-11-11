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

Atau hanya untuk satu project:

```bash
git clone https://github.com/alfianm/bukan-template .claude/skills/bukan-template
```

Skill aktif otomatis saat Anda meminta landing page, company profile, portofolio, dashboard, panel admin, dan sejenisnya. Bisa juga dipanggil langsung dengan `/bukan-template`.

## Kebutuhan

- Python 3 untuk `periksa_statis.py`.
- Opsional: Node.js dan Playwright untuk `periksa_browser.js`:
  ```bash
  npm i -D playwright && npx playwright install chromium
  ```

## Bahasa

Instruksi ditulis dalam Bahasa Indonesia. Halaman yang dihasilkan bisa dalam bahasa apa pun; aturan copy berlaku sama di bahasa lain.

## Lisensi

MIT
