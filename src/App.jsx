import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimePilotProvider } from './context/TimePilotContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import OnboardingGoals from './pages/OnboardingGoals';
import OnboardingTypicalDay from './pages/OnboardingTypicalDay';
import OnboardingSchedule from './pages/OnboardingSchedule';
import Dashboard from './pages/Dashboard';
import DailyPlanning from './pages/DailyPlanning';
import Timeline from './pages/Timeline';
import FocusCenter from './pages/FocusCenter';
import FocusSummary from './pages/FocusSummary';
import AICoach from './pages/AICoach';
import WeeklyReview from './pages/WeeklyReview';
import Settings from './pages/Settings';

export default function App() {
  // Dark mode state: load from localStorage, fallback to system preference, then dark
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('timepilot_theme');
    if (saved !== null) return saved === 'dark';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return false;
    return true;
  });

  // Sync dark mode class on document element and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('timepilot_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <TimePilotProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes — Landing and Auth */}
            <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/signin" element={<SignIn darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/signup" element={<SignUp darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />} />
            
            {/* Onboarding 3-Step Flow (requires auth) */}
            <Route path="/onboarding/goals" element={
              <ProtectedRoute>
                <OnboardingGoals darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/typical-day" element={
              <ProtectedRoute>
                <OnboardingTypicalDay darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/schedule" element={
              <ProtectedRoute>
                <OnboardingSchedule darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            
            {/* Authenticated Application Views */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/planning" element={
              <ProtectedRoute>
                <DailyPlanning darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/timeline" element={
              <ProtectedRoute>
                <Timeline darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/focus" element={
              <ProtectedRoute>
                <FocusCenter darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/focus/summary" element={
              <ProtectedRoute>
                <FocusSummary darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/ai-coach" element={
              <ProtectedRoute>
                <AICoach darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/review" element={
              <ProtectedRoute>
                <WeeklyReview darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            } />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TimePilotProvider>
    </AuthProvider>
  );
}
