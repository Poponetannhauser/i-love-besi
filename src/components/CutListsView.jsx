import { useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function CutListsView({ items }) {
  // Return empty state if there are no items
  if (!items || items.length === 0) {
    return (
      <div className="panel empty-view-panel">
        <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Instruksi Pemotongan Lapangan</h2>
        <p>Belum ada instruksi pemotongan yang dapat dirender. Silakan tambahkan data potongan di menu Inputs terlebih dahulu.</p>
      </div>
    );
  }

  // Group and FFD pack to get visual patterns
  const optData = useMemo(() => {
    const STOCK_LIMIT = 12.0;
    const groups = {};
    items.forEach(item => {
      const key = `${item.diameter}-${item.steelType}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    const patterns = [];
    let barsNeededCount = 0;

    Object.keys(groups).forEach(key => {
      const groupItems = groups[key];
      const pieces = [];
      groupItems.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          pieces.push({
            id: item.id,
            length: Number(item.length),
            diameter: item.diameter,
            steelType: item.steelType,
            elementName: item.elementName
          });
        }
      });

      pieces.sort((a, b) => b.length - a.length);

      const bins = [];
      pieces.forEach(piece => {
        let fitted = false;
        for (let i = 0; i < bins.length; i++) {
          const currentBinSum = bins[i].reduce((sum, p) => sum + p.length, 0);
          if (STOCK_LIMIT - currentBinSum >= piece.length) {
            bins[i].push(piece);
            fitted = true;
            break;
          }
        }
        if (!fitted) {
          bins.push([piece]);
        }
      });

      barsNeededCount += bins.length;

      const patternSummary = {};
      bins.forEach(bin => {
        const key = bin.map(p => p.length).join(',');
        if (!patternSummary[key]) {
          patternSummary[key] = {
            pieces: bin,
            count: 0
          };
        }
        patternSummary[key].count++;
      });

      Object.keys(patternSummary).forEach(patternKey => {
        patterns.push({
          key: patternKey,
          pieces: patternSummary[patternKey].pieces,
          count: patternSummary[patternKey].count,
          diameter: groupItems[0].diameter,
          steelType: groupItems[0].steelType
        });
      });
    });

    const totalCutLength = items.reduce((sum, item) => sum + (Number(item.length) * item.quantity), 0);
    const totalPurchased = barsNeededCount * STOCK_LIMIT;
    const efficiency = totalPurchased > 0 ? (totalCutLength / totalPurchased) * 100 : 0;

    return {
      barsNeeded: barsNeededCount,
      efficiency: Number(efficiency.toFixed(1)),
      patterns
    };
  }, [items]);

  const stats = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const diameters = Array.from(new Set(items.map(item => `D${item.diameter}`))).join(', ');

    return {
      totalRebars: `${totalQty} Units`,
      yieldVal: `${optData.efficiency}%`,
      steelGrade: 'SD420',
      diameter: diameters
    };
  }, [items, optData]);

  return (
    <div className="cut-lists-view">
      {/* Header Info Section */}
      <div className="cutlists-header-bar">
        <div>
          <span className="subtitle" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            JOB #402-B | 12 METER STANDARD STOCK
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary" style={{ textTransform: 'uppercase' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            PRINT INSTRUCTIONS
          </button>
          <div className="batch-card-badge" style={{ padding: '0.5rem 1rem', minWidth: 'auto' }}>
            BATCH: 08-A
          </div>
        </div>
      </div>

      {/* Top 4 Cards Row */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-header"><span>TOTAL REBAR</span></div>
          <div className="stat-value">{stats.totalRebars}</div>
        </div>
        <div className="stat-card accent-yellow">
          <div className="stat-card-header" style={{ color: 'var(--text-dark)' }}><span>YIELD</span></div>
          <div className="stat-value">{stats.yieldVal}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>STEEL GRADE</span></div>
          <div className="stat-value">{stats.steelGrade}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><span>DIAMETER</span></div>
          <div className="stat-value" style={{ fontSize: '2rem', padding: '0.5rem 0' }}>{stats.diameter}</div>
        </div>
      </div>

      {/* Dynamically Render Patterns */}
      {optData.patterns.map((p, idx) => {
        const charCode = String.fromCharCode(65 + idx); // A, B, C...
        const totalPieceLength = p.pieces.reduce((sum, item) => sum + item.length, 0);
        const scrapLength = Number((12.0 - totalPieceLength).toFixed(2));

        return (
          <div key={p.key} className="pattern-card-box">
            <div className="pattern-card-header">
              <div className="pattern-card-title">
                <span className="pattern-number-badge">{idx + 1}</span>
                <h3>PATTERN {p.diameter === 25 ? 'ALPHA' : `GROUP ${charCode}`}</h3>
              </div>
              <span className="pattern-quantity-pill">x {p.count} REBARS</span>
            </div>

            {/* Visual Bar */}
            <div className="visual-pattern-bar-large">
              {p.pieces.map((piece, pIdx) => {
                const widthPct = (piece.length / 12.0) * 100;
                const pieceClasses = ['piece-1', 'piece-2', 'piece-3'];
                const classToUse = pieceClasses[pIdx % pieceClasses.length];
                return (
                  <div key={pIdx} className={`pattern-segment ${classToUse}`} style={{ width: `${widthPct}%` }}>
                    {piece.length * 1000} <sub style={{ fontSize: '0.65rem' }}>PC-0{pIdx + 1}</sub>
                  </div>
                );
              })}
              {scrapLength > 0 && (
                <div className="pattern-segment scrap" style={{ width: `${(scrapLength / 12.0) * 100}%` }}>
                  <span style={{ fontSize: '0.7rem' }}>WASTE</span>
                </div>
              )}
            </div>

            {/* Instructions Table */}
            <div className="table-responsive">
              <table className="instructions-table">
                <thead>
                  <tr>
                    <th>CUT ORDER</th>
                    <th>LENGTH (MM)</th>
                    <th>PART ID</th>
                    <th>DESTINATION</th>
                  </tr>
                </thead>
                <tbody>
                  {p.pieces.map((piece, pIdx) => {
                    const badgeClasses = ['', 'blue', 'gray'];
                    const badgeClass = badgeClasses[pIdx % badgeClasses.length];
                    return (
                      <tr key={pIdx}>
                        <td>0{pIdx + 1}</td>
                        <td style={{ color: '#854d0e' }}>{(piece.length * 1000).toLocaleString('id-ID')}</td>
                        <td><span className={`part-id-badge ${badgeClass}`}>PC-0{pIdx + 1}</span></td>
                        <td>{piece.elementName.toUpperCase()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Bottom Notes Section */}
      <div className="card">
        <div className="field-notes-layout">
          <div className="field-notes-list">
            <h3>CATATAN PENTING / FIELD NOTES:</h3>
            <div className="field-notes-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <p>Gunakan kapur kuning untuk menandai titik potong sesuai diagram.</p>
            </div>
            <div className="field-notes-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <p>Pastikan pisau pemotong (Cutter) dalam kondisi tajam untuk presisi.</p>
            </div>
            <div className="field-notes-item">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <p>Pisahkan sisa (Waste) ke dalam keranjang besi khusus untuk didaur ulang.</p>
            </div>
          </div>
          <div className="qr-code-box">
            <div className="qr-code-placeholder">
              <div style={{ border: '2px solid black', width: '80px', height: '80px', padding: '2px', display: 'flex', flexWrap: 'wrap' }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ width: '18px', height: '18px', backgroundColor: (i * 7 + 11) % 2 === 0 ? 'black' : 'transparent' }}></div>
                ))}
              </div>
            </div>
            <button className="btn-qr-scan">SCAN FOR 3D BENDING</button>
          </div>
        </div>
      </div>
    </div>
  );
}
