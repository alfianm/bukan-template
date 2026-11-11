#!/usr/bin/env node
/* Pemeriksaan di browser untuk skill bukan-template.

   Pakai:  node periksa_browser.js <file.html | http://...> [--out laporan] [--tanpa-klik]
   Butuh:  npm i -D playwright && npx playwright install chromium   (sekali per mesin)

   File lokal disajikan lewat server sementara di 127.0.0.1, bukan file://, supaya galatnya sama dengan
   di hosting sungguhan (di file://, preload font dengan crossorigin selalu diblokir CORS).

   Yang dilakukan, per halaman:
   1. Tangkapan layar penuh di 390, 820, dan 1366 px, masing-masing mode terang dan gelap, setelah halaman
      digulir sampai bawah supaya isi yang muncul saat digulir ikut terpotret.
   2. Galat konsol dan galat halaman.
   3. Overflow horizontal (halaman yang bisa digeser ke samping) di tiap lebar.
   4. Kontras teks dari warna hasil komposisi (termasuk lapisan tembus pandang): <4,5:1 untuk teks biasa, <3:1 untuk teks besar.
      Teks di elemen fixed/sticky tembus pandang dilaporkan WARN: latarnya isi lain yang lewat di bawahnya.
   5. Fokus keyboard: menekan Tab 10 kali, elemen yang fokusnya tidak terlihat dilaporkan.
   6. Reduced motion: dengan preferensi "reduce", animasi yang masih berjalan dilaporkan.
   7. Tombol yang tidak melakukan apa-apa: tiap <button> diklik, lalu dibandingkan apakah DOM, URL, atau dialog berubah.
      Ini heuristik; hasilnya WARN untuk diperiksa manual, bukan vonis. Lewati dengan --tanpa-klik.
   8. Isi tanpa JavaScript: teks yang menempati tempat tapi tidak terlihat (biasanya efek muncul-saat-digulir
      yang menyembunyikan isi lewat CSS saja) dilaporkan WARN.

   Hasil: folder laporan/ berisi png dan laporan.md. Keluar dengan kode 1 kalau ada FAIL.
*/
const fs = require('fs');
const http = require('http');
const path = require('path');

let chromium;
// Cari Playwright di folder kerja dulu, baru di sekitar skrip ini.
try { ({ chromium } = require(require.resolve('playwright', { paths: [process.cwd(), __dirname] }))); }
catch (e) { console.error('Playwright belum terpasang. Jalankan: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

const argv = process.argv.slice(2);
const target = argv.find(a => !a.startsWith('--'));
if (!target) { console.error('Pakai: node periksa_browser.js <file.html|url> [--out laporan] [--tanpa-klik]'); process.exit(2); }
const outDir = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : 'laporan';
const tanpaKlik = argv.includes('--tanpa-klik');
const nama = path.basename(target).replace(/\.html?$/, '') || 'halaman';
fs.mkdirSync(outDir, { recursive: true });

const LEBAR = [[390, 844, 'ponsel'], [820, 1180, 'tablet'], [1366, 900, 'desktop']];
const L = [];
const catat = (tingkat, pesan) => { L.push(`${tingkat}: ${pesan}`); console.log(`${tingkat}: ${pesan}`); };

/* Server statis sementara untuk folder halaman; hanya mendengar di 127.0.0.1. */
const JENIS = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8' };
function sajikan(akar) {
  const server = http.createServer((req, res) => {
    let p;
    try { p = path.resolve(akar, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)); } catch (e) { res.writeHead(400).end(); return; }
    if (p !== akar && !p.startsWith(akar + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    fs.readFile(p, (err, isi) => {
      if (err) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': JENIS[path.extname(p).toLowerCase()] || 'application/octet-stream' }).end(isi);
    });
  });
  return new Promise((ok, gagal) => { server.once('error', gagal); server.listen(0, '127.0.0.1', () => ok(server)); });
}

/* Gulir sampai bawah seperti pengunjung, lalu kembali ke atas, supaya isi yang muncul saat digulir sudah tampil. */
async function gulirSampaiBawah(page) {
  await page.evaluate(async () => {
    const tunggu = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.6)) { scrollTo(0, y); await tunggu(120); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

/* Dijalankan di dalam halaman: kontras teks dari warna hasil komposisi. */
function periksaKontrasDiHalaman() {
  const parse = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const campur = (atas, bawah) => ({ r: atas.r * atas.a + bawah.r * (1 - atas.a), g: atas.g * atas.a + bawah.g * (1 - atas.a), b: atas.b * atas.a + bawah.b * (1 - atas.a), a: 1 });
  /* Latar dari rantai induk. Kalau lapisan pekat baru ditemukan di atas elemen fixed/sticky, latar
     sebenarnya adalah isi lain yang lewat di bawahnya, jadi hasilnya ditandai tidak pasti. */
  const latar = el => {
    const lapisan = []; let n = el, melayang = false, pasti = true;
    while (n && n.nodeType === 1) {
      const cs = getComputedStyle(n); const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { if (melayang) pasti = false; lapisan.push(c); if (c.a >= 1) break; }
      if (cs.position === 'fixed' || cs.position === 'sticky') melayang = true;
      n = n.parentElement;
    }
    if (!n && melayang) pasti = false;
    let dasar = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = lapisan.length - 1; i >= 0; i--) dasar = campur(lapisan[i], dasar);
    return { ...dasar, pasti };
  };
  const terlihat = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0' && !(cs.position === 'absolute' && cs.clip === 'rect(0px, 0px, 0px, 0px)'); };
  const jalur = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.'); return s; };
  const hasil = []; let n = 0;
  for (const el of document.body.querySelectorAll('*')) {
    if (n > 600) break;
    const teks = Array.from(el.childNodes).filter(x => x.nodeType === 3).map(x => x.textContent).join('').trim();
    if (!teks || !terlihat(el)) continue;
    n++;
    const cs = getComputedStyle(el); const w = parse(cs.color); if (!w) continue;
    const bg = latar(el);
    const warna = w.a < 1 ? campur(w, bg) : w;
    const rasio = (Math.max(lum(warna), lum(bg)) + 0.05) / (Math.min(lum(warna), lum(bg)) + 0.05);
    const ukuran = parseFloat(cs.fontSize), tebal = parseInt(cs.fontWeight, 10) >= 700;
    const besar = ukuran >= 24 || (ukuran >= 18.66 && tebal);
    const batas = besar ? 3 : 4.5;
    if (rasio < batas) hasil.push({ el: jalur(el), teks: teks.slice(0, 40), rasio: +rasio.toFixed(2), batas, warna: cs.color, latar: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`, pasti: bg.pasti });
  }
  return hasil;
}

/* Dijalankan di dalam halaman: sidik jari keadaan untuk uji klik. */
function sidikJari() {
  return [location.href, document.body.innerHTML.length, document.querySelectorAll('dialog[open]').length, document.activeElement && document.activeElement.tagName, document.body.className, Array.from(document.querySelectorAll('[aria-pressed],[aria-expanded],[aria-selected]')).map(e => e.getAttribute('aria-pressed') || e.getAttribute('aria-expanded') || e.getAttribute('aria-selected')).join('')].join('|');
}

let server;
(async () => {
  let url = target;
  if (!/^https?:/.test(target)) {
    const berkas = path.resolve(target);
    server = await sajikan(path.dirname(berkas));
    url = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(path.basename(berkas))}`;
  }
  const browser = await chromium.launch();
  const galatKonsol = new Set();

  for (const [w, h, label] of LEBAR) {
    for (const skema of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: skema, reducedMotion: 'no-preference', deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      page.on('console', m => { if (m.type() === 'error') galatKonsol.add(m.text().slice(0, 160)); });
      page.on('pageerror', e => galatKonsol.add('pageerror: ' + String(e.message).slice(0, 160)));
      try { await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }); } catch (e) { await page.goto(url, { waitUntil: 'load', timeout: 20000 }); }
      await page.waitForTimeout(1800);
      await gulirSampaiBawah(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (overflow) catat('FAIL', `overflow horizontal di ${label} ${w}px (${skema})`);
      const file = path.join(outDir, `${nama}-${label}-${skema}.png`);
      await page.screenshot({ path: file, fullPage: true });
      catat('INFO', `tangkapan layar ${label} ${skema}: ${file}`);
      if (label === 'desktop') {
        const buruk = await page.evaluate(periksaKontrasDiHalaman);
        buruk.filter(b => b.pasti).slice(0, 12).forEach(b => catat('FAIL', `kontras ${b.rasio}:1 (batas ${b.batas}) ${skema} pada ${b.el} “${b.teks}” ${b.warna} di ${b.latar}`));
        const melayang = buruk.filter(b => !b.pasti);
        if (melayang.length) catat('WARN', `kontras tidak pasti ${skema} pada ${melayang.length} teks di elemen fixed/sticky tembus pandang (mis. ${melayang[0].el} “${melayang[0].teks}”); latarnya isi yang lewat di bawahnya, periksa di tangkapan layar`);
        if (!buruk.length) catat('PASS', `kontras teks hasil komposisi, mode ${skema}`);
      }
      if (label === 'ponsel' && skema === 'light') {
        /* Fokus keyboard */
        const tanpaFokus = [];
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          const info = await page.evaluate(() => {
            const el = document.activeElement; if (!el || el === document.body) return null;
            const cs = getComputedStyle(el); const adaOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0; const adaBayang = cs.boxShadow && cs.boxShadow !== 'none';
            return { tag: el.tagName.toLowerCase(), teks: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), terlihat: adaOutline || adaBayang };
          });
          if (info && !info.terlihat) tanpaFokus.push(`${info.tag} “${info.teks}”`);
        }
        if (tanpaFokus.length) catat('FAIL', `fokus keyboard tidak terlihat pada: ${[...new Set(tanpaFokus)].slice(0, 6).join(', ')}`);
        else catat('PASS', 'fokus keyboard terlihat pada 10 elemen pertama');
      }
      await ctx.close();
    }
  }
  if (galatKonsol.size) [...galatKonsol].slice(0, 8).forEach(g => catat('FAIL', `galat konsol: ${g}`));
  else catat('PASS', 'tidak ada galat konsol atau galat halaman');

  /* Reduced motion */
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(900);
    const jalan = await page.evaluate(() => (document.getAnimations ? document.getAnimations().filter(a => a.playState === 'running' && !(a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('[aria-busy="true"],.kerangka,.skeleton'))).length : -1));
    if (jalan > 0) catat('FAIL', `${jalan} animasi masih berjalan saat prefers-reduced-motion: reduce`);
    else if (jalan === 0) catat('PASS', 'tidak ada animasi berjalan saat reduced motion');
    else catat('INFO', 'document.getAnimations tidak tersedia');
    await ctx.close();
  }

  /* Isi tanpa JavaScript */
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    const tersembunyi = await page.evaluate(() => Array.from(document.body.querySelectorAll('*')).filter(el => {
      if (!Array.from(el.childNodes).some(x => x.nodeType === 3 && x.textContent.trim())) return false;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false;
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden') return true; }
      return false;
    }).length);
    // Ambang 3: satu dua tooltip atau label tersembunyi masih wajar.
    if (tersembunyi >= 3) catat('WARN', `${tersembunyi} elemen berteks tidak terlihat tanpa JavaScript; sembunyikan isi muncul-saat-digulir hanya setelah skrip menambah kelas`);
    else catat('PASS', 'isi tetap terlihat tanpa JavaScript');
    await ctx.close();
  }

  /* Tombol yang tidak melakukan apa-apa */
  if (!tanpaKlik) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();
    page.on('dialog', d => d.dismiss().catch(() => {}));
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(1500);
    const jumlah = await page.evaluate(() => document.querySelectorAll('button').length);
    const diam = [];
    for (let i = 0; i < Math.min(jumlah, 40); i++) {
      const info = await page.evaluate(i => { const b = document.querySelectorAll('button')[i]; if (!b) return null; const r = b.getBoundingClientRect(); return { teks: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 30), aktif: !b.disabled && r.width > 0 && r.height > 0 && b.closest('dialog') === null }; }, i);
      if (!info || !info.aktif) continue;
      const sebelum = await page.evaluate(sidikJari);
      try { await page.evaluate(i => document.querySelectorAll('button')[i].click(), i); } catch (e) { continue; }
      await page.waitForTimeout(350);
      const sesudah = await page.evaluate(sidikJari);
      if (sebelum === sesudah) diam.push(info.teks || `tombol ke-${i + 1}`);
      await page.keyboard.press('Escape').catch(() => {});
      if (page.url() !== url && !page.url().startsWith(url)) { await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(800); }
    }
    if (diam.length) catat('WARN', `tombol yang tidak tampak mengubah apa pun saat diklik (periksa manual, bisa jadi pura-pura): ${[...new Set(diam)].slice(0, 10).join(', ')}`);
    else catat('PASS', `semua ${Math.min(jumlah, 40)} tombol yang diuji mengubah sesuatu saat diklik`);
    const kosong = await page.evaluate(() => document.querySelectorAll('a[href="#"]').length);
    if (kosong) catat('WARN', `${kosong} tautan href="#"`);
    await ctx.close();
  }

  await browser.close();
  if (server) server.close();
  const gagal = L.filter(l => l.startsWith('FAIL')).length, peringatan = L.filter(l => l.startsWith('WARN')).length;
  const laporan = `# Laporan pemeriksaan browser: ${nama}\n\n${L.join('\n')}\n\nRingkasan: ${gagal} FAIL, ${peringatan} WARN. Lihat tangkapan layar di ${outDir}/ dan nilai komposisinya dengan daftar periksa skill.\n`;
  fs.writeFileSync(path.join(outDir, `laporan-${nama}.md`), laporan);
  console.log(`\nRingkasan: ${gagal} FAIL, ${peringatan} WARN. Laporan: ${path.join(outDir, `laporan-${nama}.md`)}`);
  process.exit(gagal ? 1 : 0);
})().catch(e => { console.error('Galat:', e.message); process.exit(2); });
