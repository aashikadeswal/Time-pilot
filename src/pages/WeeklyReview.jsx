import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function WeeklyReview({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <Layout title="Review" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in pb-12 text-left">
        
        {/* Header Section */}
        <section className="px-margin-mobile flex flex-col gap-unit">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">Weekly reflection</h2>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">Here's how you balanced your time over the past seven days.</p>
        </section>

        {/* Stats Grid */}
        <section className="px-margin-mobile">
          <div className="grid grid-cols-2 gap-unit">
            
            {/* Deep Focus */}
            <div className="bg-surface-container rounded-xl p-stack-md flex flex-col gap-stack-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Deep Focus</span>
              </div>
              <div className="font-display text-display text-on-surface font-bold">
                12<span className="text-headline-md font-headline-md text-on-surface-variant font-medium">h</span> 40<span className="text-headline-md font-headline-md text-on-surface-variant font-medium">m</span>
              </div>
              <div className="mt-auto">
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right font-semibold">+2h from last week</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-stack-md flex flex-col gap-stack-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 opacity-80">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Completed</span>
              </div>
              <div className="font-display text-display font-bold">
                28<span className="text-headline-md font-headline-md opacity-80 font-semibold"> tasks</span>
              </div>
              <div className="mt-auto">
                <div className="w-full bg-secondary-fixed/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="font-label-sm text-label-sm opacity-80 mt-2 text-right font-semibold">Steady pace</p>
              </div>
            </div>

            {/* Flexibility */}
            <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-stack-md flex flex-col gap-stack-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 opacity-80">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Flexibility</span>
              </div>
              <div className="font-display text-display font-bold">
                74<span className="text-headline-md font-headline-md opacity-80 font-semibold">%</span>
              </div>
              <div className="mt-auto">
                <div className="w-full bg-tertiary-fixed/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: '74%' }}></div>
                </div>
                <p className="font-label-sm text-label-sm opacity-80 mt-2 text-right font-semibold">Well balanced</p>
              </div>
            </div>

            {/* Goal Progress */}
            <div className="bg-surface-container-high rounded-xl p-stack-md flex flex-col gap-stack-sm shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">Goal Progress</span>
              </div>
              <div className="font-display text-display text-on-surface font-bold">
                68<span className="text-headline-md font-headline-md text-on-surface-variant font-semibold">%</span>
              </div>
              <div className="mt-auto">
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div className="bg-outline h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right font-semibold">On track</p>
              </div>
            </div>

          </div>
        </section>

        {/* What We Noticed */}
        <section className="px-margin-mobile flex flex-col gap-stack-md">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest pl-2 font-bold">What we noticed</h3>
          
          <div className="flex flex-col gap-stack-sm">
            <div className="bg-primary-container text-on-primary-container p-stack-md rounded-2xl flex items-start gap-4 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="bg-primary-fixed text-on-primary-fixed p-2 rounded-full shrink-0 z-10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <div className="flex flex-col gap-1 z-10">
                <p className="font-body-lg text-body-lg font-medium">
                  You usually focus longest between <span className="font-semibold text-primary-fixed">5 PM and 7 PM</span>.
                </p>
                <p className="font-label-md text-label-md opacity-80 font-semibold">This aligns perfectly with your "Evening Wind-Down" block.</p>
              </div>
            </div>

            <div className="bg-surface-container-highest text-on-surface p-stack-md rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="bg-surface text-on-surface-variant p-2 rounded-full shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-body-lg text-body-lg font-medium">
                  You completed most of your planned tasks before <span className="font-semibold text-primary">8 PM</span>.
                </p>
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold">Great job protecting your late evening hours.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Optimization Recommendation */}
        <section className="px-margin-mobile flex flex-col gap-stack-md mb-stack-lg">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest pl-2 font-bold">One small change</h3>
          
          <div className="bg-surface-bright rounded-2xl p-stack-md shadow-md flex flex-col gap-stack-md relative overflow-hidden isolate">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent -z-10"></div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">Evening Optimization</span>
            </div>
            
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed font-semibold">
              Since you consistently find your deep focus groove in the early evening,{' '}
              <strong className="text-on-surface font-semibold">try scheduling your most cognitively difficult tasks during the 5 PM - 7 PM window</strong>{' '}
              instead of earlier in the day.
            </p>
            
            <button 
              onClick={() => navigate('/timeline')}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full self-start shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2 font-bold"
            >
              Adjust Next Week's Plan
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

      </div>
    </Layout>
  );
}
