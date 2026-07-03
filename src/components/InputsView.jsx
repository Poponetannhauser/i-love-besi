import { useState, useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

const STANDARD_DIAMETERS = [6, 8, 10, 12, 13, 16, 19, 22, 25];

export default function InputsView({ items, onAddRow, onDeleteRow, onClearAll }) {
  const [formType, setFormType] = useState('direct'); // 'direct' or 'sengkang'
  const [error, setError] = useState('');

  // 1. Standard / Direct Cut Form States
  const [elementName, setElementName] = useState('');
  const [steelType, setSteelType] = useState('BjTS'); // Default Ulir to match mock
  const [diameter, setDiameter] = useState('10');
  const [stockLength, setStockLength] = useState('12.00');
  const [cutLength, setCutLength] = useState('');
  const [quantity, setQuantity] = useState('');

  // 2. Sengkang/Begel Helper Form States
  const [sengkangName, setSengkangName] = useState('');
  const [concreteWidth, setConcreteWidth] = useState(''); // cm
  const [concreteHeight, setConcreteHeight] = useState(''); // cm
  const [concreteCover, setConcreteCover] = useState('2.5'); // cm (default)
  const [hookLength, setHookLength] = useState('10'); // cm (default)
  const [beamLength, setBeamLength] = useState(''); // m
  const [spacing, setSpacing] = useState('15'); // cm (default)
  const [elementQty, setElementQty] = useState('1'); // unit (default)

  // 3. Overlap & Besi Banci States (Fase 2)
  const [hasOverlap, setHasOverlap] = useState(false);
  const [overlapType, setOverlapType] = useState('40d'); // '40d', '50d', 'custom'
  const [customOverlapFactor, setCustomOverlapFactor] = useState('40');
  const [isTolerance, setIsTolerance] = useState(false);
  const [toleranceType, setToleranceType] = useState('0.3'); // '0.3', '0.5', 'custom'
  const [customDiameterAktual, setCustomDiameterAktual] = useState('');

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

  // Handle Standard / Direct Cut Form Submit
  const handleDirectSubmit = (e) => {
    e.preventDefault();
    setError('');

    const nameToUse = elementName.trim() || `Besi Potong D${diameter}`;
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

    // Overlap Calculation
    let overlapLength = 0;
    let overlapFactorVal = 0;
    if (hasOverlap) {
      const factor = overlapType === '40d' ? 40 : overlapType === '50d' ? 50 : Number(customOverlapFactor);
      overlapFactorVal = factor;
      overlapLength = Number(((d * factor) / 1000).toFixed(3));
    }
    const finalLength = Number((L + overlapLength).toFixed(3));

    // Besi Banci / Tolerance Calculation
    let diameterAktual = d;
    if (isTolerance) {
      if (toleranceType === '0.3') {
        diameterAktual = Number((d - 0.3).toFixed(1));
      } else if (toleranceType === '0.5') {
        diameterAktual = Number((d - 0.5).toFixed(1));
      } else {
        const val = Number(customDiameterAktual);
        if (!val || val <= 0 || isNaN(val)) {
          setError('Diameter aktual custom harus berupa angka positif.');
          return;
        }
        diameterAktual = val;
      }
    }

    onAddRow({
      elementName: nameToUse,
      steelType,
      diameter: d,
      length: finalLength,
      quantity: N,
      baseLength: L,
      overlapLength,
      hasOverlap,
      overlapFactor: overlapFactorVal,
      diameterAktual,
      isTolerance,
      toleranceType,
      customDiameterAktual: toleranceType === 'custom' ? customDiameterAktual : ''
    });

    // Reset input fields
    setElementName('');
    setCutLength('');
    setQuantity('');
  };

  // Handle Sengkang Helper Submit
  const handleSengkangSubmit = (e) => {
    e.preventDefault();
    setError('');

    const width = Number(concreteWidth);
    const height = Number(concreteHeight);
    const cover = Number(concreteCover);
    const hook = Number(hookLength);
    const L_beam = Number(beamLength);
    const S_spacing = Number(spacing);
    const Qty_elem = Number(elementQty);

    if (!width || width <= 0 || !height || height <= 0) {
      setError('Lebar dan tinggi penampang beton harus berupa angka positif.');
      return;
    }
    if (isNaN(cover) || cover < 0 || isNaN(hook) || hook < 0 || L_beam <= 0 || S_spacing <= 0 || Qty_elem <= 0) {
      setError('Semua parameter dimensi sengkang harus diisi dengan angka positif.');
      return;
    }

    // 1. Calculate clean sengkang dimensions
    const cleanWidth = width - 2 * cover;
    const cleanHeight = height - 2 * cover;

    if (cleanWidth <= 0 || cleanHeight <= 0) {
      setError('Tebal selimut beton melebihi ukuran beton penampang!');
      return;
    }

    // 2. Total clean circumference + (2 * hook) (in cm converted to meters)
    const cutLen = Number(((2 * (cleanWidth + cleanHeight) + (hook * 2)) / 100).toFixed(3));

    // 3. Spacing count: L_beam in cm / spacing
    const sengkangPerElem = Math.round((L_beam * 100) / S_spacing);
    const totalQty = sengkangPerElem * Qty_elem;

    const nameToUse = sengkangName.trim() || `Sengkang D${diameter} (${width}x${height})`;

    onAddRow({
      elementName: nameToUse,
      steelType,
      diameter: Number(diameter),
      length: cutLen,
      quantity: totalQty,
      baseLength: cutLen,
      overlapLength: 0,
      hasOverlap: false,
      overlapFactor: 0,
      diameterAktual: Number(diameter),
      isTolerance: false,
      toleranceType: '0',
      customDiameterAktual: ''
    });

    // Reset fields
    setSengkangName('');
    setConcreteWidth('');
    setConcreteHeight('');
    setBeamLength('');
  };

  // Derived state: Live sengkang preview calculation
  const liveSengkangPreview = useMemo(() => {
    if (formType !== 'sengkang') return null;

    const width = Number(concreteWidth);
    const height = Number(concreteHeight);
    const cover = Number(concreteCover);
    const hook = Number(hookLength);
    const L_beam = Number(beamLength);
    const S_spacing = Number(spacing);
    const Qty_elem = Number(elementQty);

    if (
      isNaN(width) || width <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(cover) || cover < 0 ||
      isNaN(hook) || hook < 0 ||
      isNaN(L_beam) || L_beam <= 0 ||
      isNaN(S_spacing) || S_spacing <= 0 ||
      isNaN(Qty_elem) || Qty_elem <= 0
    ) {
      return null;
    }

    const cleanWidth = width - (2 * cover);
    const cleanHeight = height - (2 * cover);
    if (cleanWidth <= 0 || cleanHeight <= 0) return null;

    // Length of 1 begel (in meters)
    const singleLen = Number(((2 * (cleanWidth + cleanHeight) + (hook * 2)) / 100).toFixed(3));

    // Quantity of sengkangs
    const qtyPerBeam = Math.round((L_beam * 100) / S_spacing);
    const totalQty = qtyPerBeam * Qty_elem;

    // Weight calculation: 0.006165 * d^2 * L * N
    const d = Number(diameter);
    const weightKg = 0.006165 * d * d * singleLen * totalQty;

    return {
      singleLength: singleLen,
      quantity: totalQty,
      weightKg: Number(weightKg.toFixed(2))
    };
  }, [formType, concreteWidth, concreteHeight, concreteCover, hookLength, beamLength, spacing, elementQty, diameter]);

  // Derived state: Live direct cut preview calculation
  const liveDirectPreview = useMemo(() => {
    if (formType !== 'direct') return null;

    const d = Number(diameter);
    const L = Number(cutLength);
    const N = Number(quantity);

    if (isNaN(d) || d <= 0 || isNaN(L) || L <= 0 || isNaN(N) || N <= 0) {
      return null;
    }

    // 1. Overlap calculation
    let overlapLength = 0;
    if (hasOverlap) {
      const factor = overlapType === '40d' ? 40 : overlapType === '50d' ? 50 : Number(customOverlapFactor);
      if (factor && factor > 0) {
        overlapLength = Number(((d * factor) / 1000).toFixed(3));
      }
    }
    const finalLength = Number((L + overlapLength).toFixed(3));

    // 2. Tolerance calculation
    let diameterAktual = d;
    let shrinkagePct = 0;
    if (isTolerance) {
      if (toleranceType === '0.3') {
        diameterAktual = Number((d - 0.3).toFixed(1));
      } else if (toleranceType === '0.5') {
        diameterAktual = Number((d - 0.5).toFixed(1));
      } else if (customDiameterAktual) {
        diameterAktual = Number(Number(customDiameterAktual).toFixed(2));
      }
      
      if (diameterAktual > 0) {
        const nominalWeightFactor = 0.006165 * d * d;
        const actualWeightFactor = 0.006165 * diameterAktual * diameterAktual;
        shrinkagePct = Number(((nominalWeightFactor - actualWeightFactor) / nominalWeightFactor * 100).toFixed(2));
      }
    }

    // Weight calculation
    const weightNominalKg = 0.006165 * d * d * finalLength * N;
    const weightActualKg = 0.006165 * diameterAktual * diameterAktual * finalLength * N;

    return {
      overlapLength,
      finalLength,
      diameterAktual,
      shrinkagePct: isNaN(shrinkagePct) ? 0 : shrinkagePct,
      weightNominalKg,
      weightActualKg
    };
  }, [formType, diameter, cutLength, quantity, hasOverlap, overlapType, customOverlapFactor, isTolerance, toleranceType, customDiameterAktual]);

  // Apply Quick Presets
  const applyPreset = (diaVal, lengthVal) => {
    setFormType('direct');
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
          {/* Tabs header inside the card */}
          <div className="form-tabs">
            <button 
              className={`tab-btn ${formType === 'direct' ? 'active' : ''}`}
              onClick={() => { setFormType('direct'); setError(''); }}
            >
              Potongan Langsung
            </button>
            <button 
              className={`tab-btn ${formType === 'sengkang' ? 'active' : ''}`}
              onClick={() => { setFormType('sengkang'); setError(''); }}
            >
              Asisten Sengkang
            </button>
          </div>

          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>&oplus;</span> 
            {formType === 'direct' ? 'INPUT DATA POTONGAN' : 'ASISTEN INPUT SENGKANG'}
          </h3>

          {error && (
            <div className="error-alert">
              <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Standard Form: Direct Cut */}
          {formType === 'direct' ? (
            <form onSubmit={handleDirectSubmit} className="form-grid">
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

              <div className="form-group full-width">
                <label htmlFor="steelType">Tipe Besi</label>
                <select
                  id="steelType"
                  value={steelType}
                  onChange={(e) => setSteelType(e.target.value)}
                >
                  <option value="BjTP">Besi Polos (BjTP)</option>
                  <option value="BjTS">Besi Sirip/Ulir (BjTS)</option>
                </select>
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

              {/* Overlap & Besi Banci Options */}
              <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 'var(--radius-sm)', border: 'var(--border-light)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="hasOverlap"
                    type="checkbox"
                    checked={hasOverlap}
                    onChange={(e) => setHasOverlap(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="hasOverlap" style={{ fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Aktifkan Sambungan (Overlap)
                  </label>
                </div>
                
                {hasOverlap && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Opsi Sambungan</label>
                    <select
                      value={overlapType}
                      onChange={(e) => setOverlapType(e.target.value)}
                      style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      <option value="40d">Tulangan Bawah (Tarik) - 40d</option>
                      <option value="50d">Tulangan Atas (Tarik) - 50d</option>
                      <option value="custom">Custom Overlap</option>
                    </select>
                    {overlapType === 'custom' && (
                      <input
                        type="number"
                        placeholder="Contoh: 40"
                        value={customOverlapFactor}
                        onChange={(e) => setCustomOverlapFactor(e.target.value)}
                        style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 'var(--radius-sm)', border: 'var(--border-light)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="isTolerance"
                    type="checkbox"
                    checked={isTolerance}
                    onChange={(e) => setIsTolerance(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isTolerance" style={{ fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Gunakan Besi Toleransi (Besi Banci)
                  </label>
                </div>
                
                {isTolerance && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexDirection: 'column' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Opsi Toleransi</label>
                    <select
                      value={toleranceType}
                      onChange={(e) => setToleranceType(e.target.value)}
                      style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      <option value="0.3">Toleransi Pasar 0.3 mm</option>
                      <option value="0.5">Toleransi Pasar 0.5 mm</option>
                      <option value="custom">Custom Diameter Aktual</option>
                    </select>
                    {toleranceType === 'custom' && (
                      <input
                        type="number"
                        step="any"
                        placeholder="Contoh: 9.7"
                        value={customDiameterAktual}
                        onChange={(e) => setCustomDiameterAktual(e.target.value)}
                        style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.25rem' }}
                      />
                    )}
                  </div>
                )}
              </div>

              {liveDirectPreview && (
                <div className="sengkang-live-preview-banner" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  {hasOverlap && (
                    <div className="preview-main-text" style={{ fontSize: '0.85rem' }}>
                      Overlap: <strong>+{liveDirectPreview.overlapLength} m</strong> per batang (Total: {liveDirectPreview.finalLength} m)
                    </div>
                  )}
                  {isTolerance && (
                    <div className="preview-main-text" style={{ fontSize: '0.85rem', color: 'var(--danger)' }}>
                      Besi Banci ({liveDirectPreview.diameterAktual}mm): Penyusutan Berat <strong>{liveDirectPreview.shrinkagePct}%</strong>
                    </div>
                  )}
                  <div className="preview-sub-text" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                    Berat Nominal: {liveDirectPreview.weightNominalKg.toFixed(2)} kg
                    {isTolerance && ` | Berat Timbangan: ${liveDirectPreview.weightActualKg.toFixed(2)} kg`}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '0.5rem' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                HITUNG & TAMBAH
              </button>
            </form>
          ) : (
            /* Helper Form: Sengkang/Begel */
            <form onSubmit={handleSengkangSubmit} className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="sengkangName">Nama Elemen / Deskripsi (Opsional)</label>
                <input
                  id="sengkangName"
                  type="text"
                  placeholder="Contoh: Sengkang Balok B1"
                  value={sengkangName}
                  onChange={(e) => setSengkangName(e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="sengkangSteelType">Tipe Besi</label>
                <select
                  id="sengkangSteelType"
                  value={steelType}
                  onChange={(e) => setSteelType(e.target.value)}
                >
                  <option value="BjTP">Besi Polos (BjTP)</option>
                  <option value="BjTS">Besi Sirip/Ulir (BjTS)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sengkangDiameter">Diameter (mm)</label>
                <select
                  id="sengkangDiameter"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                >
                  {STANDARD_DIAMETERS.map(d => (
                    <option key={d} value={d}>{d} mm</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="concreteCover">Selimut Beton (cm)</label>
                <input
                  id="concreteCover"
                  type="number"
                  step="any"
                  placeholder="2.5"
                  value={concreteCover}
                  onChange={(e) => setConcreteCover(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="concreteWidth">Lebar Beton (cm)</label>
                <input
                  id="concreteWidth"
                  type="number"
                  placeholder="Contoh: 20"
                  value={concreteWidth}
                  onChange={(e) => setConcreteWidth(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="concreteHeight">Tinggi Beton (cm)</label>
                <input
                  id="concreteHeight"
                  type="number"
                  placeholder="Contoh: 40"
                  value={concreteHeight}
                  onChange={(e) => setConcreteHeight(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hookLength">Panjang Kait (cm)</label>
                <input
                  id="hookLength"
                  type="number"
                  placeholder="10"
                  value={hookLength}
                  onChange={(e) => setHookLength(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="spacing">Jarak Sengkang (cm)</label>
                <input
                  id="spacing"
                  type="number"
                  placeholder="15"
                  value={spacing}
                  onChange={(e) => setSpacing(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="beamLength">Panjang Balok (m)</label>
                <input
                  id="beamLength"
                  type="number"
                  step="any"
                  placeholder="Contoh: 4.00"
                  value={beamLength}
                  onChange={(e) => setBeamLength(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="elementQty">Jumlah Balok (unit)</label>
                <input
                  id="elementQty"
                  type="number"
                  placeholder="1"
                  value={elementQty}
                  onChange={(e) => setElementQty(e.target.value)}
                />
              </div>

              {liveSengkangPreview && (
                <div className="sengkang-live-preview-banner" style={{ gridColumn: 'span 2' }}>
                  <div className="preview-main-text">
                    Total Kebutuhan: <strong>{liveSengkangPreview.quantity} Pcs</strong> Sengkang ({liveSengkangPreview.weightKg.toFixed(2)} kg)
                  </div>
                  <div className="preview-sub-text">
                    Besi {steelType === 'BjTP' ? 'Polos' : 'Ulir'} D{diameter} &bull; Panjang 1 Begel: {liveSengkangPreview.singleLength}m
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '0.5rem', gridColumn: 'span 2' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                HITUNG & TAMBAH SENGKANG
              </button>
            </form>
          )}
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
                  <th>DESKRIPSI & INFO</th>
                  <th>DIA</th>
                  <th>PANJANG</th>
                  <th>QTY</th>
                  <th>BERAT</th>
                  <th style={{ textAlign: 'center' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{item.elementName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {item.steelType === 'BjTP' ? 'Polos' : 'Ulir'}
                          {item.hasOverlap && ` | Overlap +${item.overlapLength}m`}
                          {item.isTolerance && ` | Banci (${item.diameterAktual}mm)`}
                        </div>
                      </td>
                      <td className="font-bold">D{item.diameter}</td>
                      <td>{item.length} m</td>
                      <td>{item.quantity} pcs</td>
                      <td className="font-bold">{item.weightKg.toFixed(2)} kg</td>
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
                    <td colSpan="6" className="text-center" style={{ color: '#9ca3af', padding: '2rem' }}>
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
      <button className="btn-floating-add" onClick={formType === 'direct' ? handleDirectSubmit : handleSengkangSubmit} title="Tambah data cepat">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
