import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function Dashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    user,
    tasks,
    commitments,
    focusHistory,
    toggleTaskCompleted,
    deleteTask,
    addTask,
    getFlexibleMinutesAvailable,
    getCapacityStatus,
    getRecommendation,
    recoverSchedule,
    moveTaskToTomorrow,
    setActiveFocusTask
  } = useTimePilot();

  // Modals
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskCategory, setNewTaskCategory] = useState('Studies');

  // Calculations
  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  const todayTasks = tasks.filter(t => t.scheduledDate !== 'tomorrow');
  const uncompletedTasks = todayTasks.filter(t => !t.completed);
  const completedTasks = todayTasks.filter(t => t.completed);

  // Focus time logged today in minutes
  const todayFocusSeconds = focusHistory
    .filter(f => f.timestamp && f.timestamp.includes('Today') || f.timestamp === 'Just now')
    .reduce((sum, f) => sum + (f.secondsLogged || 0), 0);
  const todayFocusMins = Math.round(todayFocusSeconds / 60) || 80; // 1h 20m default if fresh
  const focusHours = Math.floor(todayFocusMins / 60);
  const focusRemainder = todayFocusMins % 60;

  const capacity = getCapacityStatus();
  const recommendation = getRecommendation();

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleStartFocus = (task) => {
    setActiveFocusTask(task);
    navigate('/focus', { state: { task } });
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addTask({
      name: newTaskName.trim(),
      duration: Number(newTaskDuration),
      priority: newTaskPriority,
      category: newTaskCategory,
      type: 'Flexible',
      scheduledTime: '16:00'
    });
    setNewTaskName('');
    setShowQuickAddModal(false);
  };

  const handleApplyRecovery = (strategy) => {
    recoverSchedule(strategy);
    setShowRecoveryModal(false);
  };

  return (
    <Layout title="Dashboard" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in pb-12 max-w-container-max mx-auto text-left">
        
        {/* Header Greeting & Real Time Snapshot */}
        <section className="flex flex-col gap-1 px-margin-mobile">
          <h1 className="font-display text-display text-on-surface font-bold">
            {greeting}, {user.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">
            Here is your realistic time architecture for today.
          </p>
        </section>

        {/* Status Metrics Cards */}
        <section className="px-margin-mobile">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-sm">
            {/* Flexible Time */}
            <div className="bg-surface-container rounded-2xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Flexible Time</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {flexHours}h {flexRemainder > 0 ? `${flexRemainder}m` : ''}
                </span>
              </div>
            </div>
            
            {/* Today's Tasks */}
            <div className="bg-surface-container rounded-2xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Today's Tasks</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {uncompletedTasks.length} left
                </span>
              </div>
            </div>
            
            {/* Focus Today */}
            <div className="bg-surface-container rounded-2xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all col-span-2 sm:col-span-1">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Focus Today</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {focusHours > 0 ? `${focusHours}h ` : ''}{focusRemainder}m
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* OVER CAPACITY WARNING BANNER (If day exceeds available study time) */}
        {capacity.isOverCapacity && (
          <section className="px-margin-mobile">
            <div className="bg-secondary-container/40 border border-secondary/30 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold text-[18px]">Your day is over capacity</h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-0.5 font-medium">
                    You have <strong className="text-secondary">{Math.floor(capacity.totalPlannedMinutes / 60)}h {capacity.totalPlannedMinutes % 60}m of tasks</strong>, but only <strong className="text-primary">{Math.floor(capacity.availableMinutes / 60)}h {capacity.availableMinutes % 60}m of available flexible time</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowRecoveryModal(true)}
                  className="bg-secondary text-on-secondary px-4 py-2.5 rounded-xl font-label-md text-label-sm font-bold hover:bg-secondary/90 transition-all shadow-sm active:scale-95 w-full sm:w-auto text-center"
                >
                  Adjust Schedule
                </button>
              </div>
            </div>
          </section>
        )}

        {/* UP NEXT & WHAT SHOULD I DO NOW? (Prominent Feature) */}
        <section className="px-margin-mobile">
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-[0_8px_32px_rgba(26,28,30,0.08)] relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col gap-stack-md text-left">
              {/* Header Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-primary-container">lightbulb</span>
                  <h2 className="font-label-sm text-label-sm tracking-wider uppercase text-on-primary-container/80 font-bold">
                    What should I do now? • UP NEXT
                  </h2>
                </div>
                {recommendation && (
                  <span className="text-[11px] bg-primary/30 text-on-primary-container font-bold px-2.5 py-0.5 rounded-full">
                    High Priority Match
                  </span>
                )}
              </div>
              
              {recommendation ? (
                <div>
                  <p className="font-headline-lg-mobile text-headline-lg-mobile mb-1 font-bold">
                    You have {recommendation.availableWindowMins} minutes before your next commitment.
                  </p>
                  
                  {/* Recommended Task Card */}
                  <div className="bg-surface/10 rounded-xl p-4 mt-3 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-on-primary-container flex items-center gap-2 font-bold">
                        {recommendation.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 font-bold ${
                        recommendation.priority === 'High' ? 'bg-error/20 text-error-container' : 'bg-secondary/20 text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">flag</span> {recommendation.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-on-primary-container/80 font-label-md text-label-md mb-3 font-semibold text-sm">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">timer</span> {recommendation.duration} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">school</span> {recommendation.category}
                      </span>
                      <span className="flex items-center gap-1 text-on-primary-container">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Fits your available time
                      </span>
                    </div>

                    <p className="font-body-md text-body-md text-on-primary-container/90 bg-primary/20 p-3 rounded-lg border-l-2 border-primary-fixed font-medium text-sm">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl p-4 mt-2 backdrop-blur-sm">
                  <p className="font-headline-md text-on-primary-container font-bold">All caught up for today!</p>
                  <p className="font-body-md text-on-primary-container/80 text-sm mt-1">
                    You've completed all planned tasks. You can relax or add a light session.
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-stack-sm mt-2">
                {recommendation && (
                  <button 
                    onClick={() => handleStartFocus(recommendation.task)}
                    className="bg-primary text-on-primary font-label-md text-label-md py-3.5 px-6 rounded-xl w-full sm:w-auto shadow-md hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                    Start Focus ({recommendation.duration}m)
                  </button>
                )}
                <button 
                  onClick={() => setShowTaskPicker(true)}
                  className="bg-transparent text-on-primary-container border border-on-primary-container/30 font-label-md text-label-md py-3.5 px-6 rounded-xl w-full sm:w-auto hover:bg-on-primary-container/10 transition-colors flex items-center justify-center font-bold"
                >
                  Choose Something Else
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TODAY DIDN'T GO AS PLANNED? RECOVERY SECTION */}
        {uncompletedTasks.length > 1 && (
          <section className="px-margin-mobile">
            <div className="bg-surface-container rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">restart_alt</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold text-[17px]">Today didn't go as planned?</h3>
                  <p className="font-body-md text-on-surface-variant text-xs font-medium">
                    Reorganize remaining tasks into your evening free time with zero guilt.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm border border-primary/20 w-full sm:w-auto text-center"
              >
                Recover My Schedule
              </button>
            </div>
          </section>
        )}

        {/* Timeline Preview Section */}
        <section className="px-margin-mobile flex flex-col gap-stack-md text-left">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Today's Timeline</h2>
              <span className="text-xs text-on-surface-variant font-medium">Fixed commitments & flexible study windows</span>
            </div>
            <button 
              onClick={() => navigate('/timeline')}
              className="font-label-sm text-label-sm text-primary hover:underline font-bold flex items-center gap-1"
            >
              See Plan <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-2 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant before:rounded-full">
            {commitments.slice(0, 4).map((item) => (
              <div key={item.id} className="relative">
                <div className={`absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-surface z-10 ${
                  item.type === 'Flexible' ? 'bg-primary' : item.type === 'Rest' ? 'bg-secondary-container' : 'bg-surface-variant'
                }`}></div>
                <div className={`rounded-xl p-3 flex justify-between items-center ${
                  item.type === 'Flexible' ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container'
                }`}>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mb-0.5 block font-semibold text-xs">
                      {item.time} ({item.duration})
                    </span>
                    <p className={`font-body-md text-body-md font-semibold text-[15px] ${
                      item.type === 'Flexible' ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {item.name}
                    </p>
                  </div>
                  {item.type === 'Flexible' && (
                    <button
                      onClick={() => navigate('/planning')}
                      className="px-3 py-1 bg-surface text-primary rounded-lg text-xs font-bold shadow-sm hover:bg-surface-variant"
                    >
                      Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks List Section */}
        <section className="px-margin-mobile flex flex-col gap-stack-md mt-2 text-left">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Today's Tasks ({uncompletedTasks.length} remaining)
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">Prioritized for your flexible hours</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickAddModal(true)}
                className="font-label-sm text-label-sm text-primary hover:bg-primary/10 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Add Task
              </button>
              <button 
                onClick={() => navigate('/planning')}
                className="font-label-sm text-label-sm text-primary hover:underline font-bold flex items-center gap-1"
              >
                See All
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-stack-sm">
            {todayTasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-surface-container rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_4px_20px_rgba(26,28,30,0.04)] transition-all group ${
                  task.completed ? 'opacity-50' : ''
                }`}
              >
                {/* Complete checkbox */}
                <button 
                  onClick={() => toggleTaskCompleted(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                    task.completed 
                      ? 'bg-primary border-primary text-on-primary' 
                      : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                  }`}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  )}
                </button>
                
                <div className="flex-1 flex flex-col">
                  <span className={`font-body-md text-body-md text-on-surface font-bold text-[15px] ${
                    task.completed ? 'line-through text-on-surface-variant' : ''
                  }`}>
                    {task.name}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-on-surface-variant font-medium">
                    <span>Est. {task.duration}m</span>
                    <span>•</span>
                    <span className={`font-bold ${
                      task.priority === 'High' ? 'text-error' : task.priority === 'Med' ? 'text-secondary' : 'text-on-surface-variant'
                    }`}>
                      {task.priority} Priority
                    </span>
                    {task.rescheduled && (
                      <span className="text-primary font-bold">Rescheduled</span>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => handleStartFocus(task)}
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary text-xs font-bold transition-colors"
                      title="Focus on this task"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span> Focus
                    </button>
                  )}
                  <span className="px-2.5 py-1 bg-surface-variant text-on-surface-variant rounded-full font-label-sm text-xs font-semibold select-none">
                    {task.category}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-on-surface-variant hover:text-error p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete task"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {todayTasks.length === 0 && (
              <div className="bg-surface-container rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-outline text-3xl">task</span>
                <h3 className="text-headline-md text-on-surface font-bold">Nothing planned yet</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm text-sm">
                  Add your first task and TimePilot will help you fit it realistically into your day.
                </p>
                <button
                  onClick={() => setShowQuickAddModal(true)}
                  className="mt-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
                >
                  Add Task
                </button>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* CHOOSE SOMETHING ELSE MODAL */}
      {showTaskPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Select Focus Activity</h3>
                <p className="text-xs text-on-surface-variant font-medium">Choose from today's available tasks</p>
              </div>
              <button 
                onClick={() => setShowTaskPicker(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {uncompletedTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    handleStartFocus(t);
                    setShowTaskPicker(false);
                  }}
                  className="bg-surface-container-low hover:bg-surface-container rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-colors border border-transparent hover:border-primary/30"
                >
                  <div>
                    <h4 className="font-body-md text-on-surface font-bold text-[15px]">{t.name}</h4>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {t.duration}m • {t.priority} Priority • {t.category}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span> Start
                  </button>
                </div>
              ))}

              {uncompletedTasks.length === 0 && (
                <p className="text-sm text-on-surface-variant italic text-center py-4">No remaining tasks today.</p>
              )}
            </div>

            <div className="pt-2 border-t border-surface-container flex justify-between items-center">
              <button
                onClick={() => {
                  setShowTaskPicker(false);
                  setShowQuickAddModal(true);
                }}
                className="text-primary font-label-md text-xs font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">add</span> Add New Task
              </button>
              <button
                onClick={() => setShowTaskPicker(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE RECOVERY MODAL ("Today Didn't Go As Planned") */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">restart_alt</span>
              </div>
              <div>
                <h3 className="text-headline-md text-on-surface font-bold text-[19px]">Recover Your Schedule</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  We'll adapt your plan to fit the rest of today realistically.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Strategy 1: Smart Balance */}
              <div 
                onClick={() => handleApplyRecovery('smart_balance')}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-primary/20 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-body-md text-primary font-bold text-[15px]">Smart Balance (Recommended)</h4>
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  Keep top priorities, shorten longer study sessions to 45 mins, and shift low-priority tasks to tomorrow.
                </p>
              </div>

              {/* Strategy 2: Move Low Priority */}
              <div 
                onClick={() => handleApplyRecovery('move_low_priority')}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <h4 className="font-body-md text-on-surface font-bold text-[15px]">Move Low-Priority Tasks to Tomorrow</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  Focus purely on high & medium priority tasks for the remaining hours of today.
                </p>
              </div>

              {/* Strategy 3: Shorten Sessions */}
              <div 
                onClick={() => handleApplyRecovery('shorten_sessions')}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <h4 className="font-body-md text-on-surface font-bold text-[15px]">Shorten All Sessions by 15-20 Mins</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                  Keep all planned tasks, but turn them into focused sprints to fit within available time.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex justify-end gap-2">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-5 py-2.5 rounded-full text-on-surface-variant hover:bg-surface-container font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD TASK MODAL */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Add New Planned Task</h3>
            
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Political Science Case Law"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Duration</label>
                  <select
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm focus:outline-none"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm focus:outline-none"
                >
                  <option value="Studies">Studies</option>
                  <option value="Competitive Exams">Competitive Exams</option>
                  <option value="Thesis">Thesis</option>
                  <option value="Admin">Admin</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-surface-tint"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
