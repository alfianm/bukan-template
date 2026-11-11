#!/usr/bin/env python3
"""Pemeriksaan statis halaman HTML untuk skill bukan-template.

Pakai:  python3 periksa_statis.py <file.html | folder> [--tulis laporan.md]

Tanpa dependensi di luar pustaka standar Python. Memeriksa hal yang bisa dibaca
dari kode: struktur dokumen, pola slop yang dikenal, kontras pasangan warna yang
dideklarasikan bersama dalam satu aturan CSS, dan sintaks JavaScript (kalau ada
`node`). Yang TIDAK bisa diperiksa di sini: tampilan sebenarnya, kontras hasil
komposisi lapisan, dan apakah kontrol benar-benar bekerja; untuk itu jalankan
periksa_browser.js.

Hasil: baris FAIL (harus diperbaiki), WARN (periksa manual), INFO.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html.parser import HTMLParser

# ----------------------------------------------------------------- utilitas
FONT_DEFAULT = ["Inter", "Poppins", "Roboto", "Montserrat", "Open Sans", "Open+Sans"]
HOST_BOLEH = ["cdnjs.cloudflare.com", "cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com", "cdn.tailwindcss.com", "code.jquery.com"]
EMOJI = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF\U0001F1E6-\U0001F1FF]")
HEX = re.compile(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")


def hex_ke_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminansi(rgb):
    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def kontras(a, b):
    la, lb = luminansi(hex_ke_rgb(a)), luminansi(hex_ke_rgb(b))
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def hue_sat(h):
    r, g, b = hex_ke_rgb(h)
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    l = (mx + mn) / 2
    s = 0 if d == 0 else d / (1 - abs(2 * l - 1))
    if d == 0:
        hue = 0
    elif mx == r:
        hue = (60 * ((g - b) / d) + 360) % 360
    elif mx == g:
        hue = 60 * ((b - r) / d) + 120
    else:
        hue = 60 * ((r - g) / d) + 240
    return hue, s


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.heading = []          # (level, teks)
        self.ids = set()
        self.href = []             # (href, teks)
        self.img_tanpa_alt = 0
        self.tombol = []           # teks tombol/tautan
        self.skrip_src = []
        self.link_href = []
        self.font_family = []
        self.teks = []             # teks terlihat (di luar script/style)
        self.lang = None
        self.title = ""
        self.viewport = False
        self._tumpuk = []
        self._dalam = None
        self._buf = None
        self._dalam_judul = False
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "meta" and a.get("name") == "viewport":
            self.viewport = True
        if tag in ("script", "style"):
            self._skip += 1
        if tag == "script" and a.get("src"):
            self.skrip_src.append(a["src"])
        if tag == "link" and a.get("href"):
            self.link_href.append(a["href"])
            m = re.findall(r"family=([^&:]+)", a["href"])
            self.font_family += [x.replace("+", " ") for x in m]
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "img" and "alt" not in a:
            self.img_tanpa_alt += 1
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._dalam = int(tag[1])
            self._buf = []
        if tag in ("a", "button"):
            self._tumpuk.append([tag, a.get("href"), []])
        if tag == "title":
            self._dalam_judul = True

    def handle_endtag(self, tag):
        if tag in ("script", "style") and self._skip:
            self._skip -= 1
        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._dalam:
            self.heading.append((self._dalam, " ".join("".join(self._buf).split())[:70]))
            self._dalam = None
            self._buf = None
        if tag in ("a", "button") and self._tumpuk:
            t, href, buf = self._tumpuk.pop()
            teks = " ".join("".join(buf).split())
            if t == "a" and href is not None:
                self.href.append((href, teks))
            self.tombol.append(teks)
        if tag == "title":
            self._dalam_judul = False

    def handle_data(self, data):
        if self._skip:
            return
        if self._dalam_judul:
            self.title += data
        if self._buf is not None:
            self._buf.append(data)
        for t in self._tumpuk:
            t[2].append(data)
        if data.strip():
            self.teks.append(data)


def token_root(css):
    """Ambil deklarasi --nama: nilai dari blok :root pertama (mode terang)."""
    m = re.search(r":root\s*\{(.*?)\}", css, re.S)
    if not m:
        return {}
    tok = {}
    for nama, nilai in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", m.group(1)):
        tok[nama] = nilai.strip()
    return tok


def selesaikan(nilai, tok, kedalaman=0):
    """Kembalikan hex kalau nilai bisa diselesaikan ke satu warna hex."""
    nilai = nilai.strip()
    if kedalaman > 5:
        return None
    m = re.match(r"var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)", nilai)
    if m:
        if m.group(1) in tok:
            return selesaikan(tok[m.group(1)], tok, kedalaman + 1)
        return selesaikan(m.group(2), tok, kedalaman + 1) if m.group(2) else None
    h = HEX.fullmatch(nilai)
    return nilai if h else None


def periksa_kontras(css):
    tok = token_root(css)
    hasil = []
    # blok aturan: selector { deklarasi }
    for sel, badan in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        sel = " ".join(sel.split())
        if sel.startswith("@") or ":root" in sel:
            continue
        warna = re.search(r"(?<![\w-])color\s*:\s*([^;]+)", badan)
        latar = re.search(r"background(?:-color)?\s*:\s*([^;]+)", badan)
        if not (warna and latar):
            continue
        w = selesaikan(warna.group(1), tok)
        l = selesaikan(latar.group(1).split()[0], tok)
        if w and l:
            r = kontras(w, l)
            if r < 4.5:
                hasil.append((sel[:60], w, l, r))
    return hasil


def cek_js(html):
    if not shutil.which("node"):
        return "INFO: node tidak ada, sintaks JS tidak diperiksa"
    skrip = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S)
    if not skrip:
        return "INFO: tidak ada skrip inline"
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write("\n;\n".join(skrip))
        nama = f.name
    r = subprocess.run(["node", "--check", nama], capture_output=True, text=True)
    os.unlink(nama)
    if r.returncode == 0:
        return "PASS: sintaks JavaScript (%d blok)" % len(skrip)
    return "FAIL: sintaks JavaScript\n      " + r.stderr.strip().splitlines()[-1][:160]


def periksa(path):
    html = open(path, encoding="utf-8", errors="replace").read()
    p = Parser()
    p.feed(html)
    css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
    teks = " ".join(p.teks)
    L = ["## %s (%d KB)" % (os.path.basename(path), len(html) // 1024)]

    # --- dokumen
    L.append(("PASS" if p.lang else "FAIL") + ": atribut lang" + ("" if p.lang else " tidak ada di <html>"))
    L.append(("PASS" if p.viewport else "FAIL") + ": meta viewport")
    L.append(("PASS" if p.title.strip() else "FAIL") + ": <title>" + (" = " + p.title.strip()[:60] if p.title.strip() else " kosong"))

    # --- heading
    h1 = [h for h in p.heading if h[0] == 1]
    if len(h1) != 1:
        L.append("WARN: jumlah h1 = %d (idealnya satu)" % len(h1))
    lompat = [(a, b) for a, b in zip(p.heading, p.heading[1:]) if b[0] - a[0] > 1]
    if lompat:
        L.append("WARN: urutan heading melompat: " + "; ".join("h%d→h%d (%s)" % (a[0], b[0], b[1][:30]) for a, b in lompat[:3]))
    elif p.heading:
        L.append("PASS: urutan heading (%d heading)" % len(p.heading))

    # --- tautan
    mati = [h for h, t in p.href if h.startswith("#") and len(h) > 1 and h[1:] not in p.ids]
    kosong = [t for h, t in p.href if h == "#"]
    L.append("FAIL: anchor tanpa target: " + ", ".join(sorted(set(mati))[:6]) if mati else "PASS: semua anchor punya target")
    if kosong:
        L.append("WARN: %d tautan href=\"#\" (tautan kosong, pastikan memang menuju atas halaman): %s" % (len(kosong), ", ".join(x[:20] or "(tanpa teks)" for x in kosong[:4])))
    if p.img_tanpa_alt:
        L.append("FAIL: %d <img> tanpa atribut alt" % p.img_tanpa_alt)

    # --- pola slop
    em = EMOJI.findall(re.sub(r"<!--.*?-->", "", html, flags=re.S))
    if em:
        L.append("FAIL: emoji ditemukan (%d): %s  → emoji bukan ikon" % (len(em), " ".join(sorted(set(em))[:8])))
    grad = re.findall(r"gradient\([^)]*\)", css)
    ungu = [g for g in grad if any(240 <= hue_sat(h)[0] <= 300 and hue_sat(h)[1] > 0.35 for h in HEX.findall(g))]
    if ungu:
        L.append("FAIL: gradient ungu/indigo: " + ungu[0][:70])
    elif grad:
        L.append("INFO: %d gradient; pastikan punya alasan (garis, arsir, bayangan) bukan hiasan" % len(grad))
    fd = [f for f in p.font_family if any(f.split(":")[0].strip().lower() == d.lower() for d in FONT_DEFAULT)]
    if fd:
        L.append("WARN: font default: %s (boleh hanya kalau alasannya disebutkan)" % ", ".join(fd))
    L.append("INFO: font: " + (", ".join(p.font_family) if p.font_family else "tidak ada Google Fonts"))
    pola_umum = [(r"lorem ipsum", "lorem ipsum")]
    # Frasa berbahasa Inggris hanya dipersoalkan pada situs berbahasa Indonesia.
    pola_id = [(r"all rights reserved", "“All rights reserved” di situs berbahasa Indonesia"), (r"made with\s*(❤|<3|love)", "“Made with ❤”")]
    for pola, pesan in pola_umum + (pola_id if (p.lang or "").lower().startswith("id") else []):
        if re.search(pola, teks, re.I):
            L.append("FAIL: " + pesan)
    panah = [t for t in p.tombol if "→" in t or "->" in t]
    if panah:
        L.append("WARN: panah di tombol/tautan: " + ", ".join(t[:25] for t in panah[:4]))
    klaim = re.findall(r"\b\d{1,3}(?:[.,]\d+)?\s?[kKjM]?\+|\b99[.,]9\s?%|\b4[.,]\d\s?★", teks)
    if klaim:
        L.append("WARN: angka yang mirip klaim pamer: %s (pastikan nyata dari brief)" % ", ".join(klaim[:5]))
    kapital = re.findall(r"text-transform\s*:\s*uppercase", css)
    if len(kapital) > 4:
        L.append("INFO: text-transform uppercase dipakai %d kali; pastikan bukan eyebrow tanpa fungsi" % len(kapital))

    # --- gerak
    ada_gerak = bool(re.search(r"@keyframes|transition\s*:|animation\s*:", css))
    ada_rm = "prefers-reduced-motion" in html
    if ada_gerak and not ada_rm:
        L.append("FAIL: ada animasi/transisi tapi prefers-reduced-motion tidak ditangani")
    elif ada_gerak:
        L.append("PASS: gerak ditangani untuk reduced motion")
    if re.search(r"translateY\(\s*(3\d|4\d|5\d|6\d)px\)", css) and "IntersectionObserver" in html:
        L.append("WARN: ada pemunculan dari jarak jauh (≥30px); batas skill 8–12px")
    if re.search(r"hover[^{]*\{[^}]*translateY\(-\d", css):
        L.append("WARN: kartu/elemen naik saat hover; pastikan bukan di semua kartu")

    # --- sumber luar
    luar = [u for u in p.skrip_src + p.link_href if u.startswith("http") and not any(h in u for h in HOST_BOLEH)]
    if luar:
        L.append("WARN: sumber luar di luar host yang dikenal: " + ", ".join(u[:50] for u in luar[:3]))
    for u in p.skrip_src:
        if re.search(r"@latest|@\d+(\.\d+)?/|/npm/[^@/]+/", u):
            L.append("WARN: skrip tanpa versi terkunci: " + u[:70])

    # --- kontras
    buruk = periksa_kontras(css)
    if buruk:
        for sel, w, l, r in buruk[:8]:
            L.append("WARN: kontras %.2f:1 (%s di %s) pada `%s` — periksa ukuran teksnya" % (r, w, l, sel))
    else:
        L.append("PASS: tidak ada pasangan color/background dalam satu aturan di bawah 4,5:1 (yang bisa diselesaikan dari token terang)")

    # --- js
    L.append(cek_js(html))
    return "\n".join(L)


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    tulis = None
    if "--tulis" in argv:
        i = argv.index("--tulis")
        tulis = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    berkas = []
    for a in argv[1:]:
        if os.path.isdir(a):
            for root, dirs, files in os.walk(a):
                # node_modules dan folder tersembunyi bukan bagian dari halaman yang diserahkan.
                dirs[:] = [d for d in dirs if d != "node_modules" and not d.startswith(".")]
                berkas += [os.path.join(root, f) for f in files if f.endswith(".html")]
        elif a.endswith(".html"):
            berkas.append(a)
    if not berkas:
        print("Tidak ada file .html")
        return 2
    laporan = ["# Laporan pemeriksaan statis", ""]
    for b in sorted(berkas):
        laporan.append(periksa(b))
        laporan.append("")
    gagal = sum(l.startswith("FAIL") for r in laporan for l in r.splitlines())
    peringatan = sum(l.startswith("WARN") for r in laporan for l in r.splitlines())
    laporan.append("Ringkasan: %d FAIL, %d WARN. Pemeriksaan ini membaca kode, bukan tampilan; jalankan periksa_browser.js untuk tangkapan layar, kontras hasil komposisi, dan uji kontrol." % (gagal, peringatan))
    keluaran = "\n".join(laporan)
    print(keluaran)
    if tulis:
        with open(tulis, "w", encoding="utf-8") as f:
            f.write(keluaran)
    return 1 if gagal else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
