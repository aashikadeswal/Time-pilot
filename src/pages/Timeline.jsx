import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function Timeline({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    commitments,
    tasks,
    addCommitment,
    deleteCommitment,
    rescheduleMissedTask,
    moveTaskToTomorrow,
    getFlexibleMinutesAvailable,
    setActiveFocusTask
  } = useTimePilot();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [type, setType] = useState('Fixed');
  const [locationStr, setLocationStr] = useState('');

  // Reschedule missed task modal
  const [selectedMissedTask, setSelectedMissedTask] = useState(null);
  const [rescheduleTime, setRescheduleTime] = useState('18:30');
  const [rescheduleDuration, setRescheduleDuration] = useState(30);

  // Delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live real time
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTimeFormatted(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  const calculateDuration = (start, end) => {
    if (!start || !end) return '1h';
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCommitment({
      name: name.trim(),
      time,
      endTime,
      duration: calculateDuration(time, endTime),
      type,
      location: locationStr
    });

    setName('');
    setLocationStr('');
    setShowModal(false);
    showToast(`Added "${name.trim()}" to schedule`);
  };

  const confirmDeleteCommitment = () => {
    if (!itemToDelete) return;
    deleteCommitment(itemToDelete.id);
    showToast(`Removed "${itemToDelete.name}" from timeline`);
    setItemToDelete(null);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMissedTask) return;
    rescheduleMissedTask(selectedMissedTask.id, rescheduleTime, rescheduleDuration);
    showToast(`Rescheduled "${selectedMissedTask.name}" to ${rescheduleTime}`);
    setSelectedMissedTask(null);
  };

  const handleStartFocusFromTimeline = (taskOrName) => {
    const matchedTask = tasks.find(t => t.name === taskOrName) || {
      name: taskOrName,
      duration: 45,
      category: 'Studies',
      priority: 'High'
    };
    setActiveFocusTask(matchedTask);
    navigate('/focus', { state: { task: matchedTask } });
  };

  // Sort commitments by time
  const sortedCommitments = [...commitments].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <Layout title="Plan" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full min-h-full pb-28 relative text-left max-w-container-max mx-auto animate-fade-in">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-slide-up">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Header Day & Available Focus Capacity Card */}
        <div className="px-margin-mobile pt-stack-md pb-stack-lg flex flex-col gap-unit">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">Your Day</span>
              <span className="font-body-md text-body-md text-on-surface-variant font-semibold">Today's Schedule & Commitments</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/planning')}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-all flex items-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">checklist</span>
                Task View
              </button>
            </div>
          </div>
          
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-stack-md flex items-center justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="flex flex-col relative z-10">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim font-bold">
                Available Focus Today
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-display font-bold">
                  {flexHours}<span className="font-headline-md text-headline-md font-medium">h</span> {flexRemainder > 0 && `${flexRemainder}m`}
                </span>
              </div>
              <span className="text-xs text-on-primary-container/80 mt-0.5 font-medium">
                Calculated between your fixed classes, meals & rest
              </span>
            </div>
            <div className="relative z-10 bg-primary/20 p-3.5 rounded-full flex items-center justify-center text-primary-fixed">
              <span className="material-symbols-outlined text-2xl">timelapse</span>
            </div>
          </div>
        </div>

        {/* Current Time Bar Indicator */}
        <div className="px-margin-mobile mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
          <span className="text-xs font-bold text-error uppercase tracking-wider">Current Time: {currentTimeFormatted}</span>
        </div>

        {/* Timeline Grid */}
        <div className="flex-1 px-margin-mobile relative">
          {/* Vertical central timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-surface-container-highest/60 z-0"></div>
          
          <div className="flex flex-col gap-stack-md pb-stack-lg relative z-10">
            {sortedCommitments.map((item, index) => {
              const isPast = item.endTime ? item.endTime < currentTimeFormatted : item.time < currentTimeFormatted;
              const isCurrent = item.time <= currentTimeFormatted && (!item.endTime || item.endTime >= currentTimeFormatted);
              
              return (
                <div 
                  key={item.id} 
                  className={`flex group transition-all hover:translate-x-1 ${
                    isPast ? 'opacity-65' : ''
                  }`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Time Indicator */}
                  <div className="w-12 pt-1 flex-shrink-0 flex flex-col items-end pr-3 select-none">
                    <span className={`font-label-md text-label-md font-bold ${
                      isCurrent ? 'text-primary font-black' : 'text-on-surface-variant'
                    }`}>
                      {item.time}
                    </span>
                  </div>
                  
                  {/* Visual Timeline Dot */}
                  <div className="relative flex flex-col items-center mr-3 mt-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-surface shadow-sm z-10 transition-transform group-hover:scale-125 ${
                      item.type === 'Flexible'
                        ? 'bg-primary'
                        : item.type === 'Rest'
                          ? 'bg-secondary-container'
                          : isCurrent
                            ? 'bg-primary ring-primary/40'
                            : 'bg-surface-variant'
                    }`}></div>
                  </div>
                  
                  {/* Event Card */}
                  <div className={`flex-1 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden transition-all ${
                    item.type === 'Flexible' 
                      ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                      : item.type === 'Planned'
                        ? 'bg-surface-container-lowest ring-1 ring-primary/30 shadow-md'
                        : item.type === 'Rest'
                          ? 'bg-secondary-container/20 border border-secondary-container/30'
                          : 'bg-surface-container hover:bg-surface-container-high'
                  }`}>
                    <div className="flex items-center gap-3 pl-1">
                      <div className={`w-1.5 h-9 rounded-full ${
                        item.type === 'Flexible' ? 'bg-primary' : item.type === 'Rest' ? 'bg-secondary' : 'bg-outline-variant'
                      }`}></div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-label-md text-label-md font-bold text-[15px] ${
                            item.type === 'Flexible' ? 'text-primary' : 'text-on-surface'
                          }`}>
                            {item.name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold animate-pulse">
                              Now
                            </span>
                          )}
                        </div>
                        <span className="font-label-sm text-xs text-on-surface-variant font-medium mt-0.5 flex items-center gap-1.5">
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{item.duration || (item.endTime ? `${item.time} - ${item.endTime}` : '')}</span>
                          {item.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">location_on</span>
                                {item.location}
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.type === 'Flexible' && (
                        <button 
                          onClick={() => handleStartFocusFromTimeline(item.name || 'Flexible Focus Session')}
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-label-sm text-xs shadow-sm hover:bg-surface-tint active:scale-95 transition-all font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                          Focus
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setItemToDelete(item)}
                        className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-all"
                        title="Delete block"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* MISSED TASK RECOVERY SECTION */}
        {tasks.some(t => t.missed) && (
          <div className="px-margin-mobile my-4 animate-fade-in-up">
            <div className="bg-error/10 border border-error/30 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-error font-bold text-sm">
                <span className="material-symbols-outlined text-lg">error_outline</span>
                You missed a planned session
              </div>
              {tasks.filter(t => t.missed).map(t => (
                <div key={t.id} className="bg-surface-container rounded-xl p-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="font-body-md text-on-surface font-bold text-sm">{t.name}</h4>
                    <span className="text-xs text-on-surface-variant">Original: {t.scheduledTime} ({t.duration}m)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMissedTask(t)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint transition-colors active:scale-95"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        moveTaskToTomorrow(t.id);
                        showToast(`Moved "${t.name}" to tomorrow`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant text-xs font-semibold hover:bg-surface-container-highest transition-colors active:scale-95"
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Add Time Block Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 hover:scale-105 transition-all z-40 hover:shadow-primary/30"
          title="Add Time Block"
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>

        {/* DELETE CONFIRMATION MODAL */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
            <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
              <div className="flex items-center gap-3 text-error">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
                <h3 className="text-headline-md text-on-surface font-bold text-lg">Remove Time Block?</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Are you sure you want to remove <strong>"{itemToDelete.name}"</strong> ({itemToDelete.time}) from your timeline?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCommitment}
                  className="px-4 py-2 text-xs font-bold bg-error text-on-error rounded-lg shadow-sm hover:bg-error/90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD TIME BLOCK MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
            <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
              <div className="flex justify-between items-center">
                <h2 className="text-headline-md text-on-surface font-bold text-[18px]">Add Time Block</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              
              <form onSubmit={handleAddItem} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Event Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder="e.g. Study Group, Library, Gym"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">End Time</label>
                    <input 
                      type="time" 
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Fixed', 'Flexible', 'Planned', 'Rest'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-2 rounded-lg font-bold text-xs transition-all ${
                          type === t 
                            ? 'bg-primary text-on-primary shadow-sm' 
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Location (Optional)</label>
                  <input 
                    type="text" 
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-on-surface text-sm focus:outline-none"
                    placeholder="e.g. Central Library"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-surface-variant/30">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-on-surface-variant font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-surface-tint"
                  >
                    Add Block
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RESCHEDULE MISSED TASK MODAL */}
        {selectedMissedTask && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
            <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
              <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Reschedule Session</h3>
              <p className="text-xs text-on-surface-variant font-medium">
                Fit a shorter session for <strong>{selectedMissedTask.name}</strong> into your remaining flexible time today.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">New Time</label>
                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Adjusted Duration</label>
                  <select
                    value={rescheduleDuration}
                    onChange={(e) => setRescheduleDuration(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value={15}>15 mins sprint</option>
                    <option value={30}>30 mins (Recommended)</option>
                    <option value={45}>45 mins</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                  <button
                    type="button"
                    onClick={() => setSelectedMissedTask(null)}
                    className="px-4 py-2 text-xs font-bold text-on-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
