import { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import RecapTable from './components/RecapTable';
import { calculateRebarWeight } from './utils/formulas';
import { loadRecapData, saveRecapData, clearRecapData } from './utils/storage';

export default function App() {
  const [recapList, setRecapList] = useState([]);

  // Load initial data on mount
  useEffect(() => {
    const data = loadRecapData();
    setRecapList(data);
  }, []);

  const handleAddRow = (formData) => {
    const weightKg = calculateRebarWeight(
      formData.diameter,
      formData.length,
      formData.quantity
    );
    const weightTon = weightKg / 1000;

    const newItem = {
      id: Date.now().toString(),
      ...formData,
      weightKg,
      weightTon,
    };

    const updatedList = [...recapList, newItem];
    setRecapList(updatedList);
    saveRecapData(updatedList);
  };

  const handleDeleteRow = (id) => {
    const updatedList = recapList.filter((item) => item.id !== id);
    setRecapList(updatedList);
    saveRecapData(updatedList);
  };

  const handleClearAll = () => {
    clearRecapData();
    setRecapList([]);
  };

  return (
    <div className="container">
      <header>
        <h1>ILoveBesi</h1>
        <p>Kalkulator Besi Beton & Bar Bending Schedule (BBS) Standar SNI</p>
      </header>

      <main className="layout-grid">
        <CalculatorForm onSubmit={handleAddRow} />
        <RecapTable
          items={recapList}
          onDelete={handleDeleteRow}
          onClearAll={handleClearAll}
        />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} ILoveBesi. Aplikasi Validasi Konstruksi Lapangan.</p>
      </footer>
    </div>
  );
}
