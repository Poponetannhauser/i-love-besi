import { useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function CutListsView({ items }) {
  // Aggregate stats based on items
  const stats = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const optData = optimizeCuttingStock(items);
    
    // Unique diameters list
    const diameters = items.length > 0 
      ? Array.from(new Set(items.map(item => `D${item.diameter}`))).join(', ') 
      : 'D25';

    return {
      totalRebars: items.length > 0 ? `${totalQty} Units` : '48 Units',
      yieldVal: items.length > 0 ? `${optData.efficiency}%` : '94.2%',
      steelGrade: 'SD400',
      diameter: diameters
    };
  }, [items]);

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

      {/* Pattern 1 Card Box */}
      <div className="pattern-card-box">
        <div className="pattern-card-header">
          <div className="pattern-card-title">
            <span className="pattern-number-badge">1</span>
            <h3>PATTERN ALPHA</h3>
          </div>
          <span className="pattern-quantity-pill">x 12 REBARS</span>
        </div>

        {/* Visual Bar */}
        <div className="visual-pattern-bar-large">
          <div className="pattern-segment piece-1" style={{ width: '43.3%' }}>
            5200 <sub style={{ fontSize: '0.65rem' }}>PC-01</sub>
          </div>
          <div className="pattern-segment piece-2" style={{ width: '31.7%' }}>
            3800 <sub style={{ fontSize: '0.65rem' }}>PC-04</sub>
          </div>
          <div className="pattern-segment piece-3" style={{ width: '20.8%' }}>
            2500 <sub style={{ fontSize: '0.65rem' }}>PC-09</sub>
          </div>
          <div className="pattern-segment scrap" style={{ width: '4.2%' }}>
            <span style={{ fontSize: '0.7rem' }}>WASTE</span>
          </div>
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
              <tr>
                <td>01</td>
                <td style={{ color: '#854d0e' }}>5.200</td>
                <td><span className="part-id-badge">PC-01</span></td>
                <td>FOUNDATION - GRID A1</td>
              </tr>
              <tr>
                <td>02</td>
                <td style={{ color: '#854d0e' }}>3.800</td>
                <td><span className="part-id-badge blue">PC-04</span></td>
                <td>COLUMN - L1-4</td>
              </tr>
              <tr>
                <td>03</td>
                <td style={{ color: '#854d0e' }}>2.500</td>
                <td><span className="part-id-badge gray">PC-09</span></td>
                <td>STAIRWELL - REINF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pattern 2 Card Box */}
      <div className="pattern-card-box">
        <div className="pattern-card-header">
          <div className="pattern-card-title">
            <span className="pattern-number-badge">2</span>
            <h3>PATTERN BRAVO</h3>
          </div>
          <span className="pattern-quantity-pill">x 36 REBARS</span>
        </div>

        {/* Visual Bar */}
        <div className="visual-pattern-bar-large">
          <div className="pattern-segment piece-1" style={{ width: '33.3%' }}>
            4000 <sub style={{ fontSize: '0.65rem' }}>PC-02</sub>
          </div>
          <div className="pattern-segment piece-1" style={{ width: '33.3%', position: 'relative' }}>
            4000 <sub style={{ fontSize: '0.65rem' }}>PC-02</sub>
            <span style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '0.55rem', backgroundColor: 'black', color: 'var(--yellow)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontStyle: 'italic', fontWeight: '800' }}>
              ZERO WASTE PATTERN
            </span>
          </div>
          <div className="pattern-segment piece-1" style={{ width: '33.4%' }}>
            4000 <sub style={{ fontSize: '0.65rem' }}>PC-02</sub>
          </div>
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
              <tr>
                <td>01-03</td>
                <td style={{ color: '#854d0e' }}>4.000 (x3)</td>
                <td><span className="part-id-badge">PC-02</span></td>
                <td>SLAB REINFORCEMENT - ZONE B</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
              {/* QR visual placeholder */}
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
