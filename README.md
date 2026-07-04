# 🏗️ ILOVEBESI — Web App Kalkulator Besi Beton Konstruksi

Aplikasi kalkulator volume dan berat besi beton standar SNI yang dirancang untuk membantu Quantity Surveyor (QS), kontraktor, dan praktisi lapangan di Indonesia dalam mempercepat estimasi material serta meminimalkan sisa potongan besi (*waste*).

Proyek ini dibangun sebagai **proyek portofolio personal** untuk mendemonstrasikan penyelesaian masalah riil di dunia konstruksi menggunakan teknik rekayasa perangkat lunak modern.

---

## 🎯 Latar Belakang & Masalah
Dalam estimasi anggaran konstruksi (*Quantity Surveying*), perhitungan volume besi tulangan (*rebar*) sering kali hanya menggunakan perkalian dasar. Di lapangan, kontraktor menghadapi tantangan nyata:
1. **Material Waste**: Sisa besi tulangan yang tidak terpakai dari panjang standar 12 meter.
2. **Besi Toleransi (Besi Banci)**: Ketidaksesuaian diameter aktual di pasar dengan label nominal standar SNI yang memengaruhi kalkulasi berat logistik.

**ILoveBesi** hadir untuk menyelesaikan masalah ini dengan menyediakan kalkulator berat jenis presisi SNI yang dilengkapi dengan algoritma optimasi pemotongan (*Cutting Stock Problem*) untuk menekan tingkat *waste* seminimal mungkin.

---

## 🚀 Fitur Utama & Highlight Portofolio

### 1. Core Engine: Kalkulator Berat SNI
Menggunakan perhitungan matematis deterministik standar SNI untuk akurasi berat logistik:
* **Rumus**: `W = 0.006165 × d² × L × N`
* **Transparansi Logistik (Besi Banci)**: Fitur koreksi berat menggunakan diameter aktual hasil ukur jangka sorong untuk menghindari selisih tonase saat barang ditimbang di toko material.

### 2. Algoritma Optimasi Pemotongan (Cutting Stock Problem)
Mengimplementasikan algoritma heuristik **First-Fit Decreasing (FFD)** untuk memecahkan masalah kombinatorial pemotongan besi 12 meter:
* **Efisiensi Tinggi**: Mengurutkan kebutuhan potongan dari terpanjang ke terpendek untuk menempatkannya pada ruang sisa paling optimal.
* **Visualisasi Lapangan**: Menghasilkan instruksi pemotongan visual per batang yang mudah dipahami oleh pekerja di lapangan.

### 3. Multi-Project Management & Persistent State
* Pengguna dapat mengelola beberapa proyek konstruksi sekaligus secara dinamis.
* Data di-persist ke dalam `localStorage` perangkat sehingga progres pengerjaan tidak hilang saat browser ditutup.

---

## 🏛️ Arsitektur Kode & Desain Sistem

```
src/
├── App.jsx              # Centralized State & Routing Tab
├── main.jsx             # React Entry Point
├── index.css            # Custom Design System (CSS Variables, Responsive Breakpoints)
├── components/
│   ├── LandingPage.jsx  # Welcome Screen & CTA
│   ├── ProjectsView.jsx # Proyek Management (CRUD)
│   ├── DashboardView.jsx# Ringkasan data & statistik proyek aktif
│   ├── InputsView.jsx   # Form kalkulator berat & Tabel Rekapitulasi (BBS)
│   ├── InventoryView.jsx# Master Ledger stok besi terkelompok
│   └── CutListsView.jsx # Visualisasi skema pemotongan besi 12m
└── utils/
    ├── formulas.js      # Implementasi rumus berat SNI & overlap
    └── optimizations.js # Engine optimasi cutting stock (FFD)
```

### Keputusan Rekayasa (Engineering Decisions)
* **Vanilla CSS over Framework**: Desain dibangun sepenuhnya menggunakan CSS murni dengan variabel dinamis untuk performa loading maksimal tanpa beban dependensi pihak ketiga.
* **React State Management (Lifting State Up)**: Menjaga alur data tetap searah (*unidirectional*) dengan menaruh state utama proyek di `App.jsx` untuk menjaga sinkronisasi data antar modul (Dashboard, Inputs, Inventory, dan Cut Lists).
* **Performance Optimization**: Operasi berat seperti algoritma optimasi pemotongan di-memoized menggunakan `useMemo` agar kalkulasi ulang hanya berjalan saat daftar material berubah.

---

## 🧪 Tech Stack

* **Frontend**: React 19, Vite 8
* **Styling**: Vanilla CSS (Custom Design System)
* **Code Quality**: oxlint
* **Storage**: Local Storage API (Browser-based)

---

## 📖 Dokumentasi Terkait
* **[Modul Belajar Internal](file_md/modul_belajar.md)**: Panduan detail mengenai arsitektur kode dan logika bisnis untuk pengembangan sistem lebih lanjut.

---

<div align="center">

**Project Portfolio by [Poponetannhauser](https://github.com/Poponetannhauser)**

</div>
