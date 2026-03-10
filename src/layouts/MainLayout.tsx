import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-group">
            <span className="logo-icon">⛽</span>
            <h1 className="logo">Fuelest</h1>
          </div>
          <div className="header-actions">
            <span className="location-badge">Estonia</span>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Fuelest &bull; Real-time fuel tracking</p>
      </footer>
    </div>
  );
};
