di ProjectsView:

- tambah proyek baru masih berupa input popup default.
-Titik tiga di tiap project belum bisa di klik

Di halaman inputsview:
- buatlah fungsi listener (onChange) pada setiap kotak input sengkang di atas.

- Begitu user selesai mengetik angka 5 di kolom Jumlah Balok, fungsi tersebut langsung memicu rumus matematika di latar belakang, lalu di sebelah kanan layar (jika di laptop) atau di bawah layar (jika di HP) langsung keluar teks besar berbunyi: "Total Kebutuhan: 135 Pcs Begel (55.99 kg) Besi Polos 8mm".

- Sengkang atau begel itu kan besi yang ditekuk melingkar sampai ujungnya saling bertemu dan mengunci di dalam beton. Karena ada dua ujung besi yang bertemu, maka kaitnya wajib ada 2 buah (di ujung awal dan ujung akhir tekukan).
Jadi, rumus yang benar di kode frontend lu nanti harusnya seperti ini:
Panjang 1 Begel = Keliling Kotak + (2 $\times$ Panjang Kait)
Panjang 1 Begel = $100\text{ cm} + (2 \times 7.5\text{ cm}) = \mathbf{115\text{ cm (1.15 meter)}}$

Hasil Akhir yang TepatJika panjang 1 begel yang benar adalah 1.15 meter, maka total kebutuhan besi ø8 untuk proyek 5 balok itu adalah:
Total Panjang: $135\text{ pcs} \times 1.15\text{ m} = \mathbf{155.25\text{ meter}}$
Total Berat Jenis: $155.25\text{ m} \times 0.395\text{ kg/m} = \mathbf{61.32\text{ kg}}$

Jadi, di bagian fungsi matematika aplikasi lu, pastikan variabel panjang_kait selalu dikalikan 2 (panjang_kait * 2) sebelum dijumlahkan dengan keliling bersih betonnya.