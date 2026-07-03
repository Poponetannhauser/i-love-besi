# Product Requirement Document (PRD)

## Project: Web App Kalkulator Besi Beton Konstruksi (ILoveBesi)

**Versi:** 2.0
**Tanggal:** 3 Juli 2026
**Status:** Draft / Proposed
**Bahasa:** Indonesia

---

### 1. Ringkasan Eksekutif & Latar Belakang

Dalam proyek konstruksi, perhitungan volume besi tulangan (_rebar_) merupakan komponen kritis dalam penentuan anggaran (_Quantity Surveying_) dan pelaksanaan di lapangan. Aplikasi kalkulator besi yang ada saat ini mayoritas hanya menyediakan fungsi perkalian dasar (diameter x jumlah x berat jenis).

Aplikasi ini dibangun untuk memberikan solusi perhitungan besi beton yang berfokus pada akurasi riil lapangan. Pengembangan dibagi menjadi dua fase: **Fase 1 (MVP, Fitur Dasar)** untuk validasi fungsi kalkulasi standar dan mendapatkan produk yang benar-benar bisa dipakai secepat mungkin, dan **Fase 2 (Edge Cases)** untuk menyelesaikan masalah teknik lapangan yang sering dihadapi kontraktor di Indonesia.

**Konteks proyek:** aplikasi ini dikerjakan sebagai proyek portofolio sekaligus alat bantu nyata untuk rekan yang bekerja di bidang konstruksi. Karena tidak ada tenggat dari pihak luar, target internal ditetapkan agar Fase 1 selesai dan bisa didemokan dalam 1-3 hari kerja, bukan disempurnakan tanpa batas.

---

### 2. Tujuan Produk

- **Fase 1 (MVP):** Menyediakan alat hitung volume dan berat besi beton standar SNI yang cepat, responsif, mudah digunakan lewat web browser, dan selesai dalam waktu singkat agar bisa segera dipakai dan diuji oleh pengguna nyata.
- **Fase 2:** Menghadirkan diferensiasi produk (_edge cases_) yang mampu menghemat sisa material (_waste management_), menghitung variasi struktur tahan gempa, dan mengonversi toleransi ukuran besi lokal (besi banci). Dikerjakan setelah Fase 1 terbukti jalan dan dipakai.

---

### 3. Audiens Target

1. **Estimator / Quantity Surveyor (QS):** Profesional yang menghitung kebutuhan material untuk Rencana Anggaran Biaya (RAB).
2. **Kontraktor & Pelaksana Lapangan:** Pihak yang memesan logistik besi ke _supplier_ dan mengatur pemotongan besi di proyek.
3. **Mandor / Tukang Besi (_Steel Fixer_):** Praktisi lapangan yang membutuhkan panduan pemotongan besi yang optimal.
4. **Pemilik Rumah Swadaya:** Orang awam yang sedang membangun rumah sendiri dan ingin memvalidasi belanja material besi.

---

### 4. Arsitektur Pengembangan & Ruang Lingkup (Scope)

#### 4.1 Fase 1: MVP - Perhitungan Normal & Fitur Dasar (Core Engine)

Scope ini final untuk MVP. Tidak ada penambahan fitur di luar daftar berikut sebelum MVP selesai dan diuji.

- **F1.1: Kalkulator Berat Jenis Standar**
  - Input: Diameter Besi ($d$ dalam mm), Panjang Batang ($L$ dalam meter, default 12m, bisa diubah), Jumlah Batang ($N$).
  - Output: Berat Total dalam Kilogram (Kg) dan Tonase.
  - _Rumus Dasar:_ $W = 0.006165 \times d^2 \times L \times N$
- **F1.2: Pemilihan Tipe Besi**
  - Dropdown pilihan besi: Besi Polos (BjTP) dan Besi Sirip/Ulir (BjTS). Di MVP ini murni label/metadata pencatatan, belum memengaruhi rumus.
  - Pilihan diameter standar pasar Indonesia (6mm, 8mm, 10mm, 12mm, 13mm, 16mm, 19mm, 22mm, 25mm, dst).
- **F1.3: Tabel Rekapitulasi (BBS Sederhana)**
  - Setiap kali user klik "Hitung", hasil masuk sebagai baris baru di tabel, dengan kolom keterangan/nama elemen (misal K1, B1) yang diisi manual oleh user.
  - Tabel menampilkan total berat kumulatif dari seluruh baris.
  - Ekspor CSV/Excel **ditunda ke luar MVP** — tidak menghalangi user mencoba dan memvalidasi kalkulatornya.
- **F1.4: Validasi Input (baru ditambahkan)**
  - Diameter dan panjang batang harus lebih besar dari 0; jumlah batang harus bilangan bulat positif.
  - Jika input tidak valid, tampilkan pesan error yang jelas dan jangan jalankan kalkulasi dengan angka yang salah.
- **F1.5: Penyimpanan Data Dasar (baru ditambahkan)**
  - Data tabel rekap disimpan minimal secara lokal di browser (local storage) per perangkat, agar tidak hilang saat halaman ditutup/dibuka ulang.
  - Ini fondasi minimum untuk mendukung metrik retensi di bagian 7; opsi akun/cloud sync dipertimbangkan di luar MVP jika dibutuhkan.

#### 4.2 Fase 2: Fitur Lanjutan (Edge Cases Implementation)

Dikerjakan setelah Fase 1 selesai, diuji, dan terbukti dipakai. Urutan berikut adalah urutan prioritas pengerjaan, bukan urutan tampil di dokumen.

- **F2.1: Algoritma Optimasi Pemotongan (Cutting Stock Problem) — Prioritas 1**
  - _Deskripsi:_ Meminimalkan sisa besi tulangan (_waste_) yang tidak terpakai dari panjang standar 12 meter.
  - _Input:_ Daftar panjang potongan yang dibutuhkan lapangan dan jumlahnya (misal: butuh ukuran 4.2m sebanyak 10 biji, ukuran 3.1m sebanyak 15 biji).
  - _Output:_ Rekomendasi jumlah batang besi 12m yang harus dibeli + skema pemotongan visual.
  - _Catatan implementasi:_ versi pertama menggunakan algoritma heuristik sederhana (greedy / First-Fit-Decreasing), bukan solusi optimal matematis (integer programming). Versi optimal dipertimbangkan sebagai iterasi lanjutan setelah versi greedy tervalidasi dipakai.
  - _Catatan metrik:_ karena ini masalah optimasi (NP-hard), tidak ada satu "jawaban benar tunggal" untuk dibandingkan. Keberhasilan diukur dari persentase efisiensi (rasio waste terhadap total besi terpakai) dibanding baseline potong manual, bukan deviasi 0% terhadap hitungan manual.
- **F2.2: Kalkulator Panjang Penyaluran (Lap Splice / Overlap)**
  - _Deskripsi:_ Menghitung ekstra panjang besi yang dibutuhkan saat menyambung dua batang besi.
  - _Input:_ Mutu beton (K-250, K-300, fc' 25 MPa, dll), lokasi sambungan (tulangan atas/bawah), kondisi beton.
  - _Output:_ Rekomendasi panjang overlap otomatis (misal $40d$ atau $50d$) dalam satuan sentimeter yang langsung ditambahkan ke perhitungan volume total.
- **F2.3: Opsi Kait Begel/Sengkang Tahan Gempa (135° Hooks)**
  - _Deskripsi:_ Menghitung tekukan ujung begel sengkang sesuai standar gempa.
  - _Input:_ Dimensi bersih kolom/balok (misal 20x20 cm), ketebalan selimut beton (default 2.5 cm).
  - _Pilihan:_ Toggle opsi "Kait Gempa 135°" vs "Kait Standar 90°".
  - _Output:_ Total panjang satu buah begel setelah ditambah kompensasi tekukan kait ($6d$ atau minimal 7.5 cm per ujung kait).
- **F2.4: Zonasi Sengkang Dinamis (Tumpuan vs Lapangan)**
  - _Deskripsi:_ Menghitung jumlah begel yang kerapatannya berbeda di ujung balok dibanding tengah balok.
  - _Input:_ Panjang total balok/kolom, jarak sengkang di area tumpuan (misal 10 cm), jarak sengkang di area lapangan (misal 20 cm).
  - _Output:_ Jumlah total begel terhitung secara matematis, membagi zona 1/4 panjang (tumpuan kiri), 1/2 panjang (lapangan), dan 1/4 panjang (tumpuan kanan).
- **F2.5: Faktor Koreksi Besi Toleransi (Besi Banci)**
  - _Deskripsi:_ Mengakomodasi realita pasar Indonesia di mana banyak besi memiliki diameter aktual di bawah label nominal standar.
  - _Tujuan produk (diperjelas):_ fitur ini adalah alat **transparansi dan proteksi pengguna** — membantu QS/kontraktor mendeteksi dan memverifikasi selisih berat riil vs teoritis saat besi ditimbang di toko material, bukan alat untuk membenarkan pemakaian besi di bawah spesifikasi pada struktur.
  - _Input:_ Dropdown opsi toleransi: "Full SNI (0mm)", "Toleransi Pasar 0.3mm", "Toleransi Pasar 0.5mm", atau custom input diameter aktual hasil ukur jangka sorong.
  - _Output:_ Penyesuaian berat jenis logistik secara riil agar tonase saat ditimbang di toko material tidak tekor atau selisih jauh dengan hitungan teoritis, disertai selisih persentase yang jelas terlihat sebagai peringatan bagi user.

---

### 5. Alur Pengguna (User Flow)

**MVP (Fase 1):**
1. Halaman Utama: user langsung disajikan form kalkulator (tanpa dashboard kompleks dulu).
2. User memilih tipe besi, memasukkan diameter, panjang, jumlah, lalu klik "Hitung".
3. Hasil muncul instan, otomatis masuk sebagai baris baru di tabel rekap, tersimpan di local storage.

**Fase 2 (setelah MVP jalan):**
4. Di dalam input komponen (misal Balok), user bisa mencentang checkbox seperti "Aktifkan Detail Sambungan/Overlap" atau "Gunakan Parameter Besi Toleransi". Angka perhitungan otomatis ter-update secara real-time menggunakan fungsi reaktif (state management).

---

### 6. Persyaratan Non-Fungsional (Technical Requirements)

- **MVP:** cukup berjalan baik di browser desktop dan mobile (responsive), belum wajib PWA/offline. PWA dan mode offline dipertimbangkan setelah MVP tervalidasi, karena berkaitan langsung dengan kebutuhan penyimpanan data (lihat F1.5).
- **Kecepatan Komputasi:** perhitungan algoritma optimasi pemotongan (F2.1) ditargetkan selesai di bawah 2 detik untuk kombinasi input maksimal 50 variasi potongan; target ini berlaku saat F2.1 dikerjakan, bukan di MVP.
- **UI/UX:** desain clean, minimalis, tombol input berukuran besar (mudah ditekan oleh jari pekerja di lapangan proyek yang mungkin kotor/berdebu).
- **Tech Stack:** pilih stack yang paling sudah dikuasai untuk mempercepat penyelesaian MVP, bukan yang paling ingin dipelajari. Jangan mempelajari framework baru bersamaan dengan membangun MVP pertama.
  - _Frontend:_ React.js, Vue.js, Next.js, atau bahkan HTML/JS polos jika itu yang paling dikuasai.
  - _Styling:_ TailwindCSS (opsional, memudahkan layout modular).
  - _Library Optimasi (Fase 2 saja):_ JavaScript murni untuk versi greedy F2.1; WebAssembly/Linear Programming dipertimbangkan hanya jika performa versi greedy terbukti tidak cukup.

---

### 7. Metrik Keberhasilan (Success Metrics)

Dipisah per fase karena sifat fiturnya berbeda (F1 deterministik, F2.1 optimasi).

- **Fase 1 — Akurasi Rumus:** penyimpangan hasil perhitungan F1.1-F1.3 dengan kalkulasi manual/Excel profesional harus 0%, karena ini rumus deterministik dengan satu jawaban benar.
- **Fase 1 — Validasi Penggunaan:** MVP berhasil jika teman di bidang konstruksi benar-benar mencoba menghitung kebutuhan besi untuk pekerjaan nyata menggunakan aplikasi ini, minimal satu kali.
- **Fase 2.1 — Efisiensi Optimasi:** diukur dari persentase waste (sisa besi tidak terpakai) dibanding baseline pemotongan manual/estimasi kasar, bukan deviasi 0% terhadap satu "jawaban manual", karena cutting stock problem punya banyak solusi valid.
- **User Engagement:** pengguna kembali menggunakan aplikasi untuk proyek kedua mereka; metrik ini bergantung pada tersedianya penyimpanan data (F1.5) agar histori proyek tidak hilang antar sesi.

---

### 8. Catatan Prioritas Eksekusi

Urutan kerja yang disepakati:

1. Selesaikan scope Fase 1 (F1.1-F1.5) sampai bisa dibuka di browser dan menghasilkan angka yang benar. Target 1-3 hari kerja.
2. Demokan ke teman di bidang konstruksi, kumpulkan feedback penggunaan nyata sebelum menambah fitur apapun.
3. Baru setelah itu lanjut ke F2.1 versi greedy sederhana sebagai edge case pertama, karena paling relevan dengan metrik waste reduction dan menjadi pembeda utama dari kompetitor.
4. F2.2-F2.5 dikerjakan setelah F2.1 versi awal tervalidasi, sesuai urutan yang tercantum di bagian 4.2.
