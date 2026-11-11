#!/usr/bin/env python3
"""Ringkas hasil satu putaran uji: jumlah FAIL dan WARN per eval dari periksa_statis.

Pakai: python3 evals/ringkas.py evals/hasil/<versi>
Struktur yang diharapkan: evals/hasil/<versi>/<nama-eval>/*.html
Bandingkan dua versi dengan menjalankan skrip ini pada keduanya.
"""
import os, subprocess, sys
akar = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
skrip = os.path.join(akar, "scripts", "periksa_statis.py")
if len(sys.argv) < 2 or not os.path.isdir(sys.argv[1]):
    print(__doc__); sys.exit(2)
folder = sys.argv[1]
print(f"{'eval':32} {'FAIL':>5} {'WARN':>5}")
for nama in sorted(os.listdir(folder)):
    jalur = os.path.join(folder, nama)
    if not os.path.isdir(jalur):
        continue
    hasil = subprocess.run([sys.executable, skrip, jalur], capture_output=True, text=True).stdout
    f = sum(l.startswith("FAIL") for l in hasil.splitlines())
    w = sum(l.startswith("WARN") for l in hasil.splitlines())
    print(f"{nama:32} {f:>5} {w:>5}")
