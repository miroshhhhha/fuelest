import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center sticky top-0 z-1000">
        <div className="w-full max-w-(--container-max) mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⛽</span>
            <h1 className="text-3xl font-black text-primary tracking-tighter leading-none m-0">Fuelest</h1>
          </div>
          <div className="flex items-center">
            <span className="bg-slate-100 px-3.5 py-1.5 rounded-lg font-bold text-text-muted text-sm">Estonia</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-(--container-max) mx-auto px-5 pb-10">
        {children}
      </main>

      <footer className="text-center p-10 text-text-muted text-sm">
        <p>&copy; 2026 Fuelest &bull; Real-time fuel tracking</p>
      </footer>
    </div>
  );
};
