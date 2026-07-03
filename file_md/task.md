# Task Breakdown: ILoveBesi (Kalkulator Besi Beton Konstruksi)

Sumber: PRD.md v2.0
Fokus eksekusi: Fase 1 (MVP) dulu, sampai selesai dan diuji ke teman. Fase 2 dicatat sebagai backlog, jangan dikerjakan sebelum Fase 1 tuntas.

Target: 1-3 hari kerja untuk seluruh checklist Fase 1 di bawah.

---

## 0. Setup Proyek

- [x] 0.1 Tentukan stack final (bukan yang paling ingin dipelajari, yang paling cepat dikuasai). Tulis keputusannya di sini: React + Vite
- [x] 0.2 Inisialisasi project (create-react-app/Vite, atau cukup 1 file index.html + script.js kalau pakai vanilla JS)
- [x] 0.3 Setup struktur folder minimal: `index.html`, `style.css` (atau Tailwind kalau dipakai), `app.js`/`main.jsx`
- [x] 0.4 Pastikan project bisa dijalankan lokal dan dibuka di browser (localhost atau file langsung)
- [x] 0.5 Setup local storage helper (fungsi kecil untuk `save()`, `load()`, `clear()` data tabel) — dipakai nanti di task 4

Konteks: jangan lompat ke styling/animasi di tahap ini. Tujuan task 0 cuma "kerangka kosong bisa dibuka di browser".

---

## 1. F1.1 — Kalkulator Berat Jenis Standar

- [x] 1.1 Buat form input: Diameter (angka), Panjang Batang (angka, default 12), Jumlah Batang (angka)
- [x] 1.2 Implementasi rumus: `W = 0.006165 * d^2 * L * N`
- [x] 1.3 Tampilkan output: Berat Total dalam Kg, dan konversi ke Ton (Kg / 1000)
- [x] 1.4 Tombol "Hitung" memicu kalkulasi dan menampilkan hasil di layar (belum masuk tabel dulu, itu task 3)
- [x] 1.5 Test manual: cocokkan hasil dengan hitungan Excel/kalkulator biasa untuk minimal 3 kombinasi angka berbeda (ini yang jadi metrik akurasi 0% di PRD bagian 7)

Konteks: ini inti aplikasi. Kalau task 1 belum akurat 100%, jangan lanjut ke task berikutnya.

---

## 2. F1.2 — Pemilihan Tipe Besi

- [x] 2.1 Tambah dropdown Tipe Besi: "Besi Polos (BjTP)" dan "Besi Sirip/Ulir (BjTS)"
- [x] 2.2 Tambah dropdown/select Diameter dengan opsi standar: 6, 8, 10, 12, 13, 16, 19, 22, 25 mm (plus opsi input manual kalau ukurannya di luar daftar)
- [x] 2.3 Pastikan pilihan tipe besi tersimpan sebagai metadata di baris tabel nanti (belum memengaruhi rumus, sesuai catatan PRD F1.2)

Konteks: task ini murni UI/data tambahan, tidak ada logika hitung baru.

---

## 3. F1.3 — Tabel Rekapitulasi

- [x] 3.1 Tambah input "Keterangan/Nama Elemen" (contoh: K1, B1) di form
- [x] 3.2 Saat tombol "Hitung" ditekan, hasil kalkulasi (bukan cuma ditampilkan) juga ditambahkan sebagai baris baru ke tabel
- [x] 3.3 Kolom tabel minimal: Keterangan, Tipe Besi, Diameter, Panjang, Jumlah Batang, Berat (Kg)
- [x] 3.4 Hitung dan tampilkan total berat kumulatif dari seluruh baris di bagian bawah tabel
- [x] 3.5 Tambah tombol hapus per baris (kecil tapi penting, supaya user bisa koreksi kalau salah input)

Konteks: ekspor CSV sengaja tidak masuk sini, sudah diputuskan ditunda di luar MVP. Jangan tergoda menambahkannya sekarang.

---

## 4. F1.4 — Validasi Input

- [x] 4.1 Validasi: diameter harus > 0
- [x] 4.2 Validasi: panjang batang harus > 0
- [x] 4.3 Validasi: jumlah batang harus bilangan bulat positif (bukan 0, bukan desimal, bukan negatif)
- [x] 4.4 Kalau input tidak valid, tombol "Hitung" tidak menjalankan kalkulasi dan menampilkan pesan error yang jelas (bukan cuma diam atau NaN muncul di layar)
- [x] 4.5 Test manual: coba input 0, negatif, huruf, kosong — pastikan semua tertangkap validasi

Konteks: ini yang paling sering dilewatkan orang saat buru-buru bikin MVP. Jangan skip, ini yang membedakan "kalkulator jalan" dengan "kalkulator jalan tapi gampang jebol".

---

## 5. F1.5 — Penyimpanan Data Lokal

- [x] 5.1 Setiap kali baris baru ditambahkan ke tabel, simpan seluruh data tabel ke local storage
- [x] 5.2 Saat aplikasi dibuka ulang, load data dari local storage dan tampilkan kembali di tabel (bukan mulai dari kosong)
- [x] 5.3 Tambah tombol "Reset/Hapus Semua Data" untuk mulai proyek baru
- [x] 5.4 Test: isi beberapa baris, refresh browser, pastikan data masih ada

Konteks: ini fondasi metrik retensi yang disebut di PRD. Tanpa ini, setiap user buka ulang aplikasi, kerja mereka hilang.

---

## 6. Polish Minimal & Validasi Akhir MVP

- [x] 6.1 Pastikan tombol input cukup besar untuk disentuh jari di layar HP (sesuai catatan UX di PRD)
- [x] 6.2 Cek tampilan responsif minimal di HP (tidak perlu sempurna, cukup tidak berantakan)
- [x] 6.3 Baca ulang seluruh flow dari awal sebagai user baru: buka app, isi form, hitung, lihat tabel, refresh, data masih ada
- [x] 6.4 Perbaiki bug/typo yang ditemukan di 6.3
- [x] 6.5 STOP di sini. Jangan tambah fitur baru. Lanjut ke task 7.

---

## 7. Demo & Validasi Nyata

- [ ] 7.1 Kirim/tunjukkan aplikasi ke teman yang kerja di konstruksi
- [ ] 7.2 Minta dia coba hitung kebutuhan besi untuk pekerjaan nyata yang sedang dia kerjakan (bukan sekadar dicoba iseng)
- [ ] 7.3 Catat feedback: bagian mana yang membingungkan, fitur apa yang langsung dia cari tapi belum ada
- [ ] 7.4 Putuskan berdasarkan feedback ini, bukan asumsi sendiri, apakah F2.1 (optimasi pemotongan) memang prioritas berikutnya yang tepat

Konteks: ini langkah yang paling gampang dilewati karena tergoda langsung lanjut coding fitur baru. Jangan lewati, ini validasi murah yang PRD kamu sendiri jadikan metrik sukses Fase 1.

---

## Backlog Fase 2 (jangan dikerjakan sebelum task 7 selesai)

- [ ] F2.1 — Algoritma cutting stock versi greedy/First-Fit-Decreasing
- [ ] F2.2 — Kalkulator panjang penyaluran (lap splice)
- [ ] F2.3 — Kait begel tahan gempa (135 derajat)
- [ ] F2.4 — Zonasi sengkang dinamis (tumpuan vs lapangan)
- [ ] F2.5 — Faktor koreksi besi toleransi (besi banci), reframe sebagai alat transparansi

Ekspor CSV, PWA/offline, dan akun/cloud sync juga masuk backlog ini, ditinjau ulang setelah Fase 1 tervalidasi.
