import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function FocusCenter({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, activeFocusTask, setActiveFocusTask } = useTimePilot();

  // Selected task to focus on
  const passedTask = location.state?.task || activeFocusTask || tasks.find(t => !t.completed) || {
    name: 'Political Science Revision',
    category: 'Studies',
    duration: 45,
    id: 'default'
  };

  const [selectedTask, setSelectedTask] = useState(passedTask);
  const [mode, setMode] = useState('countdown'); // countdown, stopwatch, pomodoro
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState((passedTask.duration || 30) * 60);
  const [totalSeconds, setTotalSeconds] = useState((passedTask.duration || 30) * 60);

  const timerRef = useRef(null);

  const getDefaults = (m) => {
    if (m === 'countdown') return { s: (selectedTask.duration || 45) * 60 };
    if (m === 'stopwatch') return { s: 0 };
    if (m === 'pomodoro') return { s: 1500 }; // 25 min
    return { s: 1800 };
  };

  const handleModeChange = (m) => {
    if (isRunning) return;
    setMode(m);
    const defaults = getDefaults(m);
    setSeconds(defaults.s);
    setTotalSeconds(defaults.s || 1);
  };

  const selectQuickTime = (mins) => {
    if (isRunning) return;
    setSeconds(mins * 60);
    setTotalSeconds(mins * 60);
  };

  const handleTaskChange = (taskId) => {
    if (isRunning) return;
    const t = tasks.find(item => item.id === taskId);
    if (t) {
      setSelectedTask(t);
      setActiveFocusTask(t);
      if (mode === 'countdown') {
        const s = (t.duration || 30) * 60;
        setSeconds(s);
        setTotalSeconds(s);
      }
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    // Hide standard layout header and navbar for deep focus
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    if (nav) nav.style.transform = 'translateY(100%)';
    if (header) header.style.transform = 'translateY(-100%)';
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = (completed = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let elapsed = 0;
    if (mode === 'stopwatch') {
      elapsed = seconds;
    } else {
      elapsed = totalSeconds - seconds;
    }

    // Restore standard layout elements
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    if (nav) nav.style.transform = 'translateY(0)';
    if (header) header.style.transform = 'translateY(0)';

    setIsRunning(false);
    setIsPaused(false);

    // Navigate to summary page
    navigate('/focus/summary', { 
      state: { 
        task: selectedTask,
        secondsLogged: Math.max(elapsed, 15),
        category: selectedTask.name || selectedTask.category || 'Deep Focus',
        goalId: selectedTask.goalId,
        completed: completed || elapsed >= totalSeconds
      } 
    });
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'stopwatch') {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleStop(true);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, mode]);

  const formatTime = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'stopwatch' 
    ? 100 
    : ((totalSeconds - seconds) / totalSeconds) * 100;

  const strokeDasharray = 2 * Math.PI * 15.9155;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercent) / 100;

  return (
    <Layout title="Focus" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full h-full relative items-center justify-center min-h-[72vh] pb-12 select-none text-center">
        
        {/* Ambient Immersive Background Glow */}
        <div 
          className={`absolute inset-0 rounded-2xl z-0 transition-all duration-700 pointer-events-none ${
            isRunning ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(2,100,93,0.35) 0%, rgba(18,20,19,0.95) 75%)'
          }}
        ></div>

        <div className="z-10 flex flex-col items-center w-full max-w-md gap-stack-md relative">
          
          {/* Mode Selector */}
          <div 
            className={`w-full flex justify-between bg-surface-container rounded-full p-1 relative z-20 transition-all duration-500 ${
              isRunning ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
          >
            {['countdown', 'stopwatch', 'pomodoro'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`flex-1 py-2 text-label-sm rounded-full capitalize font-bold transition-all duration-300 ${
                  mode === m 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Current Task Selector / Card */}
          {!isRunning ? (
            <div className="w-full bg-surface-container/70 border border-outline-variant/30 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[11px] uppercase tracking-wider text-primary font-bold">Current Target</span>
              <select
                value={selectedTask.id}
                onChange={(e) => handleTaskChange(e.target.value)}
                className="w-full bg-surface-container text-on-surface font-bold text-base rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duration}m • {t.priority})
                  </option>
                ))}
              </select>
              <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium mt-1">
                <span>Category: <strong className="text-on-surface">{selectedTask.category || 'Studies'}</strong></span>
                <span>Priority: <strong className="text-primary">{selectedTask.priority || 'High'}</strong></span>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                {selectedTask.category || 'Deep Focus'}
              </span>
              <h2 className="text-headline-md text-on-surface font-bold mt-2 text-[20px]">
                {selectedTask.name}
              </h2>
            </div>
          )}

          {/* Timer Visual Ring */}
          <div 
            className={`flex flex-col items-center justify-center p-4 transition-all duration-500 ease-out ${
              isRunning ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="relative w-64 h-64 flex flex-col items-center justify-center">
              {mode !== 'stopwatch' && (
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-surface-variant" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  ></path>
                  <path 
                    className="text-primary transition-all duration-1000 ease-linear" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeDasharray={`${strokeDasharray}, ${strokeDasharray}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </svg>
              )}

              {/* Display Digits */}
              <div className="relative flex flex-col items-center z-10">
                <span className={`font-display text-[64px] font-bold tracking-tight transition-colors ${
                  isRunning ? 'text-primary' : 'text-on-surface'
                }`}>
                  {formatTime(seconds)}
                </span>
                <span className={`font-label-sm text-xs uppercase tracking-widest mt-1 font-bold ${
                  isRunning ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                  {isPaused ? 'PAUSED' : isRunning ? 'IN FOCUS' : mode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Select Preset Times */}
          {!isRunning && mode !== 'stopwatch' && (
            <div className="flex gap-2 flex-wrap justify-center relative z-20 animate-fade-in">
              {[15, 25, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => selectQuickTime(mins)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    seconds === mins * 60 
                      ? 'bg-primary-container text-on-primary-container ring-1 ring-primary' 
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          )}

          {/* Action Control Buttons */}
          <div className="w-full flex justify-center items-center relative z-20 mt-2 min-h-[80px]">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(2,100,93,0.3)] hover:shadow-[0_12px_40px_rgba(2,100,93,0.4)] transition-all duration-500 ease-out active:scale-90 hover:scale-105"
                title="Start Focus Session"
              >
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-8 animate-fade-in">
                {/* Pause/Resume */}
                <button
                  onClick={handlePause}
                  className="w-14 h-14 bg-surface-container-highest/80 hover:bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isPaused ? 'play_arrow' : 'pause'}
                  </span>
                </button>
                
                {/* Stop & End */}
                <button
                  onClick={() => handleStop(false)}
                  className="w-16 h-16 bg-error text-on-error rounded-full flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all"
                  title="End Session"
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stop
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
