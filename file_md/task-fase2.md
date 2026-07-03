# Task Breakdown: Fase 2 (Edge Cases) - ILoveBesi

Sumber: PRD.md v2.0 + feedback demo Fase 1

---

## 1. F2.2 — Kalkulator Panjang Penyaluran (Lap Splice / Overlap) — Prioritas 1

- [x] 1.1 Riset/konfirmasi rumus overlap standar SNI: kelipatan diameter (40d untuk kondisi normal, 50d untuk tulangan atas/tarik tinggi).
- [x] 1.2 Tentukan variabel input yang realistis dipakai user: checkbox overlap, opsi dropdown (40d, 50d, custom factor), input custom factor.
- [x] 1.3 Implementasi rumus penambahan panjang overlap berdasarkan diameter nominal.
- [x] 1.4 Tampilkan hasil overlap dalam satuan meter, terpisah jelas pada live preview banner.
- [x] 1.5 Integrasikan ke perhitungan total: total panjang otomatis bertambah dan masuk ke recapList.
- [x] 1.6 Test manual: divalidasi dengan pos uji 1 & 2 di implementation_plan.md.
- [x] 1.7 Dokumentasikan hasil implementasi dan bagikan ke user.

---

## 2. F2.1 — Algoritma Optimasi Pemotongan (Cutting Stock) — Prioritas 2

- [x] 2.1 Tentukan input: daftar panjang potongan yang dibutuhkan + jumlahnya masing-masing.
- [x] 2.2 Implementasi algoritma greedy FFD: urutkan potongan dari terbesar ke terkecil, isi satu batang 12m sampai penuh.
- [x] 2.3 Hitung total batang 12m yang perlu dibeli dari hasil FFD.
- [x] 2.4 Tampilkan skema pemotongan per batang secara visual (Visual Pattern Bar di InputsView & CutListsView).
- [x] 2.5 Hitung dan tampilkan persentase waste (sisa tidak terpakai / total besi terpakai) sebagai metrik efisiensi.
- [x] 2.6 Test dengan skenario nyata.
- [x] 2.7 Evaluasi efisiensi algoritma FFD.

---

## 3. F2.3 — Kait Begel/Sengkang Tahan Gempa (135 derajat)

- [x] 3.1 Input: dimensi bersih kolom/balok, ketebalan selimut beton (default 2.5 cm).
- [x] 3.2 Toggle pilihan: Kait sengkang standar 135 derajat.
- [x] 3.3 Implementasi rumus tambahan panjang kait (2x hook).
- [x] 3.4 Hitung total panjang satu begel: keliling area bersih + 2x panjang kait.
- [x] 3.5 Integrasikan ke tabel rekap dan total berat.
- [x] 3.6 Test manual dengan kombinasi dimensi berbeda.

---

## 4. F2.4 — Zonasi Sengkang Dinamis (Tumpuan vs Lapangan)

- [x] 4.1 Input: panjang total balok/kolom, jarak sengkang di area tumpuan, jarak sengkang di area lapangan.
- [x] 4.2 Implementasi pembagian zona dan perhitungan jumlah begel otomatis.
- [x] 4.3 Hitung jumlah begel per zona berdasarkan jarak yang berbeda.
- [x] 4.4 Jumlahkan total begel keseluruhan dan integrasikan ke tabel rekap.
- [x] 4.5 Test manual dengan kombinasi panjang dan jarak berbeda.

---

## 5. F2.5 — Faktor Koreksi Besi Toleransi (Besi Banci)

- [x] 5.1 Dropdown opsi toleransi: 0.3mm, 0.5mm, atau custom diameter aktual.
- [x] 5.2 Implementasi penyesuaian rumus berat dengan diameter aktual (bukan nominal).
- [x] 5.3 Tampilkan selisih persentase penyusutan antara berat nominal vs berat riil pada live preview.
- [x] 5.4 Test manual: dibandingkan dengan parameter pos uji 3 & 4.

---

## 6. Rilis & Validasi Fase 2

- [x] 6.1 Setelah F2.2 selesai (prioritas 1), demo ulang ke temanmu sebelum lanjut ke F2.1 dan seterusnya.
- [x] 6.2 Catat fitur mana dari F2.1-F2.5 yang ternyata paling sering dipakai temanmu setelah beberapa kali penggunaan nyata.
- [x] 6.3 Pertimbangkan ulang urutan prioritas F2.3-F2.5 berdasarkan hasil 6.2.
