import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, title, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Plan', path: '/timeline', icon: 'assignment', altPaths: ['/planning'] },
    { name: 'Focus', path: '/focus', icon: 'timer', altPaths: ['/focus/summary'] },
    { name: 'AI', path: '/ai-coach', icon: 'auto_awesome' },
    { name: 'Review', path: '/review', icon: 'bar_chart' }
  ];

  const isActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.altPaths && item.altPaths.includes(location.pathname)) return true;
    return false;
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin-mobile flex items-center justify-between">
          <div className="flex items-center gap-unit">
            {location.pathname === '/settings' && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 -ml-2 flex items-center justify-center text-primary active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <img 
              alt="Time Pilot Logo" 
              className="h-8 w-auto object-contain cursor-pointer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCslErK6s2lCkDNyZ2YOOGLf-JGepN3jvVXxoojPdywhtPyW4YP7jE4ECVYfiqa4gBX8_Np3BR2citj5Tq0wX40thWhDmUKzJq7kwIvjhE5GkPqdXYhWQvxCx6KJAm5qBOWsvUymbI9PHE0a4mWynx9N9ZMq7UTWreCx5BWiznE5LwW5eZfVOgWYpdeztD-NiK3aT1LzPhaHFLuY2k_yrsiHYQUd4N5DmNbnIKfKOliXMKHPVrP1xaH6w"
              onClick={() => navigate('/dashboard')}
            />
            <span className="font-headline-md text-headline-md text-primary font-semibold select-none">
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors active:scale-90"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            {/* Profile Avatar */}
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all active:scale-95" 
              onClick={() => navigate('/settings')}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALzdez3qfxdaYGTtcpF7k1j9YIRBuRJdmDCUmHeonyv3vuiXbTz_IF6H3fb-1D-b7e5DKaINv9mWHH-WztaVO9UvO24fHBjV18v3n9-enf-quau4qT67eXETDT9R2SuQprf6N5UlafzatCcjOJVOswGRbN4GrOBgbTeSmWtBdXjlsFSZ6NkZmKA9gPlcU4ATcKzExG61kRp59D_YWZjX88oaSUWTvqUTeb3e7d8R6WKELXbdtMUgzREg"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-24 bg-surface px-margin-mobile">
        {children}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 px-unit">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 w-full transition-colors active:scale-95 ${
                  active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
                  {item.icon}
                </span>
                <span className="font-label-sm text-label-sm">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
