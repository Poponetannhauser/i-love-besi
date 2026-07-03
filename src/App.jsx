import { useState, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import InputsView from './components/InputsView';
import InventoryView from './components/InventoryView';
import CutListsView from './components/CutListsView';
import ProjectsView from './components/ProjectsView';
import LandingPage from './components/LandingPage';
import { calculateRebarWeight } from './utils/formulas';

const DEFAULT_PROJECTS = [
  { id: '1', name: 'Project Alpha', location: 'Site 402 - Zone B', status: 'ACTIVE', items: [] },
  { id: '2', name: 'Terminal 3 Extension', location: 'Jakarta Intl Airport', status: 'ACTIVE', items: [] },
  { id: '3', name: 'Ciliwung Bridge B', location: 'East Jakarta', status: 'COMPLETED', items: [] }
];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState('1');
  const [activeTab, setActiveTab] = useState('projects'); // Start on projects tab
  const [view, setView] = useState('landing'); // 'landing' or 'app'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem('ilovebesi_multi_projects');
      if (data) {
        setProjects(JSON.parse(data));
      } else {
        setProjects(DEFAULT_PROJECTS);
        localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(DEFAULT_PROJECTS));
      }
    } catch (e) {
      console.error('Error loading projects:', e);
      setProjects(DEFAULT_PROJECTS);
    }
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECTS[0];
  const recapList = activeProject ? activeProject.items : [];

  const handleSetTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

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

    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          items: [...p.items, newItem]
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(updatedProjects));
  };

  const handleDeleteRow = (id) => {
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          items: p.items.filter(item => item.id !== id)
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(updatedProjects));
  };

  const handleClearAll = () => {
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          items: []
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(updatedProjects));
  };

  const handleAddProject = (newProj) => {
    const newProject = {
      id: Date.now().toString(),
      ...newProj
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(updatedProjects));
  };

  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    setActiveTab('dashboard'); // Navigate to dashboard when project card is clicked
    setIsSidebarOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    const remainingProjects = projects.filter(p => p.id !== projectId);
    let finalProjects = remainingProjects;
    
    if (remainingProjects.length === 0) {
      finalProjects = DEFAULT_PROJECTS;
    }
    
    setProjects(finalProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(finalProjects));
    
    if (activeProjectId === projectId) {
      setActiveProjectId(finalProjects[0].id);
    }
  };

  const handleToggleProjectStatus = (projectId) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: p.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE'
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    localStorage.setItem('ilovebesi_multi_projects', JSON.stringify(updatedProjects));
  };

  // Helper to determine the header title dynamically
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'projects':
        return 'Daftar Proyek';
      case 'dashboard':
        return 'Dashboard Utama';
      case 'inputs':
        return 'Input Optimasi & Visualisasi';
      case 'inventory':
        return 'Rekapitulasi Material';
      case 'cut-lists':
        return 'Instruksi Pemotongan Lapangan';
      case 'optimizations':
        return 'Optimasi & Cutting Stock';
      default:
        return 'ILOVEBESI';
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnterApp={() => setView('app')} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Backdrop Overlay for Mobile Drawer */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Drawer Close Button (Visible on mobile/tablet) */}
        <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} title="Close Sidebar">
          &times;
        </button>

        <div className="brand-logo" onClick={() => { setView('landing'); setIsSidebarOpen(false); }} style={{ cursor: 'pointer', color: '#111827' }}>
          ILOVEBESI
        </div>
        
        {activeProject && (
          <div className="project-context">
            <div className="project-title" style={{ textTransform: 'uppercase' }}>{activeProject.name}</div>
            <div className="project-subtitle">{activeProject.location}</div>
          </div>
        )}

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => handleSetTab('projects')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Projects
          </button>

          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSetTab('dashboard')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </button>

          <button 
            className={`nav-item ${activeTab === 'inputs' ? 'active' : ''}`}
            onClick={() => handleSetTab('inputs')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Inputs
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => handleSetTab('inventory')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Inventory
          </button>

          <button 
            className={`nav-item ${activeTab === 'cut-lists' ? 'active' : ''}`}
            onClick={() => handleSetTab('cut-lists')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Cut Lists
          </button>

          <button 
            className={`nav-item ${activeTab === 'optimizations' ? 'active' : ''}`}
            onClick={() => handleSetTab('optimizations')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Optimizations
          </button>
        </nav>

        <button className="btn-action-sidebar" onClick={() => handleSetTab('inputs')}>
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
        {/* Top Header Bar */}
        <header className="app-header-bar">
          <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Hamburger Trigger Menu (Visible on mobile/tablet) */}
            <button className="btn-hamburger" onClick={() => setIsSidebarOpen(true)} title="Open Sidebar">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2>{getHeaderTitle()}</h2>
          </div>
          <div className="header-user-controls">
            <button className="icon-btn-header" title="Notifikasi">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="icon-btn-header" title="Pengaturan">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Profil User" 
              className="avatar-circle"
            />
          </div>
        </header>

        {/* View Routing */}
        <div className="content-body">
          {activeTab === 'projects' && (
            <ProjectsView 
              projects={projects}
              onSelectProject={handleSelectProject}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              onToggleProjectStatus={handleToggleProjectStatus}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              items={recapList} 
              onNavigateToCalculator={() => handleSetTab('inputs')} 
            />
          )}

          {activeTab === 'inputs' && (
            <InputsView 
              items={recapList}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
              onClearAll={handleClearAll}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView items={recapList} />
          )}

          {activeTab === 'cut-lists' && (
            <CutListsView items={recapList} />
          )}

          {['optimizations'].includes(activeTab) && (
            <div className="panel empty-view-panel">
              <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>{activeTab}</h2>
              <p>Bagian ini sedang dalam pengembangan untuk mendukung data riil lapangan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
