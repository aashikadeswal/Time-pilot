import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function WeeklyReview({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { user, focusHistory, goals } = useTimePilot();

  // 1. Real Focus Stats calculation from focusHistory
  const totalFocusSecs = focusHistory.reduce((sum, f) => sum + (f.secondsLogged || 0), 0);
  const totalFocusMins = Math.round(totalFocusSecs / 60);
  const completedHours = Math.floor(totalFocusMins / 60);
  const completedMins = totalFocusMins % 60;

  // 2. Weekly Targets from Goals
  const totalTargetHours = goals.reduce((sum, g) => sum + (Number(g.targetHoursPerWeek) || 0), 0) || 12;
  const totalTargetMins = totalTargetHours * 60;
  const completionPercentage = totalTargetMins > 0 
    ? Math.min(100, Math.round((totalFocusMins / totalTargetMins) * 100))
    : 0;

  // 3. Sessions & Averages
  const sessionCount = focusHistory.length;
  const avgSessionMins = sessionCount > 0 ? Math.round(totalFocusMins / sessionCount) : 0;

  // 4. Calculate Top Goal & Goal Breakdowns
  const goalMinutesMap = {};
  focusHistory.forEach(f => {
    const key = f.goalId || f.category || 'General';
    goalMinutesMap[key] = (goalMinutesMap[key] || 0) + Math.round((f.secondsLogged || 0) / 60);
  });

  let topGoalName = 'No goals active';
  let topGoalMins = 0;

  goals.forEach(g => {
    const mins = goalMinutesMap[g.id] || goalMinutesMap[g.name] || 0;
    if (mins >= topGoalMins) {
      topGoalMins = mins;
      topGoalName = g.name;
    }
  });

  if (topGoalMins === 0 && goals.length > 0) {
    topGoalName = goals[0].name;
  }

  // 5. Unique active days in history
  const uniqueDates = new Set();
  focusHistory.forEach(f => {
    if (f.timestamp) {
      uniqueDates.add(f.timestamp.split(',')[0]);
    }
  });
  const activeDaysCount = Math.min(7, Math.max(uniqueDates.size, sessionCount > 0 ? 1 : 0));
  const consistencyPercent = Math.round((activeDaysCount / 7) * 100);

  return (
    <Layout title="Review" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in pb-16 text-left max-w-container-max mx-auto">
        
        {/* Header Section */}
        <section className="px-margin-mobile flex flex-col gap-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Weekly reflection
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            How you balanced your cognitive energy and study hours over the past seven days, {user.name}.
          </p>
        </section>

        {/* Primary Insight Summary Banner */}
        <section className="px-margin-mobile">
          <div className="bg-primary-container text-on-primary-container p-5 rounded-2xl flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="bg-primary-fixed text-on-primary-fixed p-3 rounded-full shrink-0 z-10">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <div className="flex flex-col gap-1 z-10">
              <span className="text-xs uppercase tracking-wider font-bold text-primary-fixed-dim">Weekly Grounded Insight</span>
              <p className="font-headline-md text-base md:text-lg font-bold">
                You planned {totalTargetHours}h target and completed {completedHours}h {completedMins}m of logged focus.
              </p>
              <p className="text-xs md:text-sm text-on-primary-container/85 font-medium">
                {completionPercentage >= 70 
                  ? "Outstanding consistency! You are well aligned with your core learning goals."
                  : sessionCount > 0 
                    ? "Great momentum starting off. Focus on protecting consistent 45-minute afternoon windows."
                    : "No focus logged yet this week. Start a 25-minute Pomodoro session to kickstart your progress!"}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-margin-mobile">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Planned vs Completed */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Focus Logged
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-on-surface my-2">
                {completedHours}<span className="text-lg font-normal text-on-surface-variant">h</span> {completedMins}<span className="text-lg font-normal text-on-surface-variant">m</span>
              </div>
              <div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-700" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-on-surface-variant mt-1 block font-medium">
                  {completionPercentage}% of {totalTargetHours}h target
                </span>
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-secondary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Sessions Done
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-on-surface my-2">
                {sessionCount}<span className="text-sm font-normal text-on-surface-variant"> {sessionCount === 1 ? 'session' : 'sessions'}</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {avgSessionMins > 0 ? `Avg ${avgSessionMins} mins per session` : 'Start your first session'}
              </span>
            </div>

            {/* Consistency */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Consistency
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-on-surface my-2">
                {consistencyPercent}<span className="text-lg font-normal text-on-surface-variant">%</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {activeDaysCount} of 7 days active
              </span>
            </div>

            {/* Most Used Goal */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">flag</span>
                Top Goal
              </div>
              <div className="font-headline-md text-base font-bold text-on-surface my-2 line-clamp-1">
                {topGoalName}
              </div>
              <span className="text-[11px] text-primary font-bold">
                {topGoalMins > 0 ? `${(topGoalMins / 60).toFixed(1)} hrs focused` : 'Awaiting data'}
              </span>
            </div>

          </div>
        </section>

        {/* Goal-Specific Breakdown Section */}
        <section className="px-margin-mobile flex flex-col gap-3">
          <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest pl-1 font-bold">
            Goal Progress Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map(goal => {
              const loggedMinutes = goalMinutesMap[goal.id] || goalMinutesMap[goal.name] || 0;
              const loggedHours = (loggedMinutes / 60).toFixed(1);
              const targetH = Number(goal.targetHoursPerWeek) || 10;
              const pct = Math.min(100, Math.round((loggedMinutes / (targetH * 60)) * 100));

              return (
                <div key={goal.id} className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2.5 border border-outline-variant/20 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-body-md text-on-surface font-bold text-sm">{goal.name}</h4>
                      <span className="text-xs text-on-surface-variant">{goal.category} • Priority: {goal.priority}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {pct}%
                    </span>
                  </div>
                  <div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-on-surface-variant mt-1.5 font-medium">
                      <span>{loggedHours}h completed</span>
                      <span>Target: {targetH}h/wk</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What We Noticed (Behavioral Patterns) */}
        <section className="px-margin-mobile flex flex-col gap-3">
          <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest pl-1 font-bold">
            What We Noticed
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-surface-container rounded-2xl p-4 flex items-start gap-3.5 border border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">wb_twilight</span>
              </div>
              <div>
                <p className="font-body-md text-on-surface font-bold text-sm">
                  Peak focus occurred between <span className="text-primary">4:30 PM and 7:00 PM</span>.
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                  Protecting this late-afternoon window from distractions yielded your highest completion rate.
                </p>
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl p-4 flex items-start gap-3.5 border border-outline-variant/20">
              <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">schedule_send</span>
              </div>
              <div>
                <p className="font-body-md text-on-surface font-bold text-sm">
                  Adaptive scheduling kept you resilient.
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                  Using "Recover My Schedule" prevented study backlog without causing burnout.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Practical Recommendation */}
        <section className="px-margin-mobile">
          <div className="bg-surface-container-high rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <span className="material-symbols-outlined">lightbulb</span>
              One Practical Recommendation For Next Week
            </div>
            
            <p className="text-sm text-on-surface leading-relaxed font-medium">
              Try scheduling <strong className="text-primary">shorter 45-minute sessions</strong> for your heavy revision tasks. Our data shows your attention is sharpest in 45-minute sprints followed by a 15-minute break.
            </p>
            
            <button 
              onClick={() => navigate('/timeline')}
              className="bg-primary text-on-primary font-label-md text-xs px-5 py-3 rounded-xl self-start shadow-sm hover:bg-surface-tint transition-all active:scale-95 flex items-center gap-2 font-bold"
            >
              Adjust Next Week's Plan
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

      </div>
    </Layout>
  );
}
