import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingTypicalDay() {
  const navigate = useNavigate();
  const [commitments, setCommitments] = useState([
    { id: 1, name: 'Sleep', time: '23:00 - 07:00', duration: '8h', icon: 'bedtime', colorClass: 'bg-tertiary-container', lineClass: 'bg-tertiary-container' },
    { id: 2, name: 'Commute', time: '08:30 - 09:00', duration: '30m', icon: 'directions_transit', colorClass: 'bg-surface-variant', lineClass: 'bg-outline-variant' },
    { id: 3, name: 'Classes', time: '09:00 - 15:00', duration: '6h', icon: 'school', colorClass: 'bg-primary-container', lineClass: 'bg-primary-container', subtask: { name: 'Lunch Break', time: '12:00 - 13:00', icon: 'restaurant' } },
    { id: 4, name: 'Commute Home', time: '15:00 - 15:30', duration: '30m', icon: 'directions_walk', colorClass: 'bg-surface-variant', lineClass: 'bg-outline-variant' },
    { id: 5, name: 'Dinner', time: '19:00 - 20:00', duration: '1h', icon: 'restaurant', colorClass: 'bg-secondary-container', lineClass: 'bg-secondary-container' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [newIcon, setNewIcon] = useState('schedule');

  const iconsList = ['school', 'work', 'bedtime', 'restaurant', 'fitness_center', 'directions_transit', 'directions_walk', 'palette', 'schedule'];

  const handleAddCommitment = (e) => {
    e.preventDefault();
    if (!newName) return;

    // Calculate mock duration
    const [startH, startM] = newStart.split(':').map(Number);
    const [endH, endM] = newEnd.split(':').map(Number);
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins < 0) diffMins += 24 * 60; // handle wrap around midnight
    
    let durationStr = '';
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hrs > 0) durationStr += `${hrs}h`;
    if (mins > 0) durationStr += `${mins}m`;
    if (!durationStr) durationStr = '0m';

    const newItem = {
      id: Date.now(),
      name: newName,
      time: `${newStart} - ${newEnd}`,
      duration: durationStr,
      icon: newIcon,
      colorClass: 'bg-primary-container',
      lineClass: 'bg-primary-container'
    };

    setCommitments([...commitments, newItem]);
    setNewName('');
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setCommitments(commitments.filter(c => c.id !== id));
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300 relative">
      {/* Header bar */}
      <div className="px-margin-mobile pt-margin-mobile pb-stack-lg z-10 sticky top-0 bg-surface/90 backdrop-blur-md">
        <div className="flex items-center justify-between mb-stack-md">
          <button 
            onClick={() => navigate('/onboarding/goals')}
            className="text-on-surface-variant p-2 rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          
          <div className="flex items-center gap-1.5 select-none">
            <div className="w-8 h-1 bg-primary rounded-full"></div>
            <div className="w-8 h-1 bg-primary rounded-full"></div>
            <div className="w-8 h-1 bg-primary rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-primary-fixed-dim rounded-full animate-pulse"></div>
            </div>
            <div className="w-8 h-1 bg-surface-container-high rounded-full"></div>
            <div className="w-8 h-1 bg-surface-container-high rounded-full"></div>
          </div>
          <div className="w-10"></div>
        </div>
        
        <div className="flex flex-col gap-unit">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Build your typical day
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Add your fixed commitments to see your true flexible time.
          </p>
        </div>
      </div>

      {/* Commitments List */}
      <div className="flex-1 px-margin-mobile pb-[100px] overflow-y-auto max-w-lg mx-auto w-full">
        <div className="relative pl-12 pr-4 py-8">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-surface-container-high rounded-full"></div>
          
          {commitments.map((item) => (
            <div key={item.id} className="relative mb-stack-lg group transition-transform hover:-translate-y-0.5">
              {/* Timeline dot icon */}
              <div className={`absolute -left-[42px] top-6 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-105 ${item.colorClass}`}>
                <span className="material-symbols-outlined text-[16px] text-on-surface">
                  {item.icon}
                </span>
              </div>
              
              <div className="bg-surface-container-low rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${item.lineClass}`}></div>
                <div className="pl-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] font-semibold">
                      {item.name}
                    </h3>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-1 font-semibold">
                      {item.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-on-surface-variant font-label-md bg-surface-variant/40 px-3 py-1 rounded-full text-sm font-bold">
                      {item.duration}
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {item.subtask && (
                  <div className="mt-3 pl-2 pr-2 pt-3 border-t border-surface-variant/30 flex justify-between items-center bg-surface-container-low relative">
                    <span className="material-symbols-outlined text-secondary text-[14px] absolute -left-[28px] top-1/2 -translate-y-1/2 bg-surface-container-low p-1 rounded-full z-20">
                      {item.subtask.icon}
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-bold">{item.subtask.name}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-semibold">{item.subtask.time}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add commitment button */}
          <div className="relative group cursor-pointer">
            <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container border border-dashed border-outline-variant flex items-center justify-center z-10 transition-colors group-hover:border-primary group-hover:bg-primary-fixed-dim/10">
              <span className="material-symbols-outlined text-primary text-[16px] group-hover:scale-110 transition-transform">
                add
              </span>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-surface-container transition-colors group-hover:border-primary/50 group-hover:shadow-[0_4px_20px_rgba(26,28,30,0.04)] active:scale-98"
            >
              <span className="font-label-md text-label-md text-primary font-bold">Add commitment</span>
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
                  placeholder="e.g. Work Shift, Gym, etc."
                />
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Continue Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-margin-mobile bg-gradient-to-t from-surface via-surface/95 to-transparent z-20 pb-safe max-w-lg mx-auto w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold"
        >
          Continue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
