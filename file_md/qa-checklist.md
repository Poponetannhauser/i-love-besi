# QA Checklist — ILoveBesi Web App

**Versi:** Fase 1 + Fase 2 selesai
**Dibuat:** 4 Juli 2026
**Platform:** Browser Desktop (Chrome/Edge), Tablet (iPad 768px+), Mobile (<480px)

---

> **PENTING:** Jalankan setiap skenario secara berurutan dari atas ke bawah. Buka DevTools (F12) → Console — pastikan tidak ada error merah. Reset state: DevTools → Application → Local Storage → Delete all sebelum mulai.

---

## Modul 0 — Sanity Check

| #   | Langkah                       | Expected Result                                      | Status |
| --- | ----------------------------- | ---------------------------------------------------- | ------ |
| 0.1 | Buka http://localhost:5173    | Landing page muncul, tidak ada error console         | [x]    |
| 0.2 | Klik tombol masuk ke app      | Pindah ke halaman Projects                           | [x]    |
| 0.3 | Cek DevTools Console          | Tidak ada error merah                                | [ ]    |
| 0.4 | Resize window ke 480px        | Hamburger menu muncul, tidak ada overflow horizontal | [x]    |
| 0.5 | Resize window ke 768px (iPad) | Layout terbaca, tidak ada elemen terpotong           | [x]    |

---

## Modul 1 — Manajemen Proyek

| #   | Langkah                                             | Expected Result                                      | Status |
| --- | --------------------------------------------------- | ---------------------------------------------------- | ------ |
| 1.1 | Klik "Buat Proyek Baru"                             | Modal/form baru muncul                               | [x]    |
| 1.2 | Isi nama: Proyek Gedung A, lokasi: Jakarta → Simpan | Proyek muncul di daftar                              | [x]    |
| 1.3 | Buat proyek kedua: Proyek Jembatan B                | Total 2 proyek di daftar                             | [x]    |
| 1.4 | Klik kartu Proyek Gedung A                          | Pindah ke Dashboard, sidebar menampilkan nama proyek | [x]    |
| 1.5 | Toggle status ACTIVE -> COMPLETED                   | Badge status berubah                                 | [x]    |
| 1.6 | Hapus salah satu proyek → konfirmasi                | Proyek terhapus                                      | [x]    |
| 1.7 | Refresh halaman (F5)                                | Proyek yang tersisa masih ada (localStorage)         | [x]    |
| 1.8 | Hapus semua proyek                                  | Daftar kosong, sidebar: "NO PROJECT SELECTED"        | [x]    |

---

## Modul 2 — Input Potongan Langsung (F1.1–F1.4 + F2.2 + F2.5)

> Setup: Buat proyek baru. Navigasi ke tab Inputs.

### 2A — Validasi Input

| #    | Langkah                                   | Expected Result                                      | Status |
| ---- | ----------------------------------------- | ---------------------------------------------------- | ------ |
| 2A.1 | Klik HITUNG & TAMBAH tanpa isi apapun     | Error: "Panjang potongan harus berupa angka positif" | [x]    |
| 2A.2 | Isi Panjang = 0, klik HITUNG              | Error muncul (length > 0)                            | [x]    |
| 2A.3 | Isi Panjang = 3.5, Jumlah = 1.5 (desimal) | Error: "Jumlah harus bilangan bulat positif"         | [x]    |
| 2A.4 | Isi Panjang = 3.5, Jumlah = -10           | Error muncul (jumlah harus positif)                  | [x]    |
| 2A.5 | Isi semua field valid, klik HITUNG        | Baris baru muncul di tabel, tidak ada error          | [-]    |

### 2B — Kalkulasi Berat Standar (rumus: W = 0.006165 x d^2 x L x N)

| #    | Input               | Expected Berat                             | Status |
| ---- | ------------------- | ------------------------------------------ | ------ |
| 2B.1 | D=10, L=12.0m, N=1  | 0.006165 x 100 x 12 x 1 = **7.398 kg**     | [ ]    |
| 2B.2 | D=16, L=6.0m, N=10  | 0.006165 x 256 x 6 x 10 = **94.65 kg**     | [ ]    |
| 2B.3 | D=13, L=4.5m, N=100 | 0.006165 x 169 x 4.5 x 100 = **468.65 kg** | [ ]    |

### 2C — Fitur Overlap (F2.2)

| #    | Langkah                                         | Expected Result                                   | Status |
| ---- | ----------------------------------------------- | ------------------------------------------------- | ------ |
| 2C.1 | D=12, Panjang=4.0, Qty=10. Aktifkan Overlap 40d | Preview: +0.48 m per batang (Total: 4.48 m)       | [ ]    |
| 2C.2 | Ganti ke 50d                                    | Preview: +0.60 m (Total: 4.60 m)                  | [ ]    |
| 2C.3 | Custom faktor=35                                | Preview: +0.42 m (12x35/1000=0.42m)               | [ ]    |
| 2C.4 | HITUNG & TAMBAH dengan overlap 40d aktif        | Tabel: kolom DESKRIPSI menampilkan Overlap +0.48m | [ ]    |
| 2C.5 | Cek kolom PANJANG di tabel                      | Menampilkan 4.48 m (base+overlap), bukan 4.0 m    | [ ]    |

### 2D — Besi Toleransi / Besi Banci (F2.5)

| #    | Langkah                                    | Expected Result                                                     | Status |
| ---- | ------------------------------------------ | ------------------------------------------------------------------- | ------ |
| 2D.1 | D=10, L=6.0, N=100, Banci 0.3mm            | Shrinkage: ~5.91%, Berat aktual ~348.16 kg (bukan 369.9 kg nominal) | [ ]    |
| 2D.2 | D=12, Banci 0.5mm                          | Shrinkage: ~8.16% (d aktual=11.5mm)                                 | [ ]    |
| 2D.3 | D=16, Custom aktual=15.2                   | Shrinkage: ~9.75%                                                   | [ ]    |
| 2D.4 | HITUNG & TAMBAH (D=10, Banci 0.3mm)        | Tabel DESKRIPSI: Banci (9.7mm)                                      | [ ]    |
| 2D.5 | Cek kolom BERAT                            | Berat aktual = 0.006165 x 9.7^2 x 6 x 100 = 348.16 kg               | [ ]    |
| 2D.6 | Banci Custom, tidak isi angka, klik HITUNG | Error: "Diameter aktual custom harus berupa angka positif"          | [ ]    |

### 2E — Reset Form

| #    | Langkah                                       | Expected Result                           | Status |
| ---- | --------------------------------------------- | ----------------------------------------- | ------ |
| 2E.1 | Setelah submit sukses                         | Field Panjang, Jumlah, Nama Elemen kosong | [ ]    |
| 2E.2 | Overlap & Banci checkbox state setelah submit | State checkbox tetap (tidak reset)        | [ ]    |

---

## Modul 3 — Asisten Sengkang (F2.3)

> Navigasi ke Inputs > tab Asisten Sengkang

| #   | Langkah                                                                     | Expected Result                                      | Status |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------- | ------ |
| 3.1 | HITUNG SENGKANG tanpa isi apapun                                            | Error: "Lebar dan tinggi harus berupa angka positif" | [ ]    |
| 3.2 | Isi: Lebar=20, Tinggi=40, Cover=2.5, Kait=10, PjgBalok=4.0, Jarak=15, Qty=3 | Live preview muncul                                  | [ ]    |
| 3.3 | Verifikasi panjang 1 sengkang                                               | 2x(17.5+35)=105cm, total=(105+20)/100 = 1.25 m       | [ ]    |
| 3.4 | Verifikasi jumlah sengkang                                                  | (4.0x100/15)x3 = ~80 pcs                             | [ ]    |
| 3.5 | Klik HITUNG & TAMBAH SENGKANG                                               | Item muncul di tabel DATA REBAR AKTIF                | [ ]    |
| 3.6 | Cover=15cm, Lebar=20cm                                                      | Error: "Tebal selimut beton melebihi ukuran beton"   | [ ]    |

---

## Modul 4 — Skema Pemotongan & Optimasi FFD (F2.1)

| #   | Langkah                                | Expected Result                                           | Status |
| --- | -------------------------------------- | --------------------------------------------------------- | ------ |
| 4.1 | Tambahkan D10: 3.0mx4pcs dan 4.5mx2pcs | Skema pemotongan tampil di panel SKEMA PEMOTONGAN         | [ ]    |
| 4.2 | Verifikasi POLA 1: 4.5+4.5+3.0=12.0m   | Pattern: ZERO WASTE                                       | [ ]    |
| 4.3 | Verifikasi TOTAL STOCK DIBUTUHKAN      | Sesuai hasil FFD                                          | [ ]    |
| 4.4 | Verifikasi EFISIENSI %                 | = total panjang potong / (total batang x 12) x 100%       | [ ]    |
| 4.5 | Buka tab Cut Lists                     | Pattern card muncul dengan visual bar dan tabel instruksi | [ ]    |

---

## Modul 5 — Data Rebar Aktif & Rekapitulasi

| #   | Langkah                  | Expected Result                          | Status |
| --- | ------------------------ | ---------------------------------------- | ------ |
| 5.1 | Kolom DESKRIPSI & INFO   | Nama elemen tampil bold                  | [ ]    |
| 5.2 | Item BjTP                | Sub-baris menampilkan "Polos"            | [ ]    |
| 5.3 | Item BjTS                | Sub-baris menampilkan "Ulir"             | [ ]    |
| 5.4 | Item dengan overlap      | Sub-baris: Overlap +Xm                   | [ ]    |
| 5.5 | Item dengan banci        | Sub-baris: Banci (X.Xmm)                 | [ ]    |
| 5.6 | Klik ikon hapus di baris | Baris terhapus                           | [ ]    |
| 5.7 | Klik Hapus Semua         | Semua baris terhapus, empty state muncul | [ ]    |
| 5.8 | Refresh browser (F5)     | Data masih ada (localStorage persists)   | [ ]    |

---

## Modul 6 — Tab Inventory / Master Rebar Ledger

| #   | Langkah                          | Expected Result                                     | Status |
| --- | -------------------------------- | --------------------------------------------------- | ------ |
| 6.1 | Buka tab Inventory               | Halaman muncul tanpa crash                          | [ ]    |
| 6.2 | Cek tabel MASTER REBAR LEDGER    | Setiap diameter + tipe besi = 1 baris               | [ ]    |
| 6.3 | Kolom GRADE untuk BjTS           | Menampilkan "BjTS 420 (Ulir)" (bukan "BJTS 420B")   | [ ]    |
| 6.4 | Kolom GRADE untuk BjTP           | Menampilkan "BjTP 280 (Polos)"                      | [ ]    |
| 6.5 | BERAT NOMINAL — item tanpa banci | Nominal = Aktual                                    | [ ]    |
| 6.6 | BERAT AKTUAL — item dengan banci | Berat aktual < nominal                              | [ ]    |
| 6.7 | Footer tabel                     | Menampilkan: "X.XX kg (Nominal) / Y.YY kg (Aktual)" | [ ]    |
| 6.8 | Badge STATUS semua baris         | "RECORDED" (berwarna hijau)                         | [ ]    |

---

## Modul 7 — Presets Cepat

| #   | Langkah                | Expected Result                                  | Status |
| --- | ---------------------- | ------------------------------------------------ | ------ |
| 7.1 | Klik preset D10 - 2.5M | Form: D=10, Panjang=2.5, Qty=100, Nama=Kolom D10 | [ ]    |
| 7.2 | Klik preset D13 - 4.0M | Form terisi nilai D13                            | [ ]    |
| 7.3 | Klik preset D16 - 3.2M | Form terisi nilai D16                            | [ ]    |

---

## Modul 8 — Multi-Proyek & Isolasi Data

| #   | Langkah                         | Expected Result                                  | Status |
| --- | ------------------------------- | ------------------------------------------------ | ------ |
| 8.1 | Di Proyek A, tambahkan 3 item   | Data tersimpan                                   | [ ]    |
| 8.2 | Pindah ke Proyek B, buka Inputs | Tabel kosong (data Proyek A tidak bocor)         | [ ]    |
| 8.3 | Tambahkan 2 item di Proyek B    | Data B tersimpan                                 | [ ]    |
| 8.4 | Kembali ke Proyek A             | 3 item Proyek A masih ada                        | [ ]    |
| 8.5 | Refresh browser                 | Kedua proyek dengan data masing-masing tetap ada | [ ]    |

---

## Modul 9 — Dashboard

| #   | Langkah                                | Expected Result                                              | Status |
| --- | -------------------------------------- | ------------------------------------------------------------ | ------ |
| 9.1 | Buka Dashboard (ada item di recapList) | Stat cards menampilkan angka non-zero                        | [ ]    |
| 9.2 | Stat TOTAL OPTIMIZED                   | Menampilkan total berat dalam format "X.XX tn"               | [ ]    |
| 9.3 | Stat MATERIAL EFFICIENCY               | Angka konsisten dengan efisiensi di tab Inputs               | [ ]    |
| 9.4 | Tabel RECENT CUT LIST PERFORMANCE      | 4 item terakhir tampil                                       | [ ]    |
| 9.5 | Di 768px (iPad) — 3 stat card          | Tersusun horizontal simetris, tidak ada card lebar sendirian | [ ]    |

---

## Modul 10 — Navigasi & Responsivitas

| #    | Langkah                                | Expected Result                             | Status |
| ---- | -------------------------------------- | ------------------------------------------- | ------ |
| 10.1 | Mobile: klik hamburger                 | Drawer sidebar muncul dari kiri             | [ ]    |
| 10.2 | Klik di luar drawer                    | Drawer tertutup                             | [ ]    |
| 10.3 | Klik item navigasi di drawer           | Pindah ke halaman, drawer tertutup otomatis | [ ]    |
| 10.4 | Klik logo ILOVEBESI di sidebar         | Kembali ke landing page                     | [ ]    |
| 10.5 | Scroll tabel Inventory di mobile       | Tabel bisa di-scroll horizontal             | [ ]    |
| 10.6 | Klik tombol Floating + (FAB) di Inputs | Sama dengan klik HITUNG & TAMBAH            | [ ]    |

---

## Modul 11 — Edge Cases & Stress Test

| #    | Langkah                                     | Expected Result                                  | Status |
| ---- | ------------------------------------------- | ------------------------------------------------ | ------ |
| 11.1 | Tambahkan 20+ item dengan diameter campuran | App responsif, tabel dan pattern render benar    | [ ]    |
| 11.2 | Item panjang tepat 12.0m                    | Pattern: 1 batang 1 potongan, ZERO WASTE         | [ ]    |
| 11.3 | Aktifkan Overlap + Besi Banci bersamaan     | Live preview menampilkan kedua info, tidak crash | [ ]    |
| 11.4 | Sengkang di Inventory                       | Grade sesuai tipe besi (BjTP/BjTS)               | [ ]    |
| 11.5 | DevTools Console sepanjang seluruh sesi     | Tidak ada uncaught error atau React warning      | [ ]    |

---

## Ringkasan Temuan

| Modul                | Status      | Catatan |
| -------------------- | ----------- | ------- |
| 0 – Sanity           | PASS / FAIL |         |
| 1 – Projects         | PASS / FAIL |         |
| 2A – Validasi        | PASS / FAIL |         |
| 2B – Berat Standar   | PASS / FAIL |         |
| 2C – Overlap         | PASS / FAIL |         |
| 2D – Besi Banci      | PASS / FAIL |         |
| 2E – Reset Form      | PASS / FAIL |         |
| 3 – Sengkang         | PASS / FAIL |         |
| 4 – FFD & Cut Lists  | PASS / FAIL |         |
| 5 – Data Rebar Aktif | PASS / FAIL |         |
| 6 – Inventory Ledger | PASS / FAIL |         |
| 7 – Presets          | PASS / FAIL |         |
| 8 – Multi-Proyek     | PASS / FAIL |         |
| 9 – Dashboard        | PASS / FAIL |         |
| 10 – Navigasi        | PASS / FAIL |         |
| 11 – Edge Cases      | PASS / FAIL |         |
