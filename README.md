<div align="center">

# 🏗️ ILOVEBESI

### Kalkulator Besi Beton Konstruksi — Built for the Real Field

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP](https://img.shields.io/badge/Status-MVP%20Live-brightgreen)](https://github.com/Poponetannhauser/i-love-besi)

**[📋 PRD](file_md/PRD.md)** · **[🐛 Report Bug](https://github.com/Poponetannhauser/i-love-besi/issues)** · **[💡 Request Feature](https://github.com/Poponetannhauser/i-love-besi/issues)**

</div>

---

## 🎯 Tentang Proyek

**ILoveBesi** adalah web app kalkulator besi beton (_rebar_) yang dirancang untuk **akurasi riil lapangan** — bukan sekadar perkalian sederhana.

Berbeda dari kalkulator besi biasa, ILoveBesi mengimplementasikan:
- ✅ **Rumus SNI standar** `W = 0.006165 × d² × L × N`
- ✅ **Algoritma optimasi pemotongan** (Cutting Stock Problem — FFD)
- ✅ **Multi-project management** dengan persistensi lokal
- ✅ **Deteksi besi banci** (toleransi diameter aktual vs nominal)
- ✅ **Visualisasi skema potong** untuk panduan lapangan

**Target pengguna:** Estimator (QS), Kontraktor, Mandor Besi, Pemilik Rumah Swadaya

---

## ✨ Fitur Utama

### Fase 1 — MVP (Production Ready)

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Kalkulator Berat SNI | ✅ Live | Hitung berat & tonase per diameter |
| Tabel Rekapitulasi (BBS) | ✅ Live | Rekap kumulatif semua elemen struktur |
| Multi-Project Management | ✅ Live | Kelola banyak proyek sekaligus |
| Data Persistence | ✅ Live | Otomatis tersimpan di browser |
| Validasi Input | ✅ Live | Cegah kalkulasi dengan input invalid |
| Pemilihan Tipe Besi | ✅ Live | BjTP (Polos) & BjTS (Ulir/Sirip) |

### Fase 2 — Fitur Lanjutan

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Optimasi Pemotongan (FFD) | ✅ Live | Minimasi waste dengan First-Fit-Decreasing |
| Visualisasi Cut List | ✅ Live | Panduan potong visual per batang |
| Deteksi Besi Banci (F2.5) | ✅ Live | Koreksi toleransi diameter aktual |
| Panjang Penyaluran (F2.2) | 🔜 Roadmap | Hitung lap splice / overlap |
| Sengkang Tahan Gempa (F2.3) | 🔜 Roadmap | Kait 135° untuk zona gempa |
| Zonasi Sengkang (F2.4) | 🔜 Roadmap | Perhitungan dinamis tumpuan vs lapangan |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Instalasi & Jalankan

```bash
# 1. Clone repo
git clone https://github.com/Poponetannhauser/i-love-besi.git
cd i-love-besi

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka browser di **http://localhost:5173**

### Build untuk Production

```bash
npm run build
npm run preview
```

---

## 🔬 Rumus Kalkulasi

### Berat Besi Beton (Standard SNI)

```
W = 0.006165 × d² × L × N
```

| Simbol | Keterangan | Satuan |
|--------|-----------|--------|
| `d` | Diameter besi | mm |
| `L` | Panjang batang (default 12m) | meter |
| `N` | Jumlah batang | pcs |
| `W` | **Berat Total** | **kg** |

**Contoh:** D16, L=12m, N=10 batang → `W = 0.006165 × 256 × 12 × 10 = 189.70 kg`

### Algoritma Optimasi Pemotongan (FFD)

Menggunakan **First-Fit Decreasing (FFD)** — algoritma heuristik yang:
1. Mengurutkan potongan dari terpanjang ke terpendek
2. Menempatkan setiap potongan ke batang 12m yang pertama muat
3. Meminimalkan jumlah batang yang terpakai (= meminimalkan waste)

> **Performa:** < 2 detik untuk 50 variasi potongan. Kompleksitas O(n log n).

---

## 🏛️ Arsitektur

```
src/
├── App.jsx              ← State management global + tab routing
├── main.jsx             ← Entry point
├── index.css            ← Design system (CSS variables, dark theme)
├── components/
│   ├── LandingPage.jsx  ← Halaman intro
│   ├── ProjectsView.jsx ← CRUD multi-project
│   ├── DashboardView.jsx← Statistik proyek aktif
│   ├── InputsView.jsx   ← Form kalkulator + tabel rekap (BBS)
│   ├── InventoryView.jsx← Rekap material per diameter
│   └── CutListsView.jsx ← Visualisasi instruksi pemotongan
└── utils/
    ├── formulas.js      ← Rumus SNI berat besi
    └── optimizations.js ← Algoritma FFD cutting stock
```

**Pola Arsitektur:** Lifting State Up — semua state proyek ada di `App.jsx`, diturunkan ke komponen anak via props.

**Storage:** `localStorage` dengan key `ilovebesi_multi_projects` (JSON array of projects).

---

## 🧪 Tech Stack

| Layer | Technology | Versi |
|-------|-----------|-------|
| Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Styling | Vanilla CSS | — |
| Linting | oxlint | 1.x |
| Storage | localStorage (Browser API) | — |

Tidak ada dependency UI library eksternal — semua komponen dibangun dari scratch.

---

## 📖 Dokumentasi Teknis

| Dokumen | Deskripsi |
|---------|-----------|
| [PRD.md](file_md/PRD.md) | Product Requirements Document (Fase 1 & 2) |
| [QA Checklist](file_md/qa-checklist.md) | Skenario uji validasi rumus |

---

## 🗺️ Roadmap

```
[Q3 2026] MVP Live ─────────────────────────────── ✅ DONE
[Q3 2026] Cutting Stock Visualization ──────────── ✅ DONE
[Q4 2026] Export CSV/Excel ─────────────────────── 🔜 Planned
[Q4 2026] Panjang Penyaluran (F2.2) ────────────── 🔜 Planned
[Q1 2027] Sengkang Gempa 135° (F2.3) ───────────── 🔜 Planned
[Q1 2027] Zonasi Sengkang (F2.4) ───────────────── 🔜 Planned
[Q2 2027] PWA / Offline Mode ───────────────────── 💡 Considering
[Q2 2027] Cloud Sync / Multi-device ────────────── 💡 Considering
```

---

## 🤝 Kontribusi

Pull request sangat welcome! Untuk perubahan besar, buka issue terlebih dahulu.

```bash
git checkout -b feature/nama-fitur
git commit -m "feat: tambah fitur X"
git push origin feature/nama-fitur
# → Buat Pull Request
```

---

## 📄 Lisensi

Distributed under the MIT License.

---

<div align="center">

**Dibuat untuk lapangan. Diuji dengan angka nyata.**

*Jika aplikasi ini membantu, mohon beri ⭐ di GitHub!*

</div>
