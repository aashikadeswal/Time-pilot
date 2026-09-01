import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSeeHowItWorks = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header bar for landing page */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl pt-safe">
        <div className="h-16 px-margin-mobile md:px-margin-desktop flex items-center justify-between max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-unit">
            <img 
              alt="Time Pilot Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCslErK6s2lCkDNyZ2YOOGLf-JGepN3jvVXxoojPdywhtPyW4YP7jE4ECVYfiqa4gBX8_Np3BR2citj5Tq0wX40thWhDmUKzJq7kwIvjhE5GkPqdXYhWQvxCx6KJAm5qBOWsvUymbI9PHE0a4mWynx9N9ZMq7UTWreCx5BWiznE5LwW5eZfVOgWYpdeztD-NiK3aT1LzPhaHFLuY2k_yrsiHYQUd4N5DmNbnIKfKOliXMKHPVrP1xaH6w"
            />
            <span className="font-headline-md text-headline-md text-primary font-bold">Time Pilot</span>
          </div>
          <button 
            onClick={() => navigate('/signin')}
            className="text-primary font-semibold hover:underline text-label-md"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="flex-1 pt-16 flex flex-col">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg min-h-[618px] bg-surface relative overflow-hidden">
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
            
            <div className="z-10 flex flex-col items-center text-center max-w-3xl w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/20 text-on-surface-variant rounded-full text-label-sm mb-stack-md select-none">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Now in public beta
              </div>
              <h1 className="text-display md:text-[56px] text-on-surface mb-stack-md leading-tight tracking-tight">
                Make better use of the time <span className="text-primary">you already have.</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant mb-stack-lg max-w-2xl">
                Time Pilot helps students understand their available time, plan what matters, stay focused, and make meaningful progress without the overwhelm.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-stack-sm w-full sm:w-auto justify-center items-center">
                <button 
                  onClick={() => navigate('/onboarding/goals')}
                  className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-surface-tint transition-all active:scale-95 shadow-md shadow-primary/20 w-full sm:w-auto"
                >
                  Get Started
                </button>
                <button 
                  onClick={handleSeeHowItWorks}
                  className="bg-surface text-primary outline outline-1 outline-primary/30 px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-surface-container transition-all active:scale-95 w-full sm:w-auto mt-2 sm:mt-0"
                >
                  See How It Works
                </button>
              </div>
              <p className="mt-4 text-label-md text-on-surface-variant">
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/signin')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-stack-lg z-10 w-full max-w-container-max relative perspective-[1000px]">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl bg-surface-container-highest shadow-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ease-out">
                {/* Mock UI Header */}
                <div className="h-10 bg-surface-container border-b border-outline-variant/30 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/80"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/80"></div>
                  </div>
                </div>
                {/* Mock UI Content */}
                <div 
                  className="w-full h-full bg-cover bg-top" 
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAc-ktPBh5KppRYS7leub_465uHzPFB6I_r-UNV5Io3HPakKSZFN6Cctr-n2WIrIxlTMXt2EDACdRmZLan_t_iSuHgYjtAMuPqZu9S_t1GqZiHvcjcJ2NLvmdHHD6hYqB_kR2eIR-aV3HekFdQytfUuTzdDaQ79OyWLmjZTmZ-xWax8-r3KajTphO4cLl6d4d65G_E66gbMUVrHl06cJ_YnAL-QYm2I5zHbkf54xWV423jHblR964hdsA')"
                  }}
                ></div>
                {/* Floating Elements */}
                <div className="absolute bottom-4 right-4 bg-surface-container-lowest p-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </div>
                  <div className="text-left">
                    <div className="text-label-sm text-on-surface font-semibold">Deep Work Complete</div>
                    <div className="text-[10px] text-on-surface-variant">2 hours logged</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section id="features-section" className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-low">
            <div className="max-w-container-max mx-auto w-full">
              <div className="text-center mb-stack-lg">
                <h2 className="text-headline-lg md:text-display text-on-surface mb-unit">Designed for the student workflow</h2>
                <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to manage cognitive labor, built into a quiet, reliable assistant.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* Understand Your Time */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">schedule</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-semibold">Understand Your Time</h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1">Visualize your week clearly. See exactly how much time you have available between classes, shifts, and life.</p>
                  <div className="mt-auto bg-surface-container-low rounded-lg p-3 relative overflow-hidden h-32 flex items-end">
                    {/* Abstract Chart SVG */}
                    <svg className="w-full h-24 text-tertiary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d="M0,40 L0,20 Q10,10 20,25 T40,15 T60,30 T80,10 T100,20 L100,40 Z" fill="currentColor"></path>
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-2">
                      <div className="w-8 h-16 bg-tertiary rounded-t-md opacity-80"></div>
                      <div className="w-8 h-20 bg-surface-variant rounded-t-md"></div>
                      <div className="w-8 h-12 bg-surface-variant rounded-t-md"></div>
                      <div className="w-8 h-24 bg-tertiary rounded-t-md opacity-80"></div>
                      <div className="w-8 h-10 bg-surface-variant rounded-t-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decide What Matters */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">playlist_add_check</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-semibold">Decide What Matters</h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1">Prioritize tasks intentionally. Drag and drop assignments into your available blocks to create a realistic plan.</p>
                  <div className="mt-auto bg-surface-container-low rounded-lg p-3 space-y-2">
                    <div className="bg-surface-container-lowest p-2 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                      <div className="h-2 w-1/2 bg-surface-variant rounded-full"></div>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-md shadow-sm flex items-center gap-2 ml-4">
                      <div className="w-4 h-4 rounded-full border-2 border-outline-variant"></div>
                      <div className="h-2 w-2/3 bg-surface-variant rounded-full"></div>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-outline-variant"></div>
                      <div className="h-2 w-1/3 bg-surface-variant rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Focus Without Distractions */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">center_focus_strong</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-semibold">Focus Without Distractions</h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1">Enter a quiet mode during deep work. The interface fades back, leaving only the task at hand and a gentle timer.</p>
                  <div className="mt-auto bg-surface-container-low rounded-lg p-4 flex items-center justify-center h-32">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2"></path>
                        <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeWidth="2"></path>
                      </svg>
                      <span className="text-label-sm font-semibold text-on-surface">25:00</span>
                    </div>
                  </div>
                </div>

                {/* Learn From Your Week */}
                <div className="bg-surface-container-lowest rounded-2xl p-stack-md flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed-dim/30 flex items-center justify-center text-on-tertiary-fixed-variant mb-stack-sm">
                    <span className="material-symbols-outlined text-headline-md">insights</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-unit font-semibold">Learn From Your Week</h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-sm flex-1">Review your patterns without judgment. See where your time actually went and adjust for next week.</p>
                  <div className="mt-auto bg-surface-container-low rounded-lg p-4 flex items-center justify-between h-32 gap-2">
                    <div className="flex-1 h-full flex flex-col justify-end gap-1">
                      <div className="h-[60%] bg-tertiary-fixed-dim rounded-md"></div>
                      <div className="text-[10px] text-center text-on-surface-variant">Mon</div>
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-end gap-1">
                      <div className="h-[80%] bg-tertiary-fixed-dim rounded-md"></div>
                      <div className="text-[10px] text-center text-on-surface-variant">Tue</div>
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-end gap-1">
                      <div className="h-[40%] bg-tertiary-fixed-dim rounded-md"></div>
                      <div className="text-[10px] text-center text-on-surface-variant">Wed</div>
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-end gap-1">
                      <div className="h-[90%] bg-tertiary-fixed-dim rounded-md"></div>
                      <div className="text-[10px] text-center text-on-surface-variant">Thu</div>
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-end gap-1">
                      <div className="h-[50%] bg-tertiary-fixed-dim rounded-md"></div>
                      <div className="text-[10px] text-center text-on-surface-variant">Fri</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface text-center">
            <div className="max-w-2xl mx-auto">
              <h2 class="text-headline-lg md:text-display text-on-surface mb-unit font-bold">Ready to pilot your time?</h2>
              <p className="text-body-lg text-on-surface-variant mb-stack-md">Join thousands of students who have replaced hustle with intention.</p>
              <button 
                onClick={() => navigate('/onboarding/goals')}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl text-label-md font-semibold hover:bg-surface-tint transition-all active:scale-95 shadow-md shadow-primary/20"
              >
                Start Free Trial
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
