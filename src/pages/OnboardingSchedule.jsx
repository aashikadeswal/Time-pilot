import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimePilot } from '../context/TimePilotContext';

export default function OnboardingSchedule() {
  const navigate = useNavigate();
  const { user, goals, getFlexibleMinutesAvailable, addTask } = useTimePilot();

  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  const [initialTaskName, setInitialTaskName] = useState('Political Science Revision');
  const [initialDuration, setInitialDuration] = useState(45);
  const [initialPriority, setInitialPriority] = useState('High');

  const handleFinishOnboarding = () => {
    if (initialTaskName.trim()) {
      addTask({
        name: initialTaskName,
        duration: initialDuration,
        priority: initialPriority,
        category: 'Studies',
        type: 'Flexible',
        scheduledTime: '16:00'
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Progress Section */}
      <div className="flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
        <div className="flex items-center justify-between mb-unit">
          <span className="text-label-md text-primary font-bold">Step 3 of 3</span>
          <span className="text-label-md text-outline font-semibold">Your Realistic Day</span>
        </div>
        <div className="w-full h-[4px] bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-margin-mobile md:px-margin-desktop py-stack-md max-w-xl mx-auto w-full flex flex-col gap-stack-md text-left">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            You're ready to pilot your time, {user.name}.
          </h1>
          <p className="text-body-md text-on-surface-variant font-medium mt-1">
            Based on your fixed commitments, here is your true flexible time for today.
          </p>
        </div>

        {/* Calculated Flexible Time Banner */}
        <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-label-sm uppercase tracking-wider font-bold opacity-80">True Flexible Study Time</span>
              <div className="text-display font-bold mt-1">
                {flexHours}<span className="text-headline-md font-medium">h</span> {flexRemainder > 0 && `${flexRemainder}m`}
              </div>
              <p className="text-body-md opacity-90 mt-1 font-medium">
                Uninterrupted time between your classes, meals, and rest.
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary-fixed shrink-0">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
          </div>
        </div>

        {/* First Focus Task Setup Card */}
        <div className="bg-surface-container rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_task</span>
            <h2 className="text-headline-md text-on-surface font-bold text-[18px]">Set Your First Focus Session</h2>
          </div>
          <p className="text-label-md text-on-surface-variant font-medium">
            Pick one high-impact task to kick off your first day:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-label-sm text-on-surface-variant font-bold block mb-1">Task Name</label>
              <input 
                type="text"
                value={initialTaskName}
                onChange={(e) => setInitialTaskName(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. Political Science Revision"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-label-sm text-on-surface-variant font-bold block mb-1">Duration</label>
                <select 
                  value={initialDuration}
                  onChange={(e) => setInitialDuration(Number(e.target.value))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface font-label-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant font-bold block mb-1">Priority</label>
                <select 
                  value={initialPriority}
                  onChange={(e) => setInitialPriority(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface font-label-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Med">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Core Process Quick Reminder */}
        <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">route</span>
          <p className="text-label-sm text-on-surface-variant font-semibold">
            Remember: Commitments → Plan → Focus → Adapt → Review
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex justify-between items-center max-w-xl mx-auto w-full pb-12">
        <button 
          onClick={() => navigate('/onboarding/typical-day')}
          className="text-on-surface-variant hover:text-on-surface font-semibold text-label-md flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <button 
          onClick={handleFinishOnboarding}
          className="text-label-md px-8 py-3.5 rounded-full bg-primary text-on-primary shadow-md hover:bg-surface-tint flex items-center gap-2 transition-all active:scale-95 font-bold"
        >
          Go to Dashboard
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
