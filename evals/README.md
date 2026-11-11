# Set uji tetap

Enam prompt yang tidak pernah diubah. Jalankan semuanya setiap kali skill diubah, lalu
bandingkan dengan putaran sebelumnya. Tanpa ini, perubahan skill hanya bisa dinilai
dengan perasaan.

## Cara menjalankan satu putaran

1. Beri nama putaran, misalnya `v2-2026-10-22`.
2. Untuk tiap eval di `evals.json`: buka sesi Claude Code baru di folder kosong, tempel
   prompt-nya apa adanya, jawab pertanyaan model dengan "pilih saja" (kecuali eval 6,
   yang memang berhenti di pertanyaan), lalu salin hasilnya ke
   `evals/hasil/<putaran>/<nama-eval>/`.
3. Sekali saja, jalankan putaran pembanding tanpa skill (matikan skill atau hapus
   "using /bukan-template") ke `evals/hasil/tanpa-skill/`.
4. Ringkasan otomatis: `python3 evals/ringkas.py evals/hasil/<putaran>`.
5. Tangkapan layar: dari folder yang berisi node_modules Playwright, `node <folder skill>/scripts/periksa_browser.js <file.html> --out <folder eval>/layar`.
6. Isi `rubrik.md` (salin per putaran) dari tangkapan layar.

`expectations` di `evals.json` bisa dinilai manual atau dengan alur skill-creator.
Yang menentukan tetap rubrik: angka FAIL/WARN hanya menangkap yang terukur.

## Aturan

- Jangan mengubah prompt di `evals.json`; tambahkan eval baru dengan id baru.
- Satu perubahan skill per putaran kalau bisa, supaya tahu perubahan mana yang berpengaruh.
- Hasil putaran tidak ikut dibagikan; tambahkan `evals/hasil/` ke `.gitignore`.
