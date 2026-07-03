import { useState, useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

const STANDARD_DIAMETERS = [6, 8, 10, 12, 13, 16, 19, 22, 25];

export default function InputsView({ items, onAddRow, onDeleteRow, onClearAll }) {
  const [elementName, setElementName] = useState('');
  const [steelType, setSteelType] = useState('BjTS'); // Default Ulir to match mock
  const [diameter, setDiameter] = useState('10');
  const [stockLength, setStockLength] = useState('12.00');
  const [cutLength, setCutLength] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  // Calculate optimization patterns dynamically based on items
  const optData = useMemo(() => {
    if (!items || items.length === 0) {
      return { barsNeeded: 0, efficiency: 0, waste: 0, patterns: [] };
    }

    const STOCK_LIMIT = 12.0;
    
    // Group and FFD pack to get visual patterns
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

      // Sort descending
      pieces.sort((a, b) => b.length - a.length);

      // FFD packing
      const bins = []; // Each bin represents a stock bar containing an array of pieces
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

      // Group identical patterns for visual summary
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
      waste: Number((100 - efficiency).toFixed(1)),
      patterns
    };
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    const nameToUse = elementName.trim() || `Rebar D${diameter}`;
    const d = Number(diameter);
    const L = Number(cutLength);
    const N = Number(quantity);

    if (!d || d <= 0 || isNaN(d)) {
      setError('Diameter harus berupa angka positif.');
      return;
    }
    if (!L || L <= 0 || isNaN(L)) {
      setError('Panjang potongan harus berupa angka positif.');
      return;
    }
    const qtyStr = String(quantity).trim();
    if (qtyStr.includes('.') || qtyStr.includes(',') || !Number.isInteger(N) || N <= 0) {
      setError('Jumlah potongan harus berupa bilangan bulat positif.');
      return;
    }

    onAddRow({
      elementName: nameToUse,
      steelType,
      diameter: d,
      length: L,
      quantity: N
    });

    // Reset input fields
    setElementName('');
    setCutLength('');
    setQuantity('');
  };

  // Apply Quick Presets
  const applyPreset = (diaVal, lengthVal) => {
    setElementName(`Kolom D${diaVal}`);
    setDiameter(String(diaVal));
    setCutLength(String(lengthVal));
    setQuantity('100');
  };

  return (
    <div className="inputs-layout-grid">
      {/* Left Column: Form & Presets */}
      <div className="form-inputs-container">
        <div className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>&oplus;</span> DATA POTONGAN
          </h3>

          {error && (
            <div className="error-alert">
              <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="elementName">Nama Elemen / Deskripsi (Opsional)</label>
              <input
                id="elementName"
                type="text"
                placeholder="Contoh: Balok B1, Kolom K1"
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="diameter">Diameter (mm)</label>
              <select
                id="diameter"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              >
                {STANDARD_DIAMETERS.map(d => (
                  <option key={d} value={d}>{d} mm</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stockLength">Stock (m)</label>
              <input
                id="stockLength"
                type="text"
                disabled
                value={stockLength}
                onChange={(e) => setStockLength(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="cutLength">Panjang Potongan (m)</label>
              <input
                id="cutLength"
                type="number"
                step="any"
                placeholder="Contoh: 3.50"
                value={cutLength}
                onChange={(e) => setCutLength(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="quantity">Jumlah Potongan (pcs)</label>
              <input
                id="quantity"
                type="number"
                placeholder="Contoh: 150"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '0.5rem' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              HITUNG & TAMBAH
            </button>
          </form>
        </div>

        <div className="card">
          <h4 style={{ fontWeight: '700', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Presets Cepat:</h4>
          <div className="preset-badge-group">
            <button className="preset-badge" onClick={() => applyPreset(10, 2.5)}>D10 - 2.5M</button>
            <button className="preset-badge" onClick={() => applyPreset(13, 4.0)}>D13 - 4.0M</button>
            <button className="preset-badge" onClick={() => applyPreset(16, 3.2)}>D16 - 3.2M</button>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Patterns & Recap Table */}
      <div className="form-inputs-container">
        <div className="card">
          <div className="panel-header" style={{ margin: 0, border: 'none', padding: 0, paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>SKEMA PEMOTONGAN (STOCK 12M)</h3>
            {items.length > 0 && (
              <span style={{ backgroundColor: '#111827', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>
                EFISIENSI: {optData.efficiency}%
              </span>
            )}
          </div>

          <div className="pattern-visualization-list">
            {optData.patterns.length > 0 ? (
              optData.patterns.map((p, pIdx) => {
                const totalPieceLength = p.pieces.reduce((sum, item) => sum + item.length, 0);
                const scrapLength = Number((12.0 - totalPieceLength).toFixed(2));
                return (
                  <div key={p.key} className="pattern-row-visual">
                    <div className="pattern-row-header">
                      <span>POLA {pIdx + 1} (x{p.count} batang stock - D{p.diameter})</span>
                      {scrapLength > 0 ? (
                        <span className="text-danger font-bold">SISA: {scrapLength}M (SCRAP)</span>
                      ) : (
                        <span className="text-accent font-bold">ZERO WASTE</span>
                      )}
                    </div>
                    <div className="pattern-bar-container">
                      {p.pieces.map((piece, pieceIdx) => {
                        const widthPct = (piece.length / 12.0) * 100;
                        const pieceClasses = ['piece-1', 'piece-2', 'piece-3'];
                        const classToUse = pieceClasses[pieceIdx % pieceClasses.length];
                        return (
                          <div 
                            key={pieceIdx} 
                            className={`pattern-segment ${classToUse}`}
                            style={{ width: `${widthPct}%` }}
                          >
                            {piece.length}m
                          </div>
                        );
                      })}
                      {scrapLength > 0 && (
                        <div 
                          className="pattern-segment scrap"
                          style={{ width: `${(scrapLength / 12.0) * 100}%` }}
                        >
                          SCRAP
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Belum ada pola optimasi. Silakan tambahkan data potongan di form sebelah kiri.</p>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="total-required-banner">
              <span>TOTAL STOCK DIBUTUHKAN:</span>
              <span>{optData.barsNeeded} BATANG</span>
            </div>
          )}
        </div>

        {/* Master Ledger List */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>DATA REBAR AKTIF</h3>
            {items.length > 0 && (
              <button className="btn btn-danger-outline btn-sm" onClick={onClearAll}>
                Hapus Semua
              </button>
            )}
          </div>
          
          <div className="table-responsive">
            <table className="recap-table">
              <thead>
                <tr>
                  <th>DIA</th>
                  <th>PANJANG (M)</th>
                  <th>QTY</th>
                  <th>TOTAL (M)</th>
                  <th style={{ textAlign: 'center' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map(item => (
                    <tr key={item.id}>
                      <td className="font-bold">D{item.diameter}</td>
                      <td>{item.length} m</td>
                      <td>{item.quantity}</td>
                      <td className="font-bold">{(item.length * item.quantity).toFixed(2)} m</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-icon-delete" onClick={() => onDeleteRow(item.id)}>
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ color: '#9ca3af', padding: '2rem' }}>
                      Tidak ada entri potongan aktif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <button className="btn-floating-add" onClick={handleSubmit} title="Tambah data cepat">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
