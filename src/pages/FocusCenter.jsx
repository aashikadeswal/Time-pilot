import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function FocusCenter({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('countdown'); // countdown, stopwatch, pomodoro
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(1800); // 30 mins default
  const [totalSeconds, setTotalSeconds] = useState(1800);
  const [sessionLabel, setSessionLabel] = useState('Deep Work');

  const timerRef = useRef(null);

  // Default times
  const getDefaults = (m) => {
    if (m === 'countdown') return { s: 1800, label: 'Deep Work' };
    if (m === 'stopwatch') return { s: 0, label: 'Open Session' };
    if (m === 'pomodoro') return { s: 1500, label: 'Pomodoro • 1/4' };
    return { s: 1800, label: 'Deep Work' };
  };

  const handleModeChange = (m) => {
    if (isRunning) return;
    setMode(m);
    const defaults = getDefaults(m);
    setSeconds(defaults.s);
    setTotalSeconds(defaults.s || 1); // prevent division by zero
    setSessionLabel(defaults.label);
  };

  const selectQuickTime = (mins) => {
    if (isRunning) return;
    setSeconds(mins * 60);
    setTotalSeconds(mins * 60);
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    
    // Hide standard layout header and navbar by adding classes
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    if (nav) nav.style.transform = 'translateY(100%)';
    if (header) header.style.transform = 'translateY(-100%)';
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = (completed = false) => {
    // Stop interval
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate elapsed time
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

    // Reset standard times
    const defaults = getDefaults(mode);
    setSeconds(defaults.s);

    // Navigate to summary page with mock data
    navigate('/focus/summary', { 
      state: { 
        secondsLogged: Math.max(elapsed, 10), // at least log 10s for testing
        category: sessionLabel,
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

  // Progress ring percentage
  const progressPercent = mode === 'stopwatch' 
    ? 100 
    : ((totalSeconds - seconds) / totalSeconds) * 100;

  const strokeDasharray = 2 * Math.PI * 15.9155; // circumference
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercent) / 100;

  return (
    <Layout title="Focus" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full h-full relative items-center justify-center min-h-[70vh] pb-12 select-none">
        
        {/* Ambient Immersive Active Background Layer */}
        <div 
          className={`absolute inset-0 bg-primary-container/20 rounded-2xl z-0 transition-all duration-500 pointer-events-none ${
            isRunning ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(2,100,93,0.3) 0%, rgba(18,20,19,0.9) 70%)'
          }}
        ></div>

        <div className="z-10 flex flex-col items-center w-full max-w-md gap-stack-lg relative">
          
          {/* Header Controls (Modes selector) */}
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
                className={`flex-1 py-2 text-label-sm rounded-full capitalize font-semibold transition-all duration-300 ${
                  mode === m 
                    ? 'bg-primary text-on-primary shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Timer Circle Area */}
          <div 
            className={`flex flex-col items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isRunning ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="relative w-64 h-64 flex flex-col items-center justify-center">
              
              {/* Progress Circle SVG */}
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

              {/* Countdown/Stopwatch display */}
              <div className="relative flex flex-col items-center z-10">
                <span className={`font-display text-[64px] font-bold tracking-tight transition-colors ${
                  isRunning ? 'text-primary' : 'text-on-surface'
                }`}>
                  {formatTime(seconds)}
                </span>
                <span className={`font-label-sm text-label-sm uppercase tracking-widest mt-1 font-bold ${
                  isRunning ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                  {sessionLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Select Options */}
          {!isRunning && mode !== 'stopwatch' && (
            <div className="flex gap-2 flex-wrap justify-center relative z-20 animate-fade-in">
              {[10, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => selectQuickTime(mins)}
                  className={`px-4 py-2 rounded-xl text-label-sm font-semibold transition-all ${
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

          {/* Action Buttons */}
          <div className="w-full flex justify-center items-center relative z-20 mt-4 min-h-[80px]">
            {!isRunning ? (
              /* Start Button */
              <button
                onClick={handleStart}
                className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(2,100,93,0.3)] hover:shadow-[0_12px_40px_rgba(2,100,93,0.4)] transition-all duration-500 ease-out active:scale-90 hover:scale-105"
              >
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            ) : (
              /* Active Timer Controls (Pause & Stop) */
              <div className="flex items-center gap-8 animate-fade-in">
                {/* Pause / Resume Button */}
                <button
                  onClick={handlePause}
                  className="w-14 h-14 bg-surface-container-highest/80 hover:bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isPaused ? 'play_arrow' : 'pause'}
                  </span>
                </button>
                
                {/* Stop Button */}
                <button
                  onClick={() => handleStop()}
                  className="w-16 h-16 bg-error text-on-error rounded-full flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all"
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
