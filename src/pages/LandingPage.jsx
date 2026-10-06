import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSeeHowItWorks = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById('how-it-works-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-container pt-safe">
        <div className="h-16 px-margin-mobile md:px-margin-desktop flex items-center justify-between max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-unit cursor-pointer" onClick={() => navigate('/')}>
            <img 
              alt="Time Pilot Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCslErK6s2lCkDNyZ2YOOGLf-JGepN3jvVXxoojPdywhtPyW4YP7jE4ECVYfiqa4gBX8_Np3BR2citj5Tq0wX40thWhDmUKzJq7kwIvjhE5GkPqdXYhWQvxCx6KJAm5qBOWsvUymbI9PHE0a4mWynx9N9ZMq7UTWreCx5BWiznE5LwW5eZfVOgWYpdeztD-NiK3aT1LzPhaHFLuY2k_yrsiHYQUd4N5DmNbnIKfKOliXMKHPVrP1xaH6w"
            />
            <span className="font-headline-md text-headline-md text-primary font-bold">TimePilot</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/focus')}
              className="hidden sm:inline-flex items-center gap-1 text-on-surface-variant hover:text-primary text-label-md font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">timer</span>
              Focus Timer
            </button>
            <button 
              onClick={() => navigate('/signin')}
              className="text-primary font-semibold hover:underline text-label-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 flex flex-col">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg min-h-[600px] bg-surface relative overflow-hidden text-center">
            {/* Ambient Background Graphic */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <radialGradient cx="50%" cy="50%" id="hero-glow" r="50%">
                    <stop offset="0%" stopColor="#02645d"></stop>
                    <stop offset="100%" stopColor="transparent"></stop>
                  </radialGradient>
                </defs>
                <rect fill="url(#hero-glow)" height="100" width="100"></rect>
              </svg>
            </div>
            
            <div className="z-10 flex flex-col items-center max-w-3xl w-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-container/20 border border-primary/20 text-on-surface rounded-full text-label-sm mb-stack-md select-none">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-semibold text-primary">Student-focused time architecture</span>
              </div>
              
              <h1 className="text-display md:text-[54px] text-on-surface mb-stack-md leading-tight tracking-tight font-bold">
                TimePilot helps students <span className="text-primary">plan real time,</span> focus on important work, and adjust when plans change.
              </h1>
              
              <p className="text-body-lg text-on-surface-variant mb-stack-lg max-w-2xl font-medium">
                Know what to do right now, see how much flexible study time you truly have, and recover seamlessly when today doesn't go as planned.
              </p>
              
              {/* Primary and Secondary CTAs */}
              <div className="flex flex-col sm:flex-row gap-stack-sm w-full sm:w-auto justify-center items-center">
                <button 
                  onClick={() => navigate('/onboarding/goals')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-bold hover:bg-surface-tint transition-all active:scale-95 shadow-md shadow-primary/20 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  Create My Schedule
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button 
                  onClick={handleSeeHowItWorks}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 px-8 py-4 rounded-xl text-label-md font-bold transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                  See How It Works
                </button>
              </div>

              <p className="mt-4 text-label-md text-on-surface-variant font-medium">
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/signin')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Core Experience Workflow Strip */}
            <div id="how-it-works-section" className="mt-stack-lg z-10 w-full max-w-4xl pt-8">
              <div className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold mb-4">
                The Core TimePilot Workflow
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { step: '1', title: 'Commitments', icon: 'schedule', desc: 'Add fixed classes' },
                  { step: '2', title: 'Plan', icon: 'playlist_add_check', desc: 'Set daily goals' },
                  { step: '3', title: 'Schedule', icon: 'calendar_month', desc: 'Check true capacity' },
                  { step: '4', title: 'Focus', icon: 'center_focus_strong', desc: 'Deep work timer' },
                  { step: '5', title: 'Adapt', icon: 'tune', desc: 'Recover missed tasks' },
                  { step: '6', title: 'Review', icon: 'insights', desc: 'Weekly reflection' }
                ].map((item) => (
                  <div key={item.step} className="bg-surface-container/80 backdrop-blur-md rounded-xl p-3 border border-outline-variant/20 flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1.5 font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    </div>
                    <span className="font-label-sm text-on-surface font-bold text-[13px]">{item.title}</span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Interactive Dashboard Preview Card */}
            <div className="mt-stack-lg z-10 w-full max-w-container-max relative">
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl p-4 md:p-6 text-left">
                {/* Header Mock */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-surface-container">
                  <div>
                    <span className="font-label-sm uppercase tracking-wider text-primary font-bold">Live Preview</span>
                    <h2 className="text-headline-md text-on-surface font-bold">Good afternoon, Ashika</h2>
                    <p className="text-body-md text-on-surface-variant font-medium">You have 2h 15m of flexible study time today.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-bold shadow-sm flex items-center gap-1.5"
                    >
                      Open Full Dashboard
                      <span className="material-symbols-outlined text-[16px]">launch</span>
                    </button>
                  </div>
                </div>

                {/* Recommendation Mock Banner */}
                <div className="mt-4 bg-primary-container text-on-primary-container rounded-xl p-4 md:p-5 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-1.5 text-label-sm font-bold uppercase tracking-wider text-on-primary-container/80">
                        <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                        What Should I Do Now?
                      </div>
                      <p className="font-headline-lg-mobile text-headline-lg-mobile font-bold mt-1">
                        You have 50 minutes before your next commitment.
                      </p>
                      <p className="text-body-md text-on-primary-container/90 mt-1 font-medium">
                        Recommended: <strong className="text-on-primary-container">Political Science Revision — 45 min</strong> (High priority • Fits your available time)
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/focus')}
                      className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-bold shadow-md hover:bg-surface-tint active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      Start Focus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-low">
            <div className="max-w-container-max mx-auto w-full">
              <div className="text-center mb-stack-lg">
                <h2 className="text-headline-lg md:text-display text-on-surface mb-unit font-bold">
                  Designed for real student days
                </h2>
                <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
                  Never get overwhelmed by an unrealistic to-do list. TimePilot respects your real commitments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {/* 1. Realistic Scheduling */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">balance</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-bold text-[20px]">
                    Realistic Scheduling
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1 font-medium">
                    TimePilot checks your fixed classes and study capacity. If your day is over capacity, it alerts you and offers clear adjustments.
                  </p>
                </div>

                {/* 2. Missed-Task Recovery */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">published_with_changes</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-bold text-[20px]">
                    Non-Punitive Recovery
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1 font-medium">
                    Missed a study session? Hit "Recover My Schedule" to reorganize remaining tasks into your evening free blocks without guilt.
                  </p>
                </div>

                {/* 3. Deep Focus & Reflection */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">psychology</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-bold text-[20px]">
                    AI Coach & Review
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1 font-medium">
                    Get grounded insights into how your time was spent and context-aware suggestions for balancing exam prep, classes, and life.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-headline-lg md:text-display text-on-surface mb-unit font-bold">
                Ready to pilot your time?
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-stack-md font-medium">
                Create your realistic schedule in less than two minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={() => navigate('/onboarding/goals')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-bold hover:bg-surface-tint transition-all active:scale-95 shadow-md shadow-primary/20"
                >
                  Create My Schedule
                </button>
                <button 
                  onClick={() => navigate('/focus')}
                  className="bg-surface-container text-on-surface px-8 py-4 rounded-xl text-label-md font-bold hover:bg-surface-container-high transition-all active:scale-95 border border-outline-variant/30"
                >
                  Try Focus Timer
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
