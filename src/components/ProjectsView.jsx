import { useState, useMemo } from 'react';
import { optimizeCuttingStock } from '../utils/optimizations';

export default function ProjectsView({ 
  projects, 
  onSelectProject, 
  onAddProject, 
  onDeleteProject, 
  onToggleProjectStatus 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const handleOpenModal = () => {
    setNewProjectName('');
    setNewProjectLocation('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectLocation.trim()) return;

    onAddProject({
      name: newProjectName.trim(),
      location: newProjectLocation.trim(),
      status: 'ACTIVE',
      items: []
    });

    setIsModalOpen(false);
  };

  return (
    <div className="projects-view-container" onClick={() => setActiveDropdownId(null)}>
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
        <button className="btn btn-primary" onClick={handleOpenModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '30px' }}>
          <span style={{ fontSize: '1.1rem', marginRight: '0.25rem' }}>+</span> Tambah Proyek Baru
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project) => {
          // Calculate dynamic metrics per project
          const totalKg = project.items.reduce((acc, item) => acc + item.weightKg, 0);
          const totalTonVal = totalKg / 1000;
          const optData = optimizeCuttingStock(project.items);
          const progressVal = project.items.length > 0 ? optData.efficiency : 0;
          const displayWeight = `${totalTonVal.toFixed(1)} Tons`;

          return (
            <div 
              key={project.id} 
              className="project-card" 
              onClick={() => onSelectProject(project.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="project-card-header">
                <span className={`badge ${project.status === 'ACTIVE' ? 'badge-active' : 'badge-completed'}`}>
                  {project.status}
                </span>
                
                {/* Actions Dot Menu */}
                <div className="project-actions-wrapper">
                  <span 
                    className="card-actions-dots" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdownId(activeDropdownId === project.id ? null : project.id);
                    }}
                  >
                    &#8942;
                  </span>
                  
                  {activeDropdownId === project.id && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                          onToggleProjectStatus(project.id);
                          setActiveDropdownId(null);
                        }}
                      >
                        Set as {project.status === 'ACTIVE' ? 'Completed' : 'Active'}
                      </button>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus proyek "${project.name}"?`)) {
                            onDeleteProject(project.id);
                          }
                          setActiveDropdownId(null);
                        }}
                      >
                        Hapus Proyek
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="project-card-title">{project.name}</h3>
              <div className="project-location">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </div>

              <div className="project-progress-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <span>Optimization Progress</span>
                  <span>{progressVal}%</span>
                </div>
                <div className="progress-bar-container" style={{ margin: 0, height: '8px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${progressVal}%`,
                      backgroundColor: project.status === 'COMPLETED' ? 'var(--emerald)' : 'var(--yellow)' 
                    }}
                  ></div>
                </div>
              </div>

              <div className="project-card-footer">
                <div>
                  <span className="footer-label">TOTAL STEEL WEIGHT</span>
                  <span className="footer-value">{displayWeight}</span>
                </div>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" style={{ color: 'var(--emerald)' }}>
                  {project.status === 'COMPLETED' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  )}
                </svg>
              </div>
            </div>
          );
        })}
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

      {/* Custom Add Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Proyek Baru</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="form-grid" style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div className="form-group full-width">
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Nama Proyek</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Project Alpha, Terminal 3" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontFamily: 'var(--font-sans)', border: 'var(--border-light)', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Lokasi / Site Proyek</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Site 402, Jakarta" 
                  value={newProjectLocation} 
                  onChange={(e) => setNewProjectLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontFamily: 'var(--font-sans)', border: 'var(--border-light)', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-dark-outline" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
