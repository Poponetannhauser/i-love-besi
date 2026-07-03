export default function LandingPage({ onEnterApp }) {
  return (
    <div className="landing-page">
      {/* Landing Header */}
      <header className="landing-header">
        <div className="brand-logo">ILOVEBESI</div>
        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Optimizations</a>
          <a href="#features" className="landing-nav-link">Inventory</a>
          <a href="#features" className="landing-nav-link">Tools</a>
          <button className="btn-outline-support" onClick={onEnterApp}>Support</button>
          <button className="btn-rounded-yellow" onClick={onEnterApp}>Get Started</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge-tag">INDUSTRY STANDARD V2.4</span>
          <h1 className="hero-title">
            Optimasi Potongan Besi,<br />
            <span>Minimalisir Waste Material</span>
          </h1>
          <p className="hero-desc">
            Solusi cerdas bagi Quantity Surveyors dan Field Mandors untuk menghitung bar bending schedule secara presisi, mengurangi limbah hingga 15% di setiap proyek konstruksi.
          </p>
          <div className="hero-cta-row">
            <button className="btn-cta-primary" onClick={onEnterApp}>
              MULAI OPTIMASI SEKARANG &rarr;
            </button>
            <button className="btn-cta-secondary" onClick={onEnterApp}>
              LIHAT DEMO
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <div className="features-header">
          <div className="features-intro">
            <h2>FITUR UTAMA KONSTRUKSI</h2>
            <p>Didesain khusus untuk lingkungan lapangan yang keras dan dinamis. Efisiensi bukan lagi pilihan, tapi standar baru.</p>
          </div>
          <div className="badge-trust">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" style={{ color: '#10b981' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Trusted by 50+ Project Leads
          </div>
        </div>

        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="feature-icon-circle yellow">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>INPUT FAT-FINGER</h3>
            <p>Antarmuka yang dioptimalkan untuk perangkat seluler di lapangan. Tombol besar dan input numerik yang mudah digunakan bahkan saat menggunakan sarung tangan proyek.</p>
            <div className="feature-bullets">
              <div className="bullet-item">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" style={{ color: '#fbbf24' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Large touch targets (48px+)
              </div>
              <div className="bullet-item">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" style={{ color: '#fbbf24' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Offline data sync
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-icon-circle blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3>VISUALISASI POLA POTONG</h3>
            <p>Diagram stock bar 12 meter yang intuitif. Membantu mandor melihat urutan pemotongan secara visual untuk menghindari kesalahan fatal di lapangan.</p>
            <div className="preview-showcase-bar">
              <div className="preview-bar-visual"></div>
              <div className="preview-bar-labels">
                <span>3.5m</span>
                <span>3.6m</span>
                <span style={{ color: 'red' }}>Waste: 0.6m</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-icon-circle black">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3>REKAPITULASI REAL-TIME</h3>
            <p>Data rekapitulasi dengan densitas tinggi ala Excel. Memudahkan QS melakukan verifikasi volume dan pemesanan material ke vendor secara akurat.</p>
            <table className="preview-table-snippet">
              <thead>
                <tr>
                  <th>DIA.</th>
                  <th>QTY</th>
                  <th>WASTE%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>D16</td>
                  <td>450</td>
                  <td style={{ color: '#b45309', fontWeight: 'bold' }}>2.4%</td>
                </tr>
                <tr>
                  <td>D22</td>
                  <td>820</td>
                  <td style={{ color: '#b45309', fontWeight: 'bold' }}>1.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="landing-middle">
        <div className="middle-container">
          {/* Visual card */}
          <div className="middle-card-visual">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#6b7280' }}>
              <span>CUTTING PATTERN ANALYSIS - BEAM 402/B</span>
              <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>OPTIMIZED</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '24px', background: 'linear-gradient(to right, #facc15 80%, #ef4444 80% 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'black' }}>
                <span>3.5m</span>
                <span>2.0m</span>
                <span>0.5m</span>
              </div>
              <div style={{ height: '24px', background: 'linear-gradient(to right, #facc15 90%, #ef4444 90% 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'black' }}>
                <span>2.4m</span>
                <span>2.4m</span>
                <span>0.9m</span>
              </div>
              <div style={{ height: '24px', background: 'linear-gradient(to right, #facc15 95%, #ef4444 95% 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'black' }}>
                <span>4.8m</span>
                <span>0.9m</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#9ca3af' }}>MATERIAL UTILIZED</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>94.8%</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#9ca3af' }}>TOTAL SCRAP</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444' }}>1.2m</div>
              </div>
            </div>
          </div>

          {/* Text section */}
          <div className="middle-text-section">
            <h2>ALAT BANTU UTAMA UNTUK DECISION MAKING YANG LEBIH CEPAT.</h2>
            <p style={{ color: '#4b5563', fontSize: '1.05rem' }}>Berhenti menebak-nebak di lapangan. ILoveBesi memberikan kepastian perhitungan yang dapat dipertanggungjawabkan dalam hitungan detik.</p>
            <div className="middle-bullets-list">
              <div className="list-item-showcase">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4>OPTIMASI LINEAR MULTI-PARAMETER</h4>
                  <p>Algoritma kami menghitung ribuan kombinasi untuk menemukan sisa potongan terkecil.</p>
                </div>
              </div>
              <div className="list-item-showcase">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4>EXPORT PDF & EXCEL SEKETIKA</h4>
                  <p>Bagikan hasil optimasi ke seluruh tim melalui format standar industri.</p>
                </div>
              </div>
            </div>
            <button className="btn-cta-primary" style={{ width: 'fit-content', marginTop: '1rem' }} onClick={onEnterApp}>
              JADWALKAN KONSULTASI TEKNIS
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <div className="cta-panel">
          <h2>SIAP MENGHILANGKAN WASTE DI PROYEK ANDA?</h2>
          <p>Daftar sekarang dan dapatkan akses penuh untuk 3 proyek pertama secara GRATIS. Tanpa biaya tersembunyi.</p>
          <form className="cta-form" onSubmit={(e) => { e.preventDefault(); onEnterApp(); }}>
            <input type="email" placeholder="Alamat Email Profesional" className="cta-input" required />
            <button type="submit" className="btn-cta-submit">DAFTAR GRATIS</button>
          </form>
          <span className="cta-disclaimer">*Mendukung standar SNI, ASTM, dan BS. Data Anda aman tersinkronisasi di cloud.</span>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="brand-logo">ILOVEBESI</div>
            <p>Pionir teknologi optimasi rebar digital di Indonesia. Membantu industri konstruksi bergerak menuju keberlanjutan melalui efisiensi material yang ekstrem.</p>
          </div>
          <div className="footer-col">
            <h4>Navigasi</h4>
            <ul className="footer-links">
              <li><a href="#features" onClick={onEnterApp}>Dashboard Produk</a></li>
              <li><a href="#features" onClick={onEnterApp}>Pricing Plan</a></li>
              <li><a href="#features" onClick={onEnterApp}>Case Studies</a></li>
              <li><a href="#features" onClick={onEnterApp}>Documentation</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Kontak</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@ilovebesi.id">support@ilovebesi.id</a></li>
              <li><a href="tel:+6221500REBAR">+62 (21) 500-REBAR</a></li>
              <li><span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Sudirman Central Business District, Jakarta</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ILoveBesi Technologies. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy" onClick={onEnterApp}>Privacy Policy</a>
            <a href="#terms" onClick={onEnterApp}>Terms of Service</a>
            <a href="#settings" onClick={onEnterApp}>Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
