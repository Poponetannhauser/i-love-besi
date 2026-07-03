# Task Breakdown: Fase 2 (Edge Cases) - ILoveBesi

Sumber: PRD.md v2.0 + feedback demo Fase 1
Prasyarat: task.md Fase 1 (task 0-7) harus benar-benar selesai, termasuk 7.3 dan 7.4, sebelum mulai bagian ini.

Catatan penting sebelum mulai: prioritas F2.2 di bawah ini didasarkan pada satu feedback dari temanmu soal "besi sambungan". Sebelum lanjut ke task 1 di bawah, pastikan dulu ini kebutuhan nyata yang mendesak, bukan sekadar komentar reflek saat lihat kalkulator. Kalau belum yakin, tanya balik ke temanmu: "itu yang sering kamu hadapi di proyek sekarang, atau cuma kepikiran pas lihat aplikasinya?" Jawaban itu menentukan apakah urutan prioritas di bawah ini benar atau perlu digeser.

- [ ] 0.0 Konfirmasi ke temanmu: apakah kebutuhan sambungan besi ini mendesak/sering terjadi di pekerjaan dia saat ini
- [ ] 0.0.1 Catat jawabannya di sini sebagai bukti keputusan prioritas: __________
- [ ] 0.1 Kumpulkan feedback lain dari demo Fase 1 yang belum tercatat (kalau ada), tulis di sini: __________

---

## 1. F2.2 — Kalkulator Panjang Penyaluran (Lap Splice / Overlap) — Prioritas 1

Konteks: ini muncul langsung dari pertanyaan nyata temanmu, bukan asumsi. Fitur ini menghitung tambahan panjang besi saat dua batang disambung, supaya gaya tarik tetap tersalur dan tidak terputus di titik sambungan.

- [ ] 1.1 Riset/konfirmasi rumus overlap standar SNI: kelipatan diameter (contoh umum 40d untuk kondisi normal, bisa naik ke 50d tergantung mutu beton dan posisi tulangan atas/bawah). Cross-check dengan sumber SNI atau tanya langsung ke temanmu yang lebih paham praktik lapangan.
- [ ] 1.2 Tentukan variabel input yang realistis dipakai user: mutu beton (dropdown: K-250, K-300, fc' 25 MPa, dll), posisi sambungan (tulangan atas/bawah), diameter besi (ambil dari input yang sudah ada di F1.1/F1.2)
- [ ] 1.3 Implementasi rumus penambahan panjang overlap berdasarkan variabel di atas
- [ ] 1.4 Tampilkan hasil overlap dalam satuan cm, terpisah jelas dari panjang batang dasar (supaya user paham ini tambahan, bukan pengganti)
- [ ] 1.5 Integrasikan ke perhitungan total: kalau user centang "aktifkan overlap", total panjang otomatis bertambah dan ikut masuk ke perhitungan berat total di tabel rekap
- [ ] 1.6 Test manual: bandingkan hasil dengan hitungan manual/referensi SNI untuk minimal 3 kombinasi mutu beton dan diameter berbeda
- [ ] 1.7 Demo bagian ini secara spesifik ke temanmu, tanya apakah ini menjawab kebutuhan yang dia maksud waktu itu, atau ternyata ada nuansa lain yang belum tertangkap

Konteks tambahan: task 1.7 penting. Jangan anggap fitur ini "selesai" hanya karena secara teknis rumusnya jalan, sampai temanmu sendiri yang konfirmasi ini memang yang dia maksud.

---

## 2. F2.1 — Algoritma Optimasi Pemotongan (Cutting Stock) — Prioritas 2

- [ ] 2.1 Tentukan input: daftar panjang potongan yang dibutuhkan + jumlahnya masing-masing
- [ ] 2.2 Implementasi algoritma greedy sederhana (bukan versi optimal dulu): urutkan potongan dari terbesar ke terkecil, isi satu batang 12m sampai penuh, lanjut ke batang berikutnya
- [ ] 2.3 Hitung total batang 12m yang perlu dibeli dari hasil algoritma di atas
- [ ] 2.4 Tampilkan skema pemotongan per batang secara visual sederhana (contoh: teks/list "Batang 1: 4.2m + 4.2m + sisa 3.6m")
- [ ] 2.5 Hitung dan tampilkan persentase waste (sisa tidak terpakai / total besi terpakai) sebagai metrik efisiensi
- [ ] 2.6 Test dengan skenario nyata dari temanmu (bukan data dummy) untuk melihat apakah hasilnya masuk akal di praktik
- [ ] 2.7 (Opsional, iterasi lanjutan) evaluasi apakah versi greedy sudah cukup efisien atau perlu ditingkatkan ke pendekatan yang lebih optimal

---

## 3. F2.3 — Kait Begel/Sengkang Tahan Gempa (135 derajat)

- [ ] 3.1 Input: dimensi bersih kolom/balok, ketebalan selimut beton (default 2.5 cm)
- [ ] 3.2 Toggle pilihan: Kait Gempa 135 derajat vs Kait Standar 90 derajat
- [ ] 3.3 Implementasi rumus tambahan panjang kait (6d atau minimal 7.5 cm per ujung, ambil yang lebih besar)
- [ ] 3.4 Hitung total panjang satu begel: keliling area bersih + 2x panjang kait
- [ ] 3.5 Integrasikan ke tabel rekap dan total berat
- [ ] 3.6 Test manual dengan minimal 2 kombinasi dimensi berbeda

---

## 4. F2.4 — Zonasi Sengkang Dinamis (Tumpuan vs Lapangan)

- [ ] 4.1 Input: panjang total balok/kolom, jarak sengkang di area tumpuan, jarak sengkang di area lapangan
- [ ] 4.2 Implementasi pembagian zona: 1/4 panjang (tumpuan kiri), 1/2 panjang (lapangan), 1/4 panjang (tumpuan kanan)
- [ ] 4.3 Hitung jumlah begel per zona berdasarkan jarak yang berbeda
- [ ] 4.4 Jumlahkan total begel keseluruhan dan integrasikan ke tabel rekap
- [ ] 4.5 Test manual dengan minimal 2 kombinasi panjang dan jarak berbeda

---

## 5. F2.5 — Faktor Koreksi Besi Toleransi (Besi Banci)

Konteks: posisikan ini sebagai alat transparansi/proteksi, bukan pembenaran memakai besi di bawah spesifikasi. Ini sudah diputuskan di PRD, jangan berubah framing saat implementasi.

- [ ] 5.1 Dropdown opsi toleransi: Full SNI (0mm), Toleransi Pasar 0.3mm, Toleransi Pasar 0.5mm, atau custom input diameter aktual
- [ ] 5.2 Implementasi penyesuaian rumus berat dengan diameter aktual (bukan diameter nominal label)
- [ ] 5.3 Tampilkan selisih persentase antara berat teoritis (nominal) vs berat riil (aktual), dibuat jelas terlihat sebagai informasi, bukan disembunyikan di angka kecil
- [ ] 5.4 Test manual: bandingkan hasil dengan skenario nyata (misal ukur diameter besi pakai jangka sorong, masukkan, lihat selisihnya)

---

## 6. Rilis & Validasi Fase 2

- [ ] 6.1 Setelah F2.2 selesai (prioritas 1), demo ulang ke temanmu sebelum lanjut ke F2.1 dan seterusnya. Jangan bangun semua fitur F2 sekaligus tanpa jeda validasi.
- [ ] 6.2 Catat fitur mana dari F2.1-F2.5 yang ternyata paling sering dipakai temanmu setelah beberapa kali penggunaan nyata
- [ ] 6.3 Pertimbangkan ulang urutan prioritas F2.3-F2.5 berdasarkan hasil 6.2, jangan kaku ikut urutan di PRD kalau data lapangan bilang lain
