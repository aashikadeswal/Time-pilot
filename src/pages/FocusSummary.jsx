import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function FocusSummary({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, focusHistory, logFocusSession, toggleTaskCompleted } = useTimePilot();

  const sessionData = location.state || {
    secondsLogged: 2700, // 45 mins
    category: 'Political Science Revision',
    goalId: 'g-1',
    completed: true,
    task: null
  };

  const loggedMins = Math.max(1, Math.round(sessionData.secondsLogged / 60));

  const [selectedSentiment, setSelectedSentiment] = useState('Focused');
  const [distractionReason, setDistractionReason] = useState('');
  const [markTaskAsDone, setMarkTaskAsDone] = useState(true);

  const sentiments = [
    { name: 'Focused', label: 'Focused', icon: 'sentiment_very_satisfied' },
    { name: 'Mostly focused', label: 'Mostly focused', icon: 'sentiment_satisfied' },
    { name: 'Distracted', label: 'Distracted', icon: 'sentiment_dissatisfied' }
  ];

  const distractionOptions = [
    'Phone / Social Media',
    'Fatigue / Low Energy',
    'Noisy Environment',
    'Unclear Task Next Step',
    'Hunger / Need Break'
  ];

  const handleSave = () => {
    logFocusSession({
      category: sessionData.category || 'Deep Focus',
      goalId: sessionData.goalId,
      secondsLogged: sessionData.secondsLogged,
      completed: sessionData.completed,
      sentiment: selectedSentiment,
      distractionReason
    });

    if (sessionData.task && markTaskAsDone) {
      toggleTaskCompleted(sessionData.task.id);
    }

    navigate('/dashboard');
  };

  // Focus History Stats
  const totalFocusSecs = focusHistory.reduce((sum, s) => sum + (s.secondsLogged || 0), 0);
  const totalFocusMins = Math.round(totalFocusSecs / 60);
  const totalHours = Math.floor(totalFocusMins / 60);
  const totalRemainder = totalFocusMins % 60;
  const avgSessionMins = focusHistory.length > 0 ? Math.round(totalFocusMins / focusHistory.length) : 0;

  return (
    <Layout title="Focus" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in relative text-left max-w-xl mx-auto pb-16">
        
        {/* Main session complete feedback card */}
        <section className="px-margin-mobile pt-stack-sm flex flex-col items-center text-center w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-headline-lg-mobile text-on-surface tracking-tight font-bold">Session Complete</h1>
          <p className="text-body-md text-on-surface-variant font-medium mt-0.5">
            Great deep work, {user.name}. You're making intentional progress.
          </p>
          
          <div className="bg-surface-container rounded-2xl p-4 w-full mt-4 shadow-sm flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">timer</span>
              <div className="text-left">
                <span className="text-[11px] text-on-surface-variant block font-bold uppercase tracking-wider">Time Logged</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold text-lg">
                  {loggedMins} {loggedMins === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold">
              {sessionData.category}
            </span>
          </div>
        </section>

        {/* Sentiment & Reflection Selection */}
        <section className="px-margin-mobile w-full flex flex-col gap-3">
          <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            How did it go?
          </h3>
          <div className="grid grid-cols-3 gap-2 w-full">
            {sentiments.map((s) => {
              const isSelected = selectedSentiment === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSentiment(s.name)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl hover:bg-surface-container transition-all border active:scale-95 ${
                    isSelected 
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-sm' 
                      : 'bg-surface-container-low border-transparent text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {s.icon}
                  </span>
                  <span className="text-xs mt-1 font-bold">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Optional: What got in the way? */}
          {selectedSentiment === 'Distracted' && (
            <div className="animate-fade-in mt-1 space-y-2 bg-surface-container rounded-xl p-4">
              <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">
                What got in the way? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {distractionOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDistractionReason(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      distractionReason === opt 
                        ? 'bg-primary text-on-primary font-bold' 
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mark task completed checkbox */}
          {sessionData.task && (
            <label className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container">
              <input
                type="checkbox"
                checked={markTaskAsDone}
                onChange={(e) => setMarkTaskAsDone(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-xs font-semibold text-on-surface">
                Mark <strong>"{sessionData.task.name}"</strong> as completed in today's plan
              </span>
            </label>
          )}
          
          <button
            onClick={handleSave}
            className="mt-2 w-full py-3.5 bg-primary text-on-primary font-label-md rounded-xl hover:bg-surface-tint transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 font-bold text-sm"
          >
            Save Session & Return to Dashboard
          </button>
        </section>

        {/* Focus History & Analytics Overview */}
        <section className="px-margin-mobile mt-4 w-full">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Focus History</h2>
              <span className="text-xs text-on-surface-variant font-medium">Recent deep work sessions</span>
            </div>
          </div>

          {/* High level stats cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-surface-container rounded-xl p-3 text-center">
              <span className="text-[11px] text-on-surface-variant font-bold block uppercase">Total Time</span>
              <span className="text-headline-md font-bold text-primary text-base">
                {totalHours}h {totalRemainder}m
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 text-center">
              <span className="text-[11px] text-on-surface-variant font-bold block uppercase">Sessions</span>
              <span className="text-headline-md font-bold text-on-surface text-base">
                {focusHistory.length}
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 text-center">
              <span className="text-[11px] text-on-surface-variant font-bold block uppercase">Avg Session</span>
              <span className="text-headline-md font-bold text-secondary text-base">
                {avgSessionMins}m
              </span>
            </div>
          </div>
          
          {/* History Item list */}
          <div className="flex flex-col gap-2">
            {focusHistory.map((item) => (
              <div key={item.id} className="bg-surface-container rounded-xl p-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className="w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">
                    {item.sentiment === 'Focused' ? 'sentiment_very_satisfied' : 'timer'}
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="font-body-md text-on-surface font-bold text-sm">{item.category}</span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {item.sentiment || 'Completed'} • {item.timestamp}
                  </span>
                </div>
                <span className="text-primary font-label-md font-bold text-sm">
                  {Math.round(item.secondsLogged / 60)} min
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
