export default function RecapTable({ items, onDelete, onClearAll }) {
  // Calculate running totals
  const totalKg = items.reduce((acc, item) => acc + item.weightKg, 0);
  const totalTon = totalKg / 1000;

  const handleClearConfirm = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua data rekapitulasi?')) {
      onClearAll();
    }
  };

  return (
    <div className="card table-card">
      <div className="table-header">
        <h2 className="card-title">Tabel Rekapitulasi (BBS)</h2>
        {items.length > 0 && (
          <button className="btn btn-danger-outline btn-sm" onClick={handleClearConfirm}>
            Hapus Semua Data
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p>Belum ada data kalkulasi. Silakan masukkan data pada form di atas.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="recap-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Elemen</th>
                <th>Tipe</th>
                <th>Diameter</th>
                <th>Panjang (m)</th>
                <th>Jumlah</th>
                <th>Berat (Kg)</th>
                <th>Berat (Ton)</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="font-semibold">{item.elementName}</td>
                  <td>
                    <span className={`badge ${item.steelType === 'BjTP' ? 'badge-polos' : 'badge-ulir'}`}>
                      {item.steelType === 'BjTP' ? 'Polos (BjTP)' : 'Ulir (BjTS)'}
                    </span>
                  </td>
                  <td>{item.diameter} mm</td>
                  <td>{item.length} m</td>
                  <td>{item.quantity}</td>
                  <td>{item.weightKg.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Kg</td>
                  <td>{item.weightTon.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} Ton</td>
                  <td className="text-center">
                    <button
                      className="btn-icon-delete"
                      title="Hapus baris"
                      onClick={() => onDelete(item.id)}
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" className="text-right font-bold">TOTAL BERAT:</td>
                <td className="font-bold text-accent">
                  {totalKg.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Kg
                </td>
                <td className="font-bold text-accent">
                  {totalTon.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} Ton
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
