---
name: bukan-template
description: Panduan membuat desain website dan antarmuka yang khas dan tidak terlihat seperti hasil template AI. Gunakan setiap kali user meminta landing page, company profile, portofolio, undangan online, situs produk, dashboard, CRM, CMS, panel admin, starter kit UI, halaman web, atau "buatkan website untuk..." walaupun user tidak menyebut kata desain; juga saat merombak, memperbaiki, atau menilai tampilan halaman yang sudah ada, dan saat user minta beberapa pilihan arah desain. Berlaku untuk HTML/CSS biasa, Tailwind, maupun React. Membawa skrip pemeriksaan statis dan browser di folder scripts/.
---

# Bukan Template

Bekerjalah seperti desainer di studio kecil yang kliennya pernah menolak hasil karena "kelihatan seperti template". Klien membayar untuk sudut pandang, bukan kerangka yang bisa dipakai siapa saja. Ukurannya: setiap pilihan visual bisa dijawab dengan "kenapa ini cocok untuk klien ini", bukan "karena biasanya begini".

Ada dua jenis slop. Yang pertama adalah template: gradient ungu, ikon emoji, tiga kartu identik, angka karangan. Yang kedua muncul setelah template dihindari tanpa menambahkan desain: halaman polos berisi teks, garis tipis, dan ruang kosong, seperti memo yang diberi warna. Keduanya sama memalukannya bagi klien. Skill ini melawan keduanya.

## 1. Tentukan jenis halaman dulu

Ukuran "bagus" dua keluarga ini berlawanan, jadi sebutkan jenisnya di awal rencana:

- **Halaman pemasaran**: landing page, company profile, portofolio, undangan, situs produk. Dibaca sekali oleh orang yang belum kenal; yang dinilai kesan, cerita, dan media. Ikuti bagian 2–8, lalu bagian 9.
- **Alat kerja**: dashboard, CRM, CMS, panel admin, aplikasi internal. Dibuka setiap hari oleh orang yang sama; yang dinilai kejelasan, kepadatan yang berguna, dan kecepatan mengambil keputusan. Ikuti bagian 2–8, lalu bagian 10.

Kalau permintaan mencampur keduanya (landing page produk yang menampilkan cuplikan dashboard), halamannya tetap halaman pemasaran; isi cuplikannya saja yang mengikuti bagian 10.

## 2. Mulai dari subjek

Sebelum memilih warna, font, atau layout, tulis tiga baris:

- Siapa pemiliknya dan apa yang membedakannya dari pesaing.
- Siapa yang membuka, dari mana, dan apa yang ingin mereka putuskan dalam 10 detik pertama. Untuk alat kerja: siapa penggunanya dan keputusan apa yang mereka ambil setiap hari dengan alat ini.
- Satu hal paling khas dari dunia subjek: material, alat, tempat, kebiasaan, bahasa sehari-hari.

Brief sering hanya satu kalimat, dan itu cukup untuk mulai. Persempit sendiri ke satu jenis usaha di satu tempat, nyatakan asumsinya dalam satu paragraf, lalu lanjut. Jangan meniru contoh mana pun dari dokumen ini atau dari `references/`: contoh yang ditiru akan muncul di setiap halaman. Paling banyak satu pertanyaan sebelum rencana, dan hanya kalau jawabannya mengubah arah (misalnya foto tersedia atau tidak). Isian lain ditagih di penyerahan (lihat Proses kerja).

Dua subjek yang berbeda harus berakhir dengan halaman yang berbeda, dan perbedaannya datang dari tiga baris ini, bukan dari mengganti warna aksen pada kerangka yang sama.

## 3. Warna

Setiap warna harus punya asal-usul. Ambil 4–6 warna dari benda nyata di dunia subjek (material, alat, kemasan, seragam, dokumen, tempat kerjanya) dan tulis asal-usul tiap warna dalam satu frasa; warna yang tidak bisa dijelaskan belum punya alasan. Tulis palet sebagai token dengan nama peran (`--dasar`, `--teks`, `--aksen`), lengkap dengan nilai mode gelap. Netral tidak harus abu-abu, dan suhunya konsisten dengan aksen. Teks isi minimal 4,5:1 terhadap latarnya, teks besar minimal 3:1.

Yang harus diputus:

- **Gradient ungu/indigo** (`#6366f1 → #a855f7`, teks gradient, glow ungu, logo atau avatar gradient). Ini penanda paling jelas halaman buatan AI. Gradient apa pun hanya layak kalau brief memintanya atau subjeknya memang tentang cahaya atau transisi.
- **Stereotip industri**: navy dan oranye untuk konstruksi, hijau untuk kesehatan, biru korporat, hitam dan ungu untuk developer. Kalau palet bisa ditebak dari nama industrinya, belum ada keputusan. Kalau warna dari material kebetulan sama dengan stereotipnya, pakai dalam porsi kecil dan biarkan warna dominan keluar dari stereotip.
- **Palet bawaan framework**: skala abu-abu dan aksen bawaan Tailwind. Kelas boleh dipakai, warnanya didefinisikan sendiri.
- **Tanda tangan skill ini sendiri**, yang ketahuan dari pengujian dan harus dicurigai sama kerasnya: latar hampir hitam dengan satu aksen kuning (`#E3B2xx`); grotesk condensed huruf kapital untuk semua judul; gambar garis SVG objek subjek sebagai momen visual; kertas gading dengan tinta gelap, aksen merah bata, dan monospace untuk label; serif besar dengan aksen kuningan untuk brief yang terdengar "mapan"; serif editorial di atas krem; tosca, sage, mint, atau hijau tua sebagai warna dominan padahal subjeknya tidak berwarna hijau. Dua dari daftar ini dalam satu rencana adalah kebiasaan, bukan pilihan.

Aturan jumlah aksen berbeda per jenis: halaman pemasaran memakai satu aksen (bagian 9), alat kerja memakai warna sebagai data (bagian 10).

## 4. Ikon

Emoji bukan ikon UI: dirender berbeda di tiap sistem, tidak mengikuti palet, dan langsung terbaca sebagai hasil generate. Urutan pengganti: tanpa ikon kalau ikon tidak menambah makna (ikon pantas untuk navigasi, status, dan aksi, jarang untuk hiasan); satu set SVG inline yang konsisten (Lucide, Heroicons, Phosphor, Tabler) dengan ketebalan dan ukuran sama, warna `currentColor`; atau gambar sendiri dalam satu gaya. Ikon tidak otomatis ditaruh di kotak atau lingkaran pastel.

## 5. Tipografi

Jangan default ke Inter, Poppins, Roboto, atau Montserrat; pilih karena karakternya menjawab brief dan tulis alasannya dalam satu kalimat. Satu atau dua keluarga dengan peran yang jelas berbeda. Skala yang disengaja (misalnya 1,25 atau 1,333), panjang baris teks isi di bawah 80 karakter. Jangan memberi warna atau gradient pada satu kata di headline, dan jangan menaruh label kapital kecil di atas setiap judul kalau tidak ada fungsi kategorinya.

## 6. Copy dan konten

Tulis dari sudut pandang pengunjung, dalam bahasa yang wajar diucapkan, bukan bahasa brosur. Hindari kalimat yang bisa ditempel ke bisnis mana saja ("solusi all-in-one", "membangun masa depan bersama", "tim profesional dan berpengalaman").

- **Contoh isi boleh, angka klaim tidak.** Kalau brief tidak memberi konten, buat isi yang spesifik dan masuk akal (nama proyek, lokasi, layanan konkret) dan tandai sebagai contoh. Angka klaim (jumlah klien, tahun pengalaman, rating, persentase) tidak dibuat sama sekali kalau tidak ada di brief.
- **Copy tidak menjelaskan desainnya sendiri.** Alasan warna atau bentuk hidup di rencana dan komentar kode, bukan di teks yang dibaca pengunjung.
- **Bahasa konsisten.** Situs berbahasa Indonesia tidak memakai "All rights reserved", "Made with ❤️", "Get started". Tombol memakai kata kerja yang jelas, tanpa panah di ujungnya. Situs berbahasa lain mengikuti prinsip yang sama dalam bahasanya.
- **Foto dan placeholder.** Foto nyata hampir selalu lebih kuat dari dekorasi apa pun, jadi tanyakan ketersediaannya. Kalau belum ada, placeholder harus jujur: rasio yang ditentukan, isi pola atau warna dari palet, dan label yang menyebut foto apa yang dibutuhkan. Bukan kotak abu-abu bertuliskan "Foto" dan bukan gradient yang berpura-pura jadi gambar. Jangan memuat gambar dari URL luar yang tidak dikendalikan user.

## 7. Kalau project atau brand sudah ada

Aturannya berbalik: pertahankan warna, font, dan komponen yang sudah ada kecuali user meminta redesign. Audit dulu (struktur project, token yang ada, pola di halaman lain, siapa penggunanya), tulis ringkasannya dalam beberapa baris, dan buat hasil baru terasa dari tim yang sama. Kalau identitas yang ada sendiri terlihat seperti template, sampaikan sebagai catatan, jangan diam-diam diganti.

## 8. Standar produksi

- **Semua state**: memuat, kosong (dengan kalimat yang membantu dan tindakan berikutnya), galat (dengan coba lagi), berhasil; setiap kontrol punya tampilan nonaktif.
- **Tidak ada kontrol palsu**: tombol, filter, tab, dan form yang terlihat berfungsi harus berfungsi. Yang belum bisa ditandai jelas atau tidak ditampilkan, dan disebut di penyerahan.
- **HTML semantik**: `nav`, `table`, `ul`/`ol`, `button`, `a` dengan `href`; urutan heading masuk akal; gambar punya teks alternatif.
- **Aksesibilitas dan responsif**: fokus keyboard terlihat, dialog tertutup dengan Escape dan mengembalikan fokus, responsif sampai 390 px, konten lebar bergulir di wadahnya sendiri, `prefers-reduced-motion` dihormati.
- **Token dipakai di mana-mana**: warna, spacing, ukuran teks, radius, dan bayangan didefinisikan sekali.
- **Jujur tentang pengujian**: jangan mengklaim pemeriksaan yang tidak dijalankan.

## 9. Halaman pemasaran

**Pola bukan masalahnya; eksekusi dan isinya.** Penomoran, baris statistik, testimoni, "scroll to explore", dan label kapital juga dipakai situs yang jelas bagus. Bedanya tiga: kontennya nyata (foto, nama, angka sungguhan), eksekusinya bertenaga penuh (skala berani, gerak halus, foto memenuhi layar), dan halamannya bercerita. Menghindari pola tanpa tiga hal itu menghasilkan halaman polos; memakai pola dengan tiga hal itu menghasilkan situs yang memenangkan penghargaan.

**Setiap halaman harus punya:** satu momen visual yang menancap di pembuka (foto besar dengan komposisi yang dipikirkan, tipografi berskala ekstrem, blok warna berani, atau bentuk dari dunia subjek), kontras skala yang jelas, ritme (lega bergantian dengan padat, terang dengan gelap), dan satu hal yang diingat setelah halaman ditutup. Satu aksen warna, dipakai sedikit. Tesnya: apakah pemilik usaha akan bangga memperlihatkannya, dan apakah ini terlihat dibuat studio desain, bukan diekspor dari dokumen? Kalau ragu, yang kurang biasanya keberanian, bukan aturan.

**Struktur.** Kerangka "hero dengan judul, subjudul, dua tombol, baris angka; tiga kartu; testimoni; CTA berwarna penuh" adalah template. Susun sebagai cerita: masalah yang dirasakan pengunjung, jawabannya, bukti, tawaran, dan tiap bagian menyambung ke bagian berikutnya. Tiga hal tidak harus tiga kartu identik. Penomoran dipakai hanya kalau dieksekusi tegas sebagai sistem komposisi, bukan angka kecil di atas kartu. Statistik dan testimoni hanya dengan data nyata, dan kalau ada, ditampilkan besar dan lengkap (nama, sumber yang bisa dicek). Penutup sering lebih berguna berupa kontak yang jelas daripada blok "Siap memulai?". Per jenis: landing page punya satu pesan dan satu aksi utama; company profile membuktikan bisa dipercaya lewat proyek, orang, dan alamat nyata; portofolio menjadikan karyanya hero, bukan dekorasi.

**Rujukan selera** yang dipilih penulis skill ini: fitosauna.com, aikah.robertoattanasio.com, bhavanakulkarni.com, mediaquestweb.com. Kesamaannya: dibuka dengan sesuatu yang memenuhi layar; tipografi sebagai elemen utama; foto dan video asli di mana-mana; gerak yang halus dan terasa mahal; bukti yang bisa dicek (ulasan bertanggal, tabel perbandingan, garansi); suara yang personal; satu elemen tangan manusia yang diulang. Arah yang diinginkan sinematik, bercerita, dan penuh media. Tanpa foto atau video sungguhan, hasilnya tidak akan sampai ke standar ini, dan itu dikatakan ke user di awal.

**Gerak.** Halaman tanpa gerak terasa seperti cetakan. Pakai tiga jenis, masing-masing dengan alasan:

- Satu gerak tanda tangan saat halaman dibuka, diturunkan dari cara subjek bekerja atau bergerak, selesai dalam satu sampai dua detik.
- Transisi mikro 150–250 ms pada semua elemen interaktif.
- Pemunculan ringan untuk konten berurutan: geser 8–12 px, 300–450 ms, jeda 40–80 ms antar butir, sekali saat masuk layar; bukan untuk seluruh section.

Kosakata tambahan yang boleh, dua atau tiga per halaman, masing-masing dengan alasan: pembuka singkat atau penghitung selama aset dimuat, judul yang terungkap per baris, marquee, galeri yang digeser horizontal saat di-scroll, section yang terkunci sementara isinya berganti, video latar tanpa suara. GSAP boleh dari cdnjs dengan versi terkunci kalau gerak adalah inti konsep; satu dua efek cukup dengan CSS dan sedikit JS. Gulir halus di layar lebar dengan pointer presisi: tangkap `wheel` (non-pasif; abaikan `ctrlKey` dan gerak horizontal), tambah `deltaY` ke sasaran, gerakkan dengan `kini += (sasaran - kini) * 0.09` di `requestAnimationFrame`; sentuhan, keyboard, dan scrollbar tetap asli; tautan anchor mengarah ke sasaran dan memindahkan fokus; dilewati saat reduced motion atau `pointer: coarse`. Easing masuk `cubic-bezier(.16,1,.3,1)` dengan durasi 0,9–1,2 detik. Yang tetap terbaca sebagai hasil generate: fade-up 40 px di setiap section, parallax di semua foto, bola gradient mengambang, kursor custom tanpa fungsi, teks yang mengetik sendiri, kartu yang naik saat hover di mana-mana. Pembuka dan section terkunci harus bisa dilewati, dan konten tidak bergantung pada gerak untuk terbaca. Isi yang muncul saat digulir disembunyikan hanya setelah skrip menambah kelas (misalnya `.js .muncul`) dan langsung tampil saat reduced motion; tanpa JavaScript, semua isi tetap terlihat.

## 10. Alat kerja

**Padat dan bermakna, bukan tenang dan hemat.** Masalah dashboard template bukan banyaknya widget atau warna, melainkan widget dan warna yang tidak berarti apa-apa: kartu gradient pastel, kartu angka yang masing-masing beda warna, lorem ipsum, neumorphism.

**Warna adalah data.** Boleh banyak warna, asal setiap warna punya satu arti yang sama di semua widget dan layar: hal berurutan (tahap, prioritas) memakai satu hue dari muda ke tua; kategori memakai palet terpisah, maksimal enam; status memakai warna langka, merah hanya untuk yang harus ditindak hari ini dan amber untuk peringatan dengan ambang tertulis. Latar netral, warna merek hanya di logo, menu aktif, tombol utama, dan seri data utama. Warna tidak pernah satu-satunya pembawa arti.

**Setiap angka menjawab "lalu apa".** Tampilkan bersama pembandingnya (target, laju hari ini, periode sebelumnya); buang angka pamer yang tidak membantu keputusan. Format sesuai bahasa: Rp 2,58 M, Rp 372 jt, 1.284, 38%.

**Susunan titik awal**, grid 12 kolom: baris KPI (3–5 kartu); grafik lebar dengan panel samping; tabel kerja lebar dengan panel samping; aktivitas dan rincian. Ubah urutannya mengikuti keputusan terpenting; baris pertama menjawab "hari ini baik atau buruk" dalam lima detik.

- **KPI**: angka besar, satu kalimat pembanding, satu visual kecil yang sesuai jenis angkanya (progress dengan garis laju, bar bertumpuk, sparkline, dua bar perbandingan). Tanpa kartu berwarna penuh, ikon di kotak berwarna, atau "Lihat semua" di setiap kartu.
- **Grafik**: judulnya pertanyaan yang dijawab, ada garis pembanding bila ada target, sumbu bersatuan, tooltip yang tidak keluar layar, bisa difokus keyboard, `aria-label` berisi ringkasan. Donut maksimal lima irisan dengan legenda bernilai.
- **Tabel**: ruang terbesar; saringan chip dengan hitungan, cari, urut dengan `aria-sort`, pilih banyak dengan aksi massal dan "Urungkan", paginasi, angka rata kanan. Diuji dengan nol dan ribuan baris.
- **Kepadatan**: jarak 12–16 px, padding kartu 16–18 px, teks 13–14 px, angka tabular. Setiap widget menjawab "keputusan apa yang dibantunya", kalau tidak, buang.
- **Terhubung**: saringan dari satu tempat mengubah semua widget, dan saringan aktif selalu terlihat.

**Lebih dari satu layar**: pola daftar, detail, buat/edit; satu inventaris komponen yang dipakai di semua layar; navigasi dengan halaman aktif dan pencarian global berpintasan keyboard; konfirmasi untuk tindakan yang merusak; peringatan perubahan belum tersimpan; menu ke layar yang belum ada ditandai, bukan tautan palsu.

**Gerak**: hanya transisi mikro, skeleton saat memuat, dan pemunculan ringan saat data pertama datang. Tanpa gulir halus, marquee, galeri terkunci, atau pembuka.

## Proses kerja

Tunjukkan rencana sebelum menulis kode; koreksi di rencana jauh lebih murah daripada di kode. Kalau sesi tidak bisa menunggu jawaban (misalnya dijalankan tanpa layar), tulis rencananya ke `RENCANA.md`, nyatakan asumsinya, lalu bangun rekomendasinya. Kecualinya kalau user sendiri meminta pilihan arah: berhenti di rencana dan pertanyaannya.

**Tahap 0, audit**, hanya kalau project atau brand sudah ada (bagian 7).

**Tahap 1, rencana.**

1. Sebutkan jenis halaman dan tulis tiga baris subjek. Baca `references/riwayat-arah.md` kalau ada; arah yang sudah dipakai untuk klien lain tidak diulang. Kalau ragu bedanya lolos dan gagal, baca `references/contoh.md`.
2. Tulis rencana token: palet 4–6 hex dengan peran dan asal-usul, font dengan peran dan alasan, konsep layout dalam satu kalimat dan sketsa ASCII, dan satu kalimat tentang apa yang membuat halaman ini tidak tertukar dengan halaman lain.
3. Uji rencananya dengan tiga pertanyaan, lalu ubah yang gagal dan sebutkan perubahannya:
   - Kalau brief diganti ke industri lain, apakah rencana ini masih hampir sama? Kalau ya, bagian itu generik.
   - Apakah rencana memakai dua atau lebih dari daftar tanda tangan di bagian 3, atau trio gerak pernyataan besar, marquee, dan galeri terkunci? Kalau ya, turunkan arah lain dari tiga baris subjek, bukan dari daftar alternatif mana pun.
   - Halaman pemasaran: apa momen visual dan apa yang diingat orang? "Rapi" dan "bersih" bukan jawaban. Alat kerja: apakah baris pertama menjawab keputusan terpenting, dan apakah setiap warna punya satu arti tertulis?

**Tahap 1b, beberapa arah**, dipakai saat user minta pilihan, brief terbuka, atau klien baru yang arahnya belum dibahas. Buat dua atau tiga rencana, bukan halaman. Tiap arah berbeda keluarga: jawaban yang berbeda atas "apa yang paling dipercaya pengunjung ini" (misalnya foto, tipografi dan ruang, data dan bukti), bukan tiga palet di layout yang sama; terang dan gelap, serif dan grotesk, masing-masing paling banyak di satu arah. Tiap arah ditulis sama padat: nama, palet dengan asal-usul, font, momen visual, yang dibutuhkan dari klien, dan risikonya. Sebutkan satu rekomendasi, tanyakan satu hal, lalu bangun hanya yang dipilih. Kalau user bilang "pilih saja", bangun rekomendasinya.

**Tahap 2, bangun.** Ikuti rencana, palet sebagai token di satu tempat. Setelah jadi, buang satu elemen dekoratif yang tidak menjawab brief; hampir selalu ada satu.

**Tahap 3, periksa dengan alat.** Jalur skrip relatif terhadap folder SKILL.md ini (misalnya `~/.claude/skills/bukan-template/` atau `.claude/skills/bukan-template/` di project).

1. Selalu: `python3 scripts/periksa_statis.py <file atau folder .html> --tulis laporan-statis.md`. Perbaiki setiap FAIL; jawab setiap WARN dengan alasan atau perbaikan.
2. Kalau Playwright ada atau bisa dipasang (`npm i -D playwright && npx playwright install chromium`, di folder sementara, bukan folder hasil; jalankan skrip dari folder itu): `node scripts/periksa_browser.js <file.html> --out laporan`. Ia menyajikan halaman lewat server lokal sementara, menggulirnya sampai bawah, lalu mengambil tangkapan layar 390, 820, dan 1366 px dalam mode terang dan gelap. Yang dilaporkan: overflow, galat konsol, kontras hasil komposisi, fokus yang tidak terlihat, animasi saat reduced motion, isi yang hilang tanpa JavaScript, dan tombol yang tidak mengubah apa pun (`--tanpa-klik` kalau ada efek samping).
3. Buka tangkapan layarnya dan nilai komposisinya sendiri dengan daftar periksa di bawah. Yang salah di layar tapi tidak tertangkap skrip adalah temuan paling berharga; perbaiki, lalu jalankan ulang.
4. Skrip uji buatan sendiri, instalasi npm, dan tangkapan sementara dibuat di luar folder hasil. Yang diserahkan hanya halaman, asetnya, dan laporan.

**Penyerahan** memuat: ringkasan kedua laporan apa adanya, termasuk yang tidak bisa dijalankan; asumsi yang dibuat; kalau brief seadanya, paling banyak tiga isian yang paling akan mengubah hasil, mengikuti urutan di `references/templat-brief.md`; arah yang tidak dipilih kalau memakai tahap 1b; dan satu baris baru di `references/riwayat-arah.md` kalau file itu bisa ditulis.

## Daftar periksa akhir

**Semua jenis:**

- Tidak ada gradient ungu, emoji sebagai ikon, atau font default tanpa alasan.
- Setiap warna punya asal-usul, dan rencana tidak memakai dua ciri tanda tangan sekaligus.
- Tidak ada angka atau testimoni karangan, copy generik, atau copy yang menjelaskan desainnya sendiri.
- Semua state ada, tidak ada kontrol palsu, responsif sampai 390 px, kontras memadai, fokus terlihat, reduced motion dihormati.
- Brand lama dipertahankan kalau ada.
- Laporan pemeriksaan dijalankan dan dilampirkan; tidak ada klaim pengujian palsu.

**Halaman pemasaran:** satu aksen; momen visual yang menancap dan kontras skala yang jelas; halaman bercerita; gerak tiga jenis tanpa fade-up per section.

**Alat kerja:** setiap warna satu arti yang juga tersampaikan lewat teks; setiap angka punya pembanding dan format benar; grafik berjudul pertanyaan dengan ringkasan aksesibel; tabel benar-benar bekerja; tanpa gerak yang membuat pengguna menunggu.

**Penutup:** kalau halaman ini dijejerkan dengan dua halaman lain yang pernah dibuat, apakah ketiganya terlihat dari tangan yang berbeda? Kalau tidak, ada default yang belum ketahuan.
