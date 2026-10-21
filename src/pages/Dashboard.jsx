import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function Dashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    user,
    tasks,
    goals,
    commitments,
    focusHistory,
    toggleTaskCompleted,
    deleteTask,
    addTask,
    getFlexibleMinutesAvailable,
    getCapacityStatus,
    getRecommendation,
    recoverSchedule,
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

  // Toast
  const [toast, setToast] = useState(null);

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Calculations
  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  const todayTasks = tasks.filter(t => t.scheduledDate !== 'tomorrow');
  const uncompletedTasks = todayTasks.filter(t => !t.completed);
  const completedTasks = todayTasks.filter(t => t.completed);

  // Focus time logged today in minutes
  const todayFocusSeconds = focusHistory
    .filter(f => f.timestamp && (f.timestamp.includes('Today') || f.timestamp === 'Just now'))
    .reduce((sum, f) => sum + (f.secondsLogged || 0), 0);
  const todayFocusMins = Math.round(todayFocusSeconds / 60);
  const focusHours = Math.floor(todayFocusMins / 60);
  const focusRemainder = todayFocusMins % 60;

  const capacity = getCapacityStatus();
  const recommendation = getRecommendation();

  // Today's date
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  // Greeting based on time of day
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Completion percentage
  const totalTodayTasks = todayTasks.length;
  const completionPct = totalTodayTasks > 0 ? Math.round((completedTasks.length / totalTodayTasks) * 100) : 0;

  // Active goals count
  const activeGoals = goals.filter(g => g.status === 'active');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleStartFocus = (task) => {
    setActiveFocusTask(task);
    navigate('/focus', { state: { task } });
  };

  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    toggleTaskCompleted(taskId);
    if (task && !task.completed) {
      showToast(`"${task.name}" marked complete ✓`);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (confirmDeleteId === taskId) {
      deleteTask(taskId);
      setConfirmDeleteId(null);
      showToast('Task deleted', 'info');
    } else {
      setConfirmDeleteId(taskId);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
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
    showToast('Task added successfully');
  };

  const handleApplyRecovery = (strategy) => {
    recoverSchedule(strategy);
    setShowRecoveryModal(false);
    showToast('Schedule recovered ✓');
  };

  return (
    <Layout title="Dashboard" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-6 md:gap-8 animate-fade-in pb-12 max-w-[1000px] mx-auto text-left">
        
        {/* Header Greeting & Date */}
        <section className="flex flex-col gap-1 pt-4 md:pt-6">
          <p className="text-xs md:text-sm text-primary font-bold tracking-wide">{dateStr}</p>
          <h1 className="font-display text-[28px] md:text-display text-on-surface font-bold leading-tight">
            {greeting}, {user.name}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Here is your realistic time architecture for today.
          </p>
        </section>

        {/* Status Metrics Cards */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Flexible Time */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Flexible Time</span>
                <span className="text-xl md:text-2xl text-on-surface font-bold">
                  {flexHours}h {flexRemainder > 0 ? `${flexRemainder}m` : ''}
                </span>
              </div>
            </div>
            
            {/* Today's Tasks with completion ring */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                {totalTodayTasks > 0 && (
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                    {completionPct}%
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Tasks</span>
                <span className="text-xl md:text-2xl text-on-surface font-bold">
                  {completedTasks.length}/{totalTodayTasks}
                </span>
              </div>
              {/* Mini progress bar */}
              {totalTodayTasks > 0 && (
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-auto">
                  <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }}></div>
                </div>
              )}
            </div>
            
            {/* Focus Today */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Focus Today</span>
                <span className="text-xl md:text-2xl text-on-surface font-bold">
                  {todayFocusMins > 0 ? (focusHours > 0 ? `${focusHours}h ${focusRemainder}m` : `${focusRemainder}m`) : '0m'}
                </span>
              </div>
            </div>

            {/* Active Goals */}
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-outline-variant/10">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
              <div className="flex flex-col">
                <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Active Goals</span>
                <span className="text-xl md:text-2xl text-on-surface font-bold">{activeGoals.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* OVER CAPACITY WARNING BANNER */}
        {capacity.isOverCapacity && (
          <section className="animate-fade-in-up">
            <div className="bg-secondary-container/30 border border-secondary/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-base">Your day is over capacity</h3>
                  <p className="text-on-surface-variant text-sm mt-0.5 font-medium">
                    You have <strong className="text-secondary">{Math.floor(capacity.totalPlannedMinutes / 60)}h {capacity.totalPlannedMinutes % 60}m of tasks</strong>, but only <strong className="text-primary">{Math.floor(capacity.availableMinutes / 60)}h {capacity.availableMinutes % 60}m available</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="bg-secondary text-on-secondary px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-sm active:scale-95 w-full sm:w-auto text-center"
              >
                Adjust Schedule
              </button>
            </div>
          </section>
        )}

        {/* UP NEXT / RECOMMENDATION */}
        <section className="animate-fade-in-up stagger-1">
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/15 rounded-full blur-3xl"></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col gap-4 text-left">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-primary-container text-lg">lightbulb</span>
                  <h2 className="text-[11px] tracking-wider uppercase text-on-primary-container/80 font-bold">
                    What should I do now? • UP NEXT
                  </h2>
                </div>
                {recommendation && (
                  <span className="text-[10px] bg-primary/25 text-on-primary-container font-bold px-2.5 py-0.5 rounded-full hidden sm:inline">
                    High Priority
                  </span>
                )}
              </div>
              
              {recommendation ? (
                <div>
                  <p className="text-lg md:text-xl mb-1 font-bold leading-snug">
                    You have {recommendation.availableWindowMins} minutes before your next commitment.
                  </p>
                  
                  {/* Recommended Task */}
                  <div className="bg-surface/10 rounded-xl p-4 mt-3 backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-base md:text-lg text-on-primary-container font-bold leading-snug">
                        {recommendation.title}
                      </h3>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        recommendation.priority === 'High' ? 'bg-error/20 text-error-container' : 'bg-secondary/20 text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">flag</span> {recommendation.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-on-primary-container/80 text-xs font-semibold mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span> {recommendation.duration}m
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">school</span> {recommendation.category}
                      </span>
                      <span className="flex items-center gap-1 text-on-primary-container">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Fits your time
                      </span>
                    </div>

                    <p className="text-sm text-on-primary-container/85 bg-primary/15 p-3 rounded-lg border-l-2 border-primary-fixed font-medium leading-relaxed">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface/10 rounded-xl p-4 mt-1 backdrop-blur-sm">
                  <p className="text-lg text-on-primary-container font-bold">All caught up for today! 🎉</p>
                  <p className="text-sm text-on-primary-container/80 mt-1">
                    You've completed all planned tasks. Take a break or add a light session.
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                {recommendation && (
                  <button 
                    onClick={() => handleStartFocus(recommendation.task)}
                    className="bg-primary text-on-primary text-sm py-3 px-5 rounded-xl w-full sm:w-auto shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    Start Focus ({recommendation.duration}m)
                  </button>
                )}
                <button 
                  onClick={() => setShowTaskPicker(true)}
                  className="bg-transparent text-on-primary-container border border-on-primary-container/20 text-sm py-3 px-5 rounded-xl w-full sm:w-auto hover:bg-on-primary-container/10 transition-colors flex items-center justify-center font-bold"
                >
                  Choose Something Else
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RECOVERY PROMPT */}
        {uncompletedTasks.length > 1 && (
          <section className="animate-fade-in-up stagger-2">
            <div className="bg-surface-container rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-outline-variant/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">restart_alt</span>
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-[15px]">Today didn't go as planned?</h3>
                  <p className="text-on-surface-variant text-xs font-medium">
                    Reorganize remaining tasks with zero guilt.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(true)}
                className="bg-surface-container-high hover:bg-surface-container-highest text-primary px-4 py-2 rounded-xl font-bold transition-all active:scale-95 text-xs border border-primary/15 w-full sm:w-auto text-center"
              >
                Recover My Schedule
              </button>
            </div>
          </section>
        )}

        {/* Timeline Preview */}
        <section className="flex flex-col gap-3 animate-fade-in-up stagger-3">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg text-on-surface font-bold">Today's Timeline</h2>
              <span className="text-xs text-on-surface-variant font-medium">Fixed commitments & flexible windows</span>
            </div>
            <button 
              onClick={() => navigate('/timeline')}
              className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5"
            >
              See Full Plan <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-2 relative pl-7 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30 before:rounded-full">
            {commitments.slice(0, 4).map((item) => (
              <div key={item.id} className="relative animate-fade-in-up">
                <div className={`absolute -left-[22px] top-3 w-2.5 h-2.5 rounded-full border-2 border-surface z-10 ${
                  item.type === 'Flexible' ? 'bg-primary' : item.type === 'Rest' ? 'bg-secondary-container' : 'bg-outline-variant'
                }`}></div>
                <div className={`rounded-xl p-3 flex justify-between items-center transition-all ${
                  item.type === 'Flexible' ? 'bg-primary/8 border border-primary/15' : 'bg-surface-container border border-outline-variant/10'
                }`}>
                  <div>
                    <span className="text-[11px] text-on-surface-variant block font-semibold">
                      {item.time} ({item.duration})
                    </span>
                    <p className={`text-sm font-semibold ${
                      item.type === 'Flexible' ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {item.name}
                    </p>
                  </div>
                  {item.type === 'Flexible' && (
                    <button
                      onClick={() => navigate('/planning')}
                      className="px-3 py-1 bg-surface text-primary rounded-lg text-[11px] font-bold shadow-sm hover:bg-surface-container-high transition-colors"
                    >
                      Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks List */}
        <section className="flex flex-col gap-3 animate-fade-in-up stagger-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg text-on-surface font-bold">
                Today's Tasks ({uncompletedTasks.length} remaining)
              </h2>
              <span className="text-xs text-on-surface-variant font-medium">Prioritized for your flexible hours</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickAddModal(true)}
                className="text-xs text-primary hover:bg-primary/8 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span> Add
              </button>
              <button 
                onClick={() => navigate('/planning')}
                className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5"
              >
                See All
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {todayTasks.map((task, idx) => (
              <div 
                key={task.id} 
                className={`bg-surface-container rounded-2xl p-3.5 md:p-4 flex items-center gap-3 md:gap-4 hover:shadow-sm transition-all group border border-outline-variant/10 ${
                  task.completed ? 'opacity-50' : ''
                } animate-fade-in-up`}
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                {/* Checkbox */}
                <button 
                  onClick={() => handleToggleComplete(task.id)}
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                    task.completed 
                      ? 'bg-primary border-primary text-on-primary' 
                      : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                  }`}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-[12px] md:text-[14px] font-bold animate-check-pop">check</span>
                  )}
                </button>
                
                <div className="flex-1 flex flex-col min-w-0">
                  <span className={`text-sm md:text-[15px] text-on-surface font-bold leading-snug truncate ${
                    task.completed ? 'line-through text-on-surface-variant' : ''
                  }`}>
                    {task.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-on-surface-variant font-medium">
                    <span>{task.duration}m</span>
                    <span>•</span>
                    <span className={`font-bold ${
                      task.priority === 'High' ? 'text-error' : task.priority === 'Med' ? 'text-secondary' : 'text-on-surface-variant'
                    }`}>
                      {task.priority}
                    </span>
                    {task.rescheduled && (
                      <span className="text-primary font-bold">Rescheduled</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!task.completed && (
                    <button
                      onClick={() => handleStartFocus(task)}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-on-primary text-[11px] font-bold transition-colors"
                      title="Focus on this task"
                    >
                      <span className="material-symbols-outlined text-[13px]">play_arrow</span> Focus
                    </button>
                  )}
                  <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-semibold select-none hidden md:inline">
                    {task.category}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={`p-1 rounded-lg transition-all ${
                      confirmDeleteId === task.id 
                        ? 'bg-error/10 text-error opacity-100' 
                        : 'text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100'
                    }`}
                    title={confirmDeleteId === task.id ? 'Click again to confirm' : 'Delete task'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {confirmDeleteId === task.id ? 'delete_forever' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {todayTasks.length === 0 && (
              <div className="bg-surface-container rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 border border-outline-variant/10">
                <span className="material-symbols-outlined text-outline text-3xl">task</span>
                <h3 className="text-base text-on-surface font-bold">Nothing planned yet</h3>
                <p className="text-sm text-on-surface-variant max-w-sm">
                  Add your first task and TimePilot will help you fit it into your day.
                </p>
                <button
                  onClick={() => setShowQuickAddModal(true)}
                  className="mt-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform"
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
        <div className="modal-backdrop text-left" onClick={() => setShowTaskPicker(false)}>
          <div className="modal-content bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg text-on-surface font-bold">Select Focus Activity</h3>
                <p className="text-xs text-on-surface-variant font-medium">Choose from today's tasks</p>
              </div>
              <button 
                onClick={() => setShowTaskPicker(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
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
                  className="bg-surface-container-low hover:bg-surface-container rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                >
                  <div>
                    <h4 className="text-sm text-on-surface font-bold">{t.name}</h4>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {t.duration}m • {t.priority} Priority • {t.category}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-[13px]">play_arrow</span> Start
                  </button>
                </div>
              ))}

              {uncompletedTasks.length === 0 && (
                <p className="text-sm text-on-surface-variant italic text-center py-4">No remaining tasks today.</p>
              )}
            </div>

            <div className="pt-2 border-t border-outline-variant/15 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowTaskPicker(false);
                  setShowQuickAddModal(true);
                }}
                className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
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

      {/* RECOVERY MODAL */}
      {showRecoveryModal && (
        <div className="modal-backdrop text-left" onClick={() => setShowRecoveryModal(false)}>
          <div className="modal-content bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">restart_alt</span>
              </div>
              <div>
                <h3 className="text-lg text-on-surface font-bold">Recover Your Schedule</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Adapt your plan to fit the rest of today.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { key: 'smart_balance', label: 'Smart Balance (Recommended)', desc: 'Keep top priorities, shorten longer sessions to 45m, shift low-priority to tomorrow.', icon: 'auto_awesome', primary: true },
                { key: 'move_low_priority', label: 'Move Low-Priority to Tomorrow', desc: 'Focus on high & medium priority tasks only.', icon: 'move_item' },
                { key: 'shorten_sessions', label: 'Shorten All Sessions by 15-20m', desc: 'Keep all tasks, turn them into focused sprints.', icon: 'compress' }
              ].map(s => (
                <div 
                  key={s.key}
                  onClick={() => handleApplyRecovery(s.key)}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    s.primary ? 'bg-surface-container-low border border-primary/20 hover:bg-primary/5' : 'bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-bold ${s.primary ? 'text-primary' : 'text-on-surface'}`}>{s.label}</h4>
                    <span className={`material-symbols-outlined text-sm ${s.primary ? 'text-primary' : 'text-on-surface-variant'}`}>{s.icon}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-outline-variant/15 flex justify-end">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-5 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD MODAL */}
      {showQuickAddModal && (
        <div className="modal-backdrop text-left" onClick={() => setShowQuickAddModal(false)}>
          <div className="modal-content bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg text-on-surface font-bold">Add New Task</h3>
            
            <form onSubmit={handleQuickAdd} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Political Science Case Law"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Duration</label>
                  <select
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-on-surface text-sm"
                >
                  <option value="Studies">Studies</option>
                  <option value="Competitive Exams">Competitive Exams</option>
                  <option value="Thesis">Thesis</option>
                  <option value="Admin">Admin</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-surface-tint active:scale-95 transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="toast-container">
          <div className={`animate-toast-in bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
            toast.type === 'info' ? '' : ''
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            {toast.message}
          </div>
        </div>
      )}

    </Layout>
  );
}
