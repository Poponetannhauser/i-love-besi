import { useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function InventoryView({ items }) {
  // Dynamic aggregations
  const stats = useMemo(() => {
    const totalKg = items.reduce((acc, item) => acc + item.weightKg, 0);
    const totalTonVal = totalKg / 1000;
    
    const optData = optimizeCuttingStock(items);
    const activeCutListsCount = new Set(items.map(item => item.elementName)).size;

    return {
      totalWeightTon: items.length > 0 ? totalTonVal.toFixed(2) : '0.00',
      stockStatus: items.length > 0 ? 'Nominal: OK' : '—',
      stockStatusSub: items.length > 0 ? 'All levels stable' : 'No rebar stock recorded',
      optRate: items.length > 0 ? `${optData.efficiency}%` : '0.0%',
      optRateSub: items.length > 0 ? `Waste: ${optData.waste}%` : 'Waste: 0.0%',
      activeCutLists: items.length > 0 ? activeCutListsCount : 0
    };
  }, [items]);

  // Master Ledger grouping (by diameter + steelType)
  const ledgerRows = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    const grouped = {};
    items.forEach(item => {
      const diaKey = `${item.diameter}-${item.steelType}`;
      if (!grouped[diaKey]) {
        grouped[diaKey] = {
          dia: `D${item.diameter}`,
          grade: item.steelType === 'BjTP' ? 'BjTP 280 (Polos)' : 'BjTS 420 (Ulir)',
          length: 12.00,
          qty: 0,
          unitWeight: 0.006165 * Math.pow(item.diameter, 2),
          weight: 0,
          weightNominal: 0
        };
      }
      grouped[diaKey].qty += item.quantity;
      grouped[diaKey].weight += item.weightKg;
      grouped[diaKey].weightNominal += (item.weightNominalKg || item.weightKg);
    });

    return Object.values(grouped).map(row => ({
      ...row,
      unitWeight: Number(row.unitWeight.toFixed(3)),
      weight: Number(row.weight.toFixed(2)),
      weightNominal: Number(row.weightNominal.toFixed(2)),
      status: 'RECORDED'
    }));
  }, [items]);

  const totalLedgerWeight = useMemo(() => {
    const total = ledgerRows.reduce((sum, row) => sum + row.weight, 0);
    const nominalTotal = ledgerRows.reduce((sum, row) => sum + row.weightNominal, 0);
    return {
      actual: total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      nominal: nominalTotal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  }, [ledgerRows]);

  return (
    <div className="dashboard-view">
      {/* Top Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span>TOTAL WEIGHT (MT)</span>
          </div>
          <div className="stat-value">{stats.totalWeightTon}</div>
          <div className="stat-desc" style={{ color: '#10b981', fontWeight: '800' }}>
            {items.length > 0 ? `${items.length} entri ↑` : '0 entri'} <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>tercatat di proyek ini</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span>STOCK STATUS</span>
          </div>
          <div className="stat-value">{stats.stockStatus}</div>
          <div className="stat-desc">{stats.stockStatusSub}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span>OPTIMIZATION RATE</span>
          </div>
          <div className="stat-value">{stats.optRate}</div>
          <div className="stat-desc">{stats.optRateSub}</div>
        </div>

        <div className="stat-card accent-yellow">
          <div className="stat-card-header" style={{ color: 'var(--text-dark)' }}>
            <span>ACTIVE CUT LISTS</span>
          </div>
          <div className="stat-value">{stats.activeCutLists}</div>
          <div className="stat-desc">Next delivery: —</div>
        </div>
      </div>

      {/* Master Rebar Ledger Panel */}
      <div className="panel" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>MASTER REBAR LEDGER</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-outline-support" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Export CSV</button>
            <button className="btn-rounded-yellow" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Print Report</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="recap-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>DIA (MM)</th>
                <th>GRADE</th>
                <th>LENGTH (M)</th>
                <th>QUANTITY (PCS)</th>
                <th>UNIT WEIGHT (KG/M)</th>
                <th>BERAT NOMINAL (KG)</th>
                <th>BERAT AKTUAL (KG)</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {ledgerRows.length > 0 ? (
                ledgerRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-bold">{row.dia}</td>
                    <td>{row.grade}</td>
                    <td>{row.length.toFixed(2)}</td>
                    <td>{row.qty.toLocaleString('id-ID')}</td>
                    <td>{row.unitWeight}</td>
                    <td>{row.weightNominal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg</td>
                    <td className="font-bold">{row.weight.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg</td>
                    <td>
                      <span className={`badge ${
                        row.status === 'RECORDED' ? 'badge-instock' :
                        row.status === 'IN STOCK' ? 'badge-instock' :
                        row.status === 'LOW STOCK' ? 'badge-lowstock' : 'badge-ordered'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', cursor: 'pointer', color: 'var(--text-light)' }}>
                      &#8942;
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center" style={{ color: 'var(--text-light)', padding: '3rem 1rem' }}>
                    Belum ada data ledger. Silakan tambahkan data potongan di menu Inputs terlebih dahulu.
                  </td>
                </tr>
              )}
            </tbody>
            {ledgerRows.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-right font-bold" style={{ backgroundColor: '#f9fafb' }}>TOTAL NET WEIGHT (NOMINAL vs AKTUAL):</td>
                  <td colSpan="4" className="font-bold text-accent" style={{ backgroundColor: '#f9fafb', fontSize: '1.1rem' }}>
                    {totalLedgerWeight.nominal} kg (Nominal) / {totalLedgerWeight.actual} kg (Aktual)
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Bottom info section */}
      <div className="dashboard-bottom-grid">
        <div className="panel">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem' }}>WEIGHT DISTRIBUTION BY DIAMETER</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.length > 0 ? (
              Object.keys(items.reduce((acc, item) => {
                acc[item.diameter] = (acc[item.diameter] || 0) + item.weightKg;
                return acc;
              }, {})).map(dia => {
                const weight = items.filter(i => i.diameter === Number(dia)).reduce((sum, i) => sum + i.weightKg, 0);
                const totalWeight = items.reduce((sum, i) => sum + i.weightKg, 0);
                const pct = ((weight / totalWeight) * 100).toFixed(0);
                return (
                  <div key={dia}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      <span>D{dia}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${pct}%` }}></div></div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Belum ada distribusi diameter.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem' }}>RECENT MOVEMENTS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
            {items.length > 0 ? (
              items.slice(-2).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                  <span>Dispatched: {item.elementName} D{item.diameter} ({item.quantity} pcs)</span>
                  <span style={{ color: 'var(--text-light)' }}>Baru saja</span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Belum ada log pergerakan stok.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
