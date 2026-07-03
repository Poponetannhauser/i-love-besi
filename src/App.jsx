import { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import RecapTable from './components/RecapTable';
import DashboardView from './components/DashboardView';
import { calculateRebarWeight } from './utils/formulas';
import { loadRecapData, saveRecapData, clearRecapData } from './utils/storage';

export default function App() {
  const [recapList, setRecapList] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-logo">REBAROPTIX</div>
        
        <div className="project-context">
          <div className="project-title">PROJECT ALPHA</div>
          <div className="project-subtitle">Site 402 - Zone B</div>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventory
          </button>

          <button 
            className={`nav-item ${activeTab === 'cut-lists' ? 'active' : ''}`}
            onClick={() => setActiveTab('cut-lists')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Cut Lists (BBS)
          </button>

          <button 
            className={`nav-item ${activeTab === 'optimizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('optimizations')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Optimizations
          </button>

          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </nav>

        <button className="btn-action-sidebar" onClick={() => setActiveTab('cut-lists')}>
          NEW OPTIMIZATION
        </button>

        <div className="sidebar-footer">
          <button className="nav-item">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Support
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView 
            items={recapList} 
            onNavigateToCalculator={() => setActiveTab('cut-lists')} 
          />
        )}

        {activeTab === 'cut-lists' && (
          <div className="calculator-layout-grid">
            <CalculatorForm onSubmit={handleAddRow} />
            <RecapTable 
              items={recapList} 
              onDelete={handleDeleteRow} 
              onClearAll={handleClearAll} 
            />
          </div>
        )}

        {['inventory', 'optimizations', 'history'].includes(activeTab) && (
          <div className="panel empty-view-panel">
            <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>{activeTab}</h2>
            <p>Bagian ini sedang dalam pengembangan untuk mendukung data riil lapangan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
