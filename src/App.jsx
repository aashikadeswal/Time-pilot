import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import OnboardingGoals from './pages/OnboardingGoals';
import OnboardingTypicalDay from './pages/OnboardingTypicalDay';
import Dashboard from './pages/Dashboard';
import DailyPlanning from './pages/DailyPlanning';
import Timeline from './pages/Timeline';
import FocusCenter from './pages/FocusCenter';
import FocusSummary from './pages/FocusSummary';
import AICoach from './pages/AICoach';
import WeeklyReview from './pages/WeeklyReview';
import Settings from './pages/Settings';

export default function App() {
  // Dark mode state: default to dark theme as Chronos Flow system description highlights it as the focused sanctuary
  const [darkMode, setDarkMode] = useState(true);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing and Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Onboarding */}
        <Route path="/onboarding/goals" element={<OnboardingGoals />} />
        <Route path="/onboarding/typical-day" element={<OnboardingTypicalDay />} />
        
        {/* Authenticated Application Views */}
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/planning" element={<DailyPlanning darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/timeline" element={<Timeline darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/focus" element={<FocusCenter darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/focus/summary" element={<FocusSummary darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/ai-coach" element={<AICoach darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/review" element={<WeeklyReview darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
