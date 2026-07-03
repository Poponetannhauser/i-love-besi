import { useState } from 'react';

const STANDARD_DIAMETERS = [6, 8, 10, 12, 13, 16, 19, 22, 25];

export default function CalculatorForm({ onSubmit }) {
  const [elementName, setElementName] = useState('');
  const [steelType, setSteelType] = useState('BjTP');
  const [diameterType, setDiameterType] = useState('standard'); // 'standard' or 'custom'
  const [selectedDiameter, setSelectedDiameter] = useState(10);
  const [customDiameter, setCustomDiameter] = useState('');
  const [length, setLength] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!elementName.trim()) {
      setError('Keterangan / Nama Elemen harus diisi.');
      return;
    }

    const d = diameterType === 'standard' ? Number(selectedDiameter) : Number(customDiameter);
    if (!d || d <= 0 || isNaN(d)) {
      setError('Diameter besi harus berupa angka positif lebih besar dari 0.');
      return;
    }

    const L = Number(length);
    if (!L || L <= 0 || isNaN(L)) {
      setError('Panjang batang harus berupa angka positif lebih besar dari 0.');
      return;
    }

    const N = Number(quantity);
    if (!N || N <= 0 || !Number.isInteger(N)) {
      setError('Jumlah batang harus berupa bilangan bulat positif.');
      return;
    }

    // Call onSubmit parent handler
    onSubmit({
      elementName: elementName.trim(),
      steelType,
      diameter: d,
      length: L,
      quantity: N,
    });

    // Reset some fields for convenience (except default settings)
    setElementName('');
    if (diameterType === 'custom') {
      setCustomDiameter('');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Input Komponen Besi</h2>
      
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
          <label htmlFor="elementName">Nama Elemen / Keterangan</label>
          <input
            id="elementName"
            type="text"
            placeholder="Contoh: Kolom K1, Balok B1"
            value={elementName}
            onChange={(e) => setElementName(e.target.value)}
          />
        </div>

        <div className="form-group">
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
          <label>Pilihan Diameter</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="diameterType"
                checked={diameterType === 'standard'}
                onChange={() => setDiameterType('standard')}
              />
              SNI
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="diameterType"
                checked={diameterType === 'custom'}
                onChange={() => setDiameterType('custom')}
              />
              Kustom
            </label>
          </div>
        </div>

        <div className="form-group">
          {diameterType === 'standard' ? (
            <>
              <label htmlFor="selectedDiameter">Diameter (mm)</label>
              <select
                id="selectedDiameter"
                value={selectedDiameter}
                onChange={(e) => setSelectedDiameter(Number(e.target.value))}
              >
                {STANDARD_DIAMETERS.map((d) => (
                  <option key={d} value={d}>
                    {d} mm
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label htmlFor="customDiameter">Diameter Kustom (mm)</label>
              <input
                id="customDiameter"
                type="number"
                step="any"
                placeholder="Masukkan diameter mm"
                value={customDiameter}
                onChange={(e) => setCustomDiameter(e.target.value)}
              />
            </>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="length">Panjang Batang (meter)</label>
          <input
            id="length"
            type="number"
            step="any"
            placeholder="Panjang (m)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Jumlah Batang</label>
          <input
            id="quantity"
            type="number"
            placeholder="Jumlah"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary full-width">
          Hitung & Tambah ke Rekap
        </button>
      </form>
    </div>
  );
}
