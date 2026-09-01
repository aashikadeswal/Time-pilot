import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function FocusSummary({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract session details passed from FocusCenter, or use default mock values
  const sessionData = location.state || {
    secondsLogged: 1800, // 30 mins
    category: 'Deep Work',
    completed: true
  };

  const loggedMins = Math.round(sessionData.secondsLogged / 60);

  const [selectedSentiment, setSelectedSentiment] = useState('Okay');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      const fetched = await api.fetchFocusHistory();
      setHistory(fetched);
    }
    loadHistory();
  }, []);

  const sentiments = [
    { name: 'Easy', icon: 'sentiment_satisfied' },
    { name: 'Okay', icon: 'sentiment_neutral' },
    { name: 'Difficult', icon: 'sentiment_dissatisfied' }
  ];

  const handleSave = async () => {
    const sessionRecord = {
      id: String(Date.now()),
      category: sessionData.category,
      secondsLogged: Number(sessionData.secondsLogged),
      completed: Boolean(sessionData.completed),
      sentiment: selectedSentiment,
      timestamp: 'Just now'
    };

    // Save session in background and redirect
    await api.logFocusSession(sessionRecord);
    navigate('/dashboard');
  };

  return (
    <Layout title="Focus" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in relative text-left">
        
        {/* Main session complete card */}
        <section className="px-margin-mobile pt-stack-md flex flex-col items-center text-center max-w-sm mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-stack-md">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-headline-lg-mobile text-on-surface tracking-tight font-bold">Session Complete</h1>
          <p className="text-body-md text-on-surface-variant font-medium mt-1">Great job, Sam. You're making steady progress.</p>
          
          <div className="bg-surface-container rounded-xl p-4 w-full mt-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-headline-md">schedule</span>
              <div className="text-left">
                <span className="font-label-sm text-label-sm text-on-surface-variant block font-bold uppercase tracking-wider">Time Logged</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {loggedMins} {loggedMins === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm font-bold">
              {sessionData.category}
            </span>
          </div>
        </section>

        {/* Sentiment Selection */}
        <section className="px-margin-mobile max-w-sm mx-auto w-full flex flex-col gap-stack-sm">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">How did it feel?</h3>
          <div className="flex gap-stack-sm w-full">
            {sentiments.map((s) => {
              const isSelected = selectedSentiment === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSentiment(s.name)}
                  className={`flex-1 flex flex-col items-center justify-center py-stack-sm rounded-lg hover:bg-surface-container transition-all border active:scale-95 ${
                    isSelected 
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-sm' 
                      : 'bg-surface-container-low border-transparent text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-headline-md">
                    {s.icon}
                  </span>
                  <span className="font-label-sm text-label-sm mt-1">{s.name}</span>
                </button>
              );
            })}
          </div>
          
          <button
            onClick={handleSave}
            className="mt-stack-sm w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:bg-surface-tint transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-unit font-bold"
          >
            Save Session
          </button>
        </section>

        {/* Focus History Section */}
        <section className="px-margin-mobile mt-4 max-w-md mx-auto w-full">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md font-bold">Focus History</h2>
          
          <div className="flex flex-col gap-stack-sm">
            {history.map((item) => (
              <div key={item.id} className="bg-surface-container rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-headline-md">
                    {item.category.includes('Math') ? 'calculate' : item.category.includes('Science') ? 'public' : 'menu_book'}
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-semibold">{item.category}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    {item.completed ? 'Completed' : 'Stopped'} • {item.timestamp}
                  </span>
                </div>
                <span className="text-on-surface-variant font-label-md font-bold">{Math.round(item.secondsLogged / 60)} min</span>
              </div>
            ))}
            {history.length === 0 && (
              <p className="font-body-md text-on-surface-variant italic py-4 text-center">No focus sessions logged yet.</p>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}
