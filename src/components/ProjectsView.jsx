import { useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function ProjectsView({ items, onNavigateToDashboard }) {
  // Compute dynamic stats for Project Alpha from items
  const projectAlphaStats = useMemo(() => {
    const totalKg = items.reduce((acc, item) => acc + item.weightKg, 0);
    const totalTonVal = totalKg / 1000;
    const optData = optimizeCuttingStock(items);

    return {
      weight: items.length > 0 ? `${totalTonVal.toFixed(1)} Tons` : '12.4 Tons',
      efficiency: items.length > 0 ? optData.efficiency : 65
    };
  }, [items]);

  return (
    <div className="projects-view-container">
      {/* Title & Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-dark)' }}>
            Daftar Proyek
          </h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage and monitor your steel reinforcement projects.
          </p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '30px' }}>
          <span style={{ fontSize: '1.1rem', marginRight: '0.25rem' }}>+</span> Tambah Proyek Baru
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {/* Card 1: Project Alpha (Dynamic) */}
        <div className="project-card" onClick={onNavigateToDashboard} style={{ cursor: 'pointer' }}>
          <div className="project-card-header">
            <span className="badge badge-active">ACTIVE</span>
            <span className="card-actions-dots">&#8942;</span>
          </div>
          
          <h3 className="project-card-title">Project Alpha</h3>
          <div className="project-location">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Site 402 - Zone B
          </div>

          <div className="project-progress-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Optimization Progress</span>
              <span>{projectAlphaStats.efficiency}%</span>
            </div>
            <div className="progress-bar-container" style={{ margin: 0, height: '8px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${projectAlphaStats.efficiency}%` }}
              ></div>
            </div>
          </div>

          <div className="project-card-footer">
            <div>
              <span className="footer-label">TOTAL STEEL WEIGHT</span>
              <span className="footer-value">{projectAlphaStats.weight}</span>
            </div>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" style={{ color: 'var(--emerald)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        {/* Card 2: Terminal 3 Extension */}
        <div className="project-card">
          <div className="project-card-header">
            <span className="badge badge-active">ACTIVE</span>
            <span className="card-actions-dots">&#8942;</span>
          </div>
          
          <h3 className="project-card-title">Terminal 3 Extension</h3>
          <div className="project-location">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Jakarta Intl Airport
          </div>

          <div className="project-progress-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Optimization Progress</span>
              <span>42%</span>
            </div>
            <div className="progress-bar-container" style={{ margin: 0, height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: '42%' }}></div>
            </div>
          </div>

          <div className="project-card-footer">
            <div>
              <span className="footer-label">TOTAL STEEL WEIGHT</span>
              <span className="footer-value">45.8 Tons</span>
            </div>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" style={{ color: '#854d0e' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Ciliwung Bridge B */}
        <div className="project-card">
          <div className="project-card-header">
            <span className="badge badge-completed">COMPLETED</span>
            <span className="card-actions-dots">&#8942;</span>
          </div>
          
          <h3 className="project-card-title">Ciliwung Bridge B</h3>
          <div className="project-location">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            East Jakarta
          </div>

          <div className="project-progress-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Optimization Progress</span>
              <span>100%</span>
            </div>
            <div className="progress-bar-container" style={{ margin: 0, height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: 'var(--emerald)' }}></div>
            </div>
          </div>

          <div className="project-card-footer">
            <div>
              <span className="footer-label">TOTAL STEEL WEIGHT</span>
              <span className="footer-value">8.2 Tons</span>
            </div>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" style={{ color: 'var(--emerald)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dotted Border Area */}
      <div className="dashed-cta-box">
        <svg className="compass-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A2 2 0 013 15.487V5.512a2 2 0 011.053-1.764L9 1l5.447 2.724A2 2 0 0115 5.512v9.975a2 2 0 01-1.053 1.764L9 20z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 1v19m0-19L4.053 3.487m4.947-2.48L13.947 3.49M9 20L4.053 17.513M9 20l4.947-2.487" />
        </svg>
        <p className="cta-header-text">Ready to optimize more?</p>
        <p className="cta-sub-text">Create a new project to start reducing scrap and saving costs.</p>
      </div>
    </div>
  );
}
