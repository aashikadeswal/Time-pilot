import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTimePilot } from '../context/TimePilotContext';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useTimePilot();
  const { logout, user: authUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = authUser?.name || user?.name || 'User';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Plan', path: '/planning', icon: 'playlist_add_check' },
    { name: 'Timeline', path: '/timeline', icon: 'schedule' },
    { name: 'Focus', path: '/focus', icon: 'center_focus_strong', altPaths: ['/focus/summary'] },
    { name: 'Review', path: '/review', icon: 'insights' }
  ];

  const isActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.altPaths && item.altPaths.includes(location.pathname)) return true;
    return false;
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] pt-safe transition-transform duration-300">
        <div className="h-14 md:h-16 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {location.pathname === '/settings' && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 -ml-2 flex items-center justify-center text-primary active:scale-95 transition-transform rounded-xl hover:bg-primary/5"
                title="Go Back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <img 
              alt="TimePilot Logo" 
              className="h-7 md:h-8 w-auto object-contain cursor-pointer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCslErK6s2lCkDNyZ2YOOGLf-JGepN3jvVXxoojPdywhtPyW4YP7jE4ECVYfiqa4gBX8_Np3BR2citj5Tq0wX40thWhDmUKzJq7kwIvjhE5GkPqdXYhWQvxCx6KJAm5qBOWsvUymbI9PHE0a4mWynx9N9ZMq7UTWreCx5BWiznE5LwW5eZfVOgWYpdeztD-NiK3aT1LzPhaHFLuY2k_yrsiHYQUd4N5DmNbnIKfKOliXMKHPVrP1xaH6w"
              onClick={() => navigate('/dashboard')}
            />
            <span 
              onClick={() => navigate('/dashboard')}
              className="font-headline-md text-headline-md text-primary font-bold select-none cursor-pointer hidden sm:inline"
            >
              TimePilot
            </span>
            {title && (
              <span className="sm:hidden text-xs font-bold text-on-surface-variant truncate max-w-[120px] ml-1">
                / {title}
              </span>
            )}
          </div>
          
          {/* Desktop Navigation (inline in header) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            {/* AI Coach Action Button */}
            <button
              onClick={() => navigate('/ai-coach')}
              className={`h-9 px-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 font-bold text-xs ${
                location.pathname === '/ai-coach'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/20'
              }`}
              title="TimePilot AI Coach"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all active:scale-90"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[18px]">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            
            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative group"
                title={`${displayName} - Menu`}
              >
                {user?.avatar ? (
                  <img 
                    alt="Profile" 
                    className="w-8 h-8 rounded-xl object-cover cursor-pointer ring-2 ring-transparent group-hover:ring-primary/30 transition-all active:scale-95 border border-outline-variant/20" 
                    src={user.avatar}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center cursor-pointer ring-2 ring-transparent group-hover:ring-primary/30 transition-all active:scale-95 border border-outline-variant/20">
                    <span className="text-on-primary-container font-bold text-xs">{displayName.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-outline-variant/20">
                      <p className="text-label-md text-on-surface font-bold truncate">{displayName}</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{authUser?.email || user?.email || ''}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                        className="w-full px-4 py-2.5 text-left text-label-md text-on-surface hover:bg-surface-container flex items-center gap-3 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">settings</span>
                        Settings & Profile
                      </button>
                      <button
                        onClick={() => { setShowProfileMenu(false); logout(); navigate('/'); }}
                        className="w-full px-4 py-2.5 text-left text-label-md text-error hover:bg-error-container/10 flex items-center gap-3 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 md:pt-16 pb-20 lg:pb-8 bg-surface px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav Bar — mobile and tablet only */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] lg:hidden transition-transform duration-300">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 w-full py-1 transition-all active:scale-95 rounded-xl ${
                  active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${
                  active ? 'bg-primary/12' : ''
                }`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-[10px] font-semibold leading-tight">
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
