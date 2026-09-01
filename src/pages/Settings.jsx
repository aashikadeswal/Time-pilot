import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function Settings({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const fetched = await api.fetchSettings();
      setNotifications(fetched.notifications);
      setAutoSchedule(fetched.autoSchedule);
      setDailyDigest(fetched.dailyDigest);
    }
    loadSettings();
  }, []);

  const handleToggleNotifications = async () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    await api.saveSettings({
      notifications: nextVal,
      autoSchedule,
      dailyDigest
    });
  };

  const handleToggleAutoSchedule = async () => {
    const nextVal = !autoSchedule;
    setAutoSchedule(nextVal);
    await api.saveSettings({
      notifications,
      autoSchedule: nextVal,
      dailyDigest
    });
  };

  const handleToggleDailyDigest = async () => {
    const nextVal = !dailyDigest;
    setDailyDigest(nextVal);
    await api.saveSettings({
      notifications,
      autoSchedule,
      dailyDigest: nextVal
    });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Layout title="Settings" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full pb-safe text-left animate-fade-in">
        
        {/* Profile Card */}
        <section className="flex items-center gap-4 p-margin-mobile bg-surface-container rounded-2xl mb-stack-lg shadow-sm">
          <img 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALzdez3qfxdaYGTtcpF7k1j9YIRBuRJdmDCUmHeonyv3vuiXbTz_IF6H3fb-1D-b7e5DKaINv9mWHH-WztaVO9UvO24fHBjV18v3n9-enf-quau4qT67eXETDT9R2SuQprf6N5UlafzatCcjOJVOswGRbN4GrOBgbTeSmWtBdXjlsFSZ6NkZmKA9gPlcU4ATcKzExG61kRp59D_YWZjX88oaSUWTvqUTeb3e7d8R6WKELXbdtMUgzREg"
          />
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Sam</h2>
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">sam@example.com</span>
          </div>
        </section>

        {/* Settings Group: Account */}
        <section className="flex flex-col gap-unit mb-stack-lg">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest pl-2 font-bold">Account</h3>
          
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Edit Profile</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </button>
            
            <div className="h-px bg-surface-variant/20 mx-4"></div>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Change Password</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </button>
            
            <div className="h-px bg-surface-variant/20 mx-4"></div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Push Notifications</span>
              </div>
              <button 
                onClick={handleToggleNotifications}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  notifications ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  notifications ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Settings Group: Pilot Settings */}
        <section className="flex flex-col gap-unit mb-stack-lg">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest pl-2 font-bold">Pilot Settings</h3>
          
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
            {/* Auto schedule toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">smart_toy</span>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">Smart Scheduling</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">Let AI helper balance task sizes</span>
                </div>
              </div>
              <button 
                onClick={handleToggleAutoSchedule}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  autoSchedule ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  autoSchedule ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
            
            <div className="h-px bg-surface-variant/20 mx-4"></div>

            {/* Daily Digest toggle */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">today</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Daily Focus Digest</span>
              </div>
              <button 
                onClick={handleToggleDailyDigest}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  dailyDigest ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  dailyDigest ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
            
            <div className="h-px bg-surface-variant/20 mx-4"></div>

            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">track_changes</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Focus Milestones</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Settings Group: Support & Danger Zone */}
        <section className="flex flex-col gap-unit">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest pl-2 font-bold">Support</h3>
          
          <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-high transition-colors text-left group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">help_center</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">Help Center</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </button>
            
            <div className="h-px bg-surface-variant/20 mx-4"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-error/5 text-error transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error">logout</span>
                <span className="font-body-md text-body-md font-bold">Log Out</span>
              </div>
              <span className="material-symbols-outlined text-error/60 group-hover:translate-x-0.5 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

      </div>
    </Layout>
  );
}
