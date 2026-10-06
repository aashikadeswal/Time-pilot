import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimePilot } from '../context/TimePilotContext';

export default function OnboardingTypicalDay() {
  const navigate = useNavigate();
  const { commitments, addCommitment, deleteCommitment, getFlexibleMinutesAvailable } = useTimePilot();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Fixed');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('15:00');
  const [newIcon, setNewIcon] = useState('school');

  const iconsList = ['school', 'work', 'bedtime', 'restaurant', 'fitness_center', 'directions_transit', 'directions_walk', 'palette', 'schedule'];

  const handleAddCommitment = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Calculate duration
    const [startH, startM] = newStart.split(':').map(Number);
    const [endH, endM] = newEnd.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60; // handle wrap around midnight
    
    let durationStr = '';
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hrs > 0) durationStr += `${hrs}h `;
    if (mins > 0) durationStr += `${mins}m`;
    if (!durationStr.trim()) durationStr = '0m';

    addCommitment({
      name: newName.trim(),
      time: newStart,
      endTime: newEnd,
      duration: durationStr.trim(),
      durationMins: diffMins,
      type: newType,
      icon: newIcon
    });

    setNewName('');
    setShowAddModal(false);
  };

  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300 relative">
      {/* Step 2 of 3 Header Progress */}
      <div className="px-margin-mobile pt-margin-mobile pb-stack-sm z-10 sticky top-0 bg-surface/90 backdrop-blur-md border-b border-surface-container">
        <div className="flex items-center justify-between mb-unit">
          <span className="text-label-md text-primary font-bold">Step 2 of 3</span>
          <span className="text-label-md text-outline font-semibold">Typical Day & Fixed Blocks</span>
        </div>
        <div className="w-full h-[4px] bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '66.6%' }}></div>
        </div>
      </div>

      {/* Header Info */}
      <div className="px-margin-mobile pt-stack-md max-w-lg mx-auto w-full">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
          Build your typical day
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant font-medium mt-1">
          Add your fixed classes, sleep, commute, and meals to calculate your real study capacity.
        </p>

        {/* Live Calculation Banner */}
        <div className="mt-4 bg-surface-container rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">timelapse</span>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block">Remaining Flexible Time</span>
              <span className="text-headline-md text-on-surface font-bold">
                {flexHours}h {flexRemainder > 0 && `${flexRemainder}m`}
              </span>
            </div>
          </div>
          <span className="text-label-sm px-3 py-1 bg-primary/10 text-primary font-bold rounded-full">
            Available for study
          </span>
        </div>
      </div>

      {/* Commitments List */}
      <div className="flex-1 px-margin-mobile pb-[120px] overflow-y-auto max-w-lg mx-auto w-full">
        <div className="relative pl-12 pr-4 py-6">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-surface-container-high rounded-full"></div>
          
          {commitments.map((item) => (
            <div key={item.id} className="relative mb-stack-md group transition-transform hover:-translate-y-0.5">
              {/* Timeline dot icon */}
              <div className={`absolute -left-[42px] top-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 ${
                item.type === 'Flexible' 
                  ? 'bg-primary text-on-primary' 
                  : item.type === 'Rest'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-variant text-on-surface'
              }`}>
                <span className="material-symbols-outlined text-[16px]">
                  {item.icon || 'schedule'}
                </span>
              </div>
              
              <div className="bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                  item.type === 'Flexible' ? 'bg-primary' : item.type === 'Rest' ? 'bg-secondary' : 'bg-outline-variant'
                }`}></div>
                <div className="pl-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-headline-md text-on-surface text-[17px] font-semibold">
                      {item.name}
                    </h3>
                    <p className="font-label-md text-on-surface-variant mt-0.5 font-semibold text-xs">
                      {item.time} {item.endTime && `– ${item.endTime}`} • {item.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-on-surface-variant font-label-md bg-surface-variant/40 px-2.5 py-1 rounded-full text-xs font-bold">
                      {item.duration}
                    </div>
                    <button 
                      onClick={() => deleteCommitment(item.id)}
                      className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1.5 rounded-full transition-all"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add commitment button */}
          <div className="relative group cursor-pointer mt-2">
            <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container border border-dashed border-outline-variant flex items-center justify-center z-10 transition-colors group-hover:border-primary group-hover:bg-primary-fixed-dim/10">
              <span className="material-symbols-outlined text-primary text-[16px] group-hover:scale-110 transition-transform">
                add
              </span>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-surface-container transition-colors group-hover:border-primary/50 active:scale-98"
            >
              <span className="font-label-md text-primary font-bold">Add fixed activity (Class, Travel, Sleep, Meals)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding commitment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-headline-md text-on-surface font-semibold">New Commitment</h2>
            
            <form onSubmit={handleAddCommitment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g. Political Science Class, Gym, Dinner"
                />
              </div>

              <div className="space-y-1">
                <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Fixed', 'Flexible', 'Rest'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`py-2 text-xs font-bold rounded-lg ${
                        newType === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {iconsList.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      className={`h-10 rounded-lg flex items-center justify-center transition-all ${
                        newIcon === ic 
                          ? 'bg-primary text-on-primary scale-110 shadow-md' 
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant/30">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full hover:bg-surface-container text-on-surface-variant font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-md hover:bg-surface-tint active:scale-95 transition-all"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Continue Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-margin-mobile bg-gradient-to-t from-surface via-surface/95 to-transparent z-20 pb-safe max-w-lg mx-auto w-full flex gap-3">
        <button 
          onClick={() => navigate('/onboarding/goals')}
          className="px-6 bg-surface-container text-on-surface font-label-md py-4 rounded-xl shadow-sm hover:bg-surface-container-high transition-all active:scale-[0.98] font-bold"
        >
          Back
        </button>
        <button 
          onClick={() => navigate('/onboarding/schedule')}
          className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl shadow-md hover:bg-surface-tint hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold"
        >
          Continue to Schedule Preview
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
