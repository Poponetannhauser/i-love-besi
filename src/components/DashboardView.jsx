import { useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function DashboardView({ items, onNavigateToCalculator }) {
  // Dynamic stats & optimization calculations based on recapList items
  const optData = useMemo(() => {
    return optimizeCuttingStock(items);
  }, [items]);

  const stats = useMemo(() => {
    const activeProjectsCount = items.length > 0
      ? new Set(items.map(item => item.elementName)).size
      : 0;
    const totalWeightTon = items.reduce((acc, item) => acc + item.weightTon, 0);
    const displayedWeight = `${totalWeightTon.toFixed(2)} tn`;

    const materialSavingsVal = items.length > 0
      ? `${(optData.efficiency).toFixed(1)}%`
      : '0.0%';

    return {
      activeProjects: activeProjectsCount,
      totalOptimized: displayedWeight,
      materialSavings: materialSavingsVal
    };
  }, [items, optData]);

  return (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <span className="subtitle">OPERATIONAL OVERVIEW</span>
        <h2 className="title">DASHBOARD UTAMA</h2>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span>ACTIVE PROJECTS</span>
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="stat-value">{stats.activeProjects}</div>
          <div className="stat-desc">Active structural elements</div>
        </div>

        <div className="stat-card accent-yellow">
          <div className="stat-card-header">
            <span>TOTAL OPTIMIZED</span>
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="stat-value">{stats.totalOptimized}</div>
          <div className="stat-desc">Aggregate across all sites</div>
        </div>

        <div className="stat-card accent-blue">
          <div className="stat-card-header">
            <span>MATERIAL EFFICIENCY</span>
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div className="stat-value">{stats.materialSavings}</div>
          <div className="stat-desc">Optimized cut utilization</div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="dashboard-mid-grid">
        {/* Recent Performance Table */}
        <div className="panel recent-performance">
          <div className="panel-header">
            <h3>RECENT CUT LIST PERFORMANCE</h3>
            <button className="panel-icon-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
          <div className="panel-body">
            <table className="flat-table">
              <thead>
                <tr>
                  <th>PROJECT / ELEMENT</th>
                  <th>STEEL GRADE</th>
                  <th>WASTE %</th>
                  <th>SAVINGS</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.slice(-4).map((item) => (
                    <tr key={item.id}>
                      <td>{item.elementName}</td>
                      <td>{item.steelType === 'BjTP' ? 'Grade 280 (Plain)' : 'Grade 420 (Deformed)'} ({item.diameter}mm)</td>
                      <td className="text-warning font-bold">{(optData.waste).toFixed(1)}%</td>
                      <td>Rp {(item.weightKg * 1200).toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center" style={{ color: 'var(--text-light)', padding: '3rem 1rem' }}>
                      Belum ada data potongan aktif. Silakan isi data di menu Inputs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="btn-flat-action" onClick={onNavigateToCalculator}>
              VIEW ALL ACTIVE LOGS
            </button>
          </div>
        </div>

        {/* Right Columns: Map & Alert */}
        <div className="right-panel-column">
          <div className="panel map-panel">
            <div className="panel-header">
              <div className="flex-align">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" style={{ marginRight: '6px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3>ACTIVE LOGISTICS MAP</h3>
              </div>
            </div>
            <div className="panel-body map-body">
              <div className="map-placeholder">
                <span className="live-feed-badge">LIVE FEEDS: {items.length > 0 ? 1 : 0}</span>
                <div className="map-overlay-text">MAP OVERVIEW</div>
              </div>
            </div>
          </div>

          <div className="panel alert-panel">
            <h3>INVENTORY STATUS</h3>
            <p>
              {items.length > 0 
                ? 'Semua tingkat persediaan berada pada batas aman operasional proyek.' 
                : 'Belum ada data stok rebar. Lakukan kalkulasi pada menu Inputs.'}
            </p>
            {items.length === 0 && <button className="btn btn-dark full-width" onClick={onNavigateToCalculator}>MULAI SEKARANG</button>}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="dashboard-bottom-grid">
        <div className="panel chart-panel">
          <h3>WASTE SAVINGS TREND</h3>
          <div className="chart-container">
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '30%' }}></div>
              <span className="bar-label">WEEK 12</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '55%' }}></div>
              <span className="bar-label">WEEK 13</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '45%' }}></div>
              <span className="bar-label">WEEK 14</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '80%' }}></div>
              <span className="bar-label">WEEK 15</span>
            </div>
            <div className="bar-wrapper current">
              <div className="bar accent-yellow-bar" style={{ height: items.length > 0 ? `${optData.efficiency}%` : '0%' }}></div>
              <span className="bar-label">CURRENT</span>
            </div>
          </div>
        </div>

        <div className="panel opt-result-panel">
          <h3>RECENT OPTIMIZATION RESULT</h3>
          <div className="opt-meta">
            {items.length > 0 ? (
              <strong>BBS Optimization: Efficiency {optData.efficiency}%</strong>
            ) : (
              <strong>Tidak ada data optimasi pemotongan.</strong>
            )}
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: items.length > 0 ? `${optData.efficiency}%` : '0%' }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>USED: {items.length > 0 ? `${optData.efficiency}%` : '0.0%'}</span>
            <span>OFF-CUT: {items.length > 0 ? `${optData.waste}%` : '0.0%'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
