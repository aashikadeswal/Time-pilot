import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function DailyPlanning({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    tasks,
    goals,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    moveTaskToTomorrow,
    recoverSchedule,
    getFlexibleMinutesAvailable,
    getCapacityStatus,
    setActiveFocusTask
  } = useTimePilot();

  const todayStr = new Date().toISOString().split('T')[0];

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('today'); // 'today' | 'tomorrow' | YYYY-MM-DD
  const [priority, setPriority] = useState('High');
  const [duration, setDuration] = useState(45);
  const [category, setCategory] = useState('Studies');
  const [type, setType] = useState('Flexible');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [taskView, setTaskView] = useState('today'); // 'today' | 'upcoming' | 'completed'

  // Edit modal
  const [editingTask, setEditingTask] = useState(null);
  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // Toast
  const [toast, setToast] = useState(null);

  const capacity = getCapacityStatus();
  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  // Filter tasks into Today, Upcoming, and Completed
  const isTaskToday = (t) => {
    return t.scheduledDate === 'today' || t.scheduledDate === todayStr || (!t.scheduledDate && t.scheduledDate !== 'tomorrow');
  };

  const isTaskUpcoming = (t) => {
    return t.scheduledDate === 'tomorrow' || (t.scheduledDate && t.scheduledDate > todayStr);
  };

  const todayTasks = tasks.filter(t => isTaskToday(t) && !t.completed);
  const upcomingTasks = tasks.filter(t => isTaskUpcoming(t) && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const totalToday = tasks.filter(t => isTaskToday(t)).length;
  const completedToday = tasks.filter(t => isTaskToday(t) && t.completed).length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!taskName.trim()) return;

    addTask({
      name: taskName.trim(),
      description: taskDescription.trim(),
      scheduledDate: taskDate,
      priority,
      duration: Number(duration),
      category,
      type,
      goalId: selectedGoalId || null,
      scheduledTime: '16:00',
      completed: false,
    });

    setTaskName('');
    setTaskDescription('');
    setTaskDate('today');
    setSelectedGoalId('');
    setIsFocused(false);
    showToast('Task created successfully');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask) return;
    updateTask(editingTask.id, {
      name: editingTask.name,
      description: editingTask.description || '',
      scheduledDate: editingTask.scheduledDate || 'today',
      priority: editingTask.priority,
      duration: Number(editingTask.duration),
      category: editingTask.category,
      type: editingTask.type,
      completed: Boolean(editingTask.completed),
    });
    setEditingTask(null);
    showToast('Task updated');
  };

  const handleDeleteTask = (taskId) => {
    if (confirmDeleteId === taskId) {
      deleteTask(taskId);
      setConfirmDeleteId(null);
      showToast('Task deleted');
    } else {
      setConfirmDeleteId(taskId);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    toggleTaskCompleted(taskId);
    if (task && !task.completed) {
      showToast(`"${task.name}" completed ✓`);
    } else {
      showToast(`"${task?.name}" marked incomplete`);
    }
  };

  const formatDuration = (mins) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    if (hrs > 0) return `${hrs}h ${m > 0 ? `${m}m` : ''}`.trim();
    return `${m}m`;
  };

  const handleStartFocus = (task) => {
    setActiveFocusTask(task);
    navigate('/focus', { state: { task } });
  };

  return (
    <Layout title="Plan" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-6 animate-fade-in pb-16 max-w-[900px] mx-auto text-left">
        
        {/* Header */}
        <section className="flex flex-col gap-1 pt-4 md:pt-6">
          <h1 className="text-xl md:text-2xl text-on-surface font-bold">
            What matters today?
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Focus on what moves the needle. Leave the rest for tomorrow.
          </p>
        </section>

        {/* Task Creation */}
        <section className="relative z-10">
          <div className="bg-surface-container rounded-2xl shadow-sm p-4 flex flex-col gap-3 transition-all duration-300 focus-within:shadow-md border border-outline-variant/15 focus-within:border-primary/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
              <input 
                className="w-full bg-transparent text-base text-on-surface placeholder-on-surface-variant/50 focus:outline-none" 
                placeholder="Add a new daily task or study session..." 
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>

            {(isFocused || taskName) && (
              <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/15 animate-fade-in">
                {/* Description field */}
                <input
                  type="text"
                  placeholder="Add a description or notes (optional)..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-xs text-on-surface placeholder-on-surface-variant/50 focus:outline-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Date Selector */}
                    <select
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none"
                    >
                      <option value="today">📅 Today</option>
                      <option value="tomorrow">📅 Tomorrow</option>
                    </select>

                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none"
                    >
                      <option value="High">🔴 High Priority</option>
                      <option value="Med">🟡 Med Priority</option>
                      <option value="Low">🟢 Low Priority</option>
                    </select>

                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none"
                    >
                      <option value={15}>15m</option>
                      <option value={30}>30m</option>
                      <option value={45}>45m</option>
                      <option value={60}>60m (1h)</option>
                      <option value={90}>90m (1.5h)</option>
                      <option value={120}>120m (2h)</option>
                    </select>

                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none"
                    >
                      <option value="Studies">Studies</option>
                      <option value="Competitive Exams">Competitive Exams</option>
                      <option value="Thesis">Thesis</option>
                      <option value="Admin">Admin</option>
                      <option value="Personal">Personal</option>
                    </select>

                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none"
                    >
                      <option value="Flexible">Flexible (Study)</option>
                      <option value="Fixed">Fixed (Class)</option>
                      <option value="Personal">Personal (Gym)</option>
                    </select>

                    {goals.filter(g => g.status === 'active').length > 0 && (
                      <select 
                        value={selectedGoalId}
                        onChange={(e) => setSelectedGoalId(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-xs shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer font-bold border-none max-w-[140px] truncate"
                        title="Link to Goal (Optional)"
                      >
                        <option value="">No Goal</option>
                        {goals.filter(g => g.status === 'active').map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleAddTask}
                    className="w-9 h-9 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-md hover:bg-surface-tint active:scale-90 transition-all shrink-0"
                    title="Add Task"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Capacity Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {!capacity.isOverCapacity ? (
              <div className="bg-primary/5 text-on-surface rounded-2xl p-4 md:p-5 shadow-sm border border-primary/15 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-primary font-bold">Capacity Check</span>
                    <h3 className="text-on-surface font-bold text-base mt-0.5">Realistic Plan ✓</h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  Tasks fit within your {flexHours}h {flexRemainder > 0 && `${flexRemainder}m`} of flexible time.
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Planned: {formatDuration(capacity.totalPlannedMinutes)}</span>
                    <span className="text-primary">Available: {formatDuration(capacity.availableMinutes)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(capacity.percentage, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-secondary-container/20 text-on-surface rounded-2xl p-4 md:p-5 shadow-sm border border-secondary/20 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">Capacity Warning</span>
                    <h3 className="text-on-surface font-bold text-base mt-0.5">Over Capacity</h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  <strong>{formatDuration(capacity.totalPlannedMinutes)}</strong> of tasks, only <strong>{formatDuration(capacity.availableMinutes)}</strong> available.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => recoverSchedule('move_low_priority')} className="px-3 py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container text-xs font-bold shadow-sm">
                    Move Low Priority
                  </button>
                  <button onClick={() => recoverSchedule('shorten_sessions')} className="px-3 py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container text-xs font-bold shadow-sm">
                    Shorten Sessions
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-surface-container rounded-2xl p-4 md:p-5 shadow-sm border border-outline-variant/15 flex flex-col justify-between">
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Today's Progress</span>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">{completedToday}</span>
                  <span className="text-xs text-on-surface-variant block font-medium">Done</span>
                </div>
                <div className="w-px h-8 bg-outline-variant/30"></div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-on-surface">{totalToday - completedToday}</span>
                  <span className="text-xs text-on-surface-variant block font-medium">Remaining</span>
                </div>
                <div className="w-px h-8 bg-outline-variant/30"></div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-secondary">{totalToday}</span>
                  <span className="text-xs text-on-surface-variant block font-medium">Total</span>
                </div>
              </div>
              {totalToday > 0 && (
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%` }}></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tasks View Selector & Controls */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            {/* View Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl">
              <button
                onClick={() => setTaskView('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  taskView === 'today'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Today ({todayTasks.length})
              </button>
              <button
                onClick={() => setTaskView('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  taskView === 'upcoming'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Upcoming ({upcomingTasks.length})
              </button>
              <button
                onClick={() => setTaskView('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  taskView === 'completed'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Completed ({completedTasks.length})
              </button>
            </div>

            {taskView === 'today' && todayTasks.length > 0 && (
              <button
                onClick={() => recoverSchedule('smart_balance')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Rebalance
              </button>
            )}
          </div>
          
          {/* Active List based on Tab */}
          <div className="flex flex-col gap-2">
            {/* TODAY'S TASKS VIEW */}
            {taskView === 'today' && (
              <>
                {todayTasks.map((task, idx) => {
                  const isHigh = task.priority === 'High';
                  const isMed = task.priority === 'Med';
                  const borderCol = isHigh ? 'bg-error' : isMed ? 'bg-secondary' : 'bg-outline-variant';
                  const textCol = isHigh ? 'text-error' : isMed ? 'text-secondary' : 'text-on-surface-variant';

                  return (
                    <div 
                      key={task.id} 
                      className="group bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-sm border border-outline-variant/10 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${borderCol}`}></div>
                      
                      <div className="flex gap-3 items-start pl-1">
                        {/* Complete Checkbox */}
                        <button 
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center border-outline-variant hover:border-primary hover:bg-primary/5 transition-all"
                          title="Mark task completed"
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-primary text-[13px] font-bold animate-check-pop">check</span>
                          )}
                        </button>
                        
                        {/* Content */}
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <span className="text-sm md:text-[15px] text-on-surface font-bold leading-snug">
                            {task.name}
                          </span>

                          {task.description && (
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[11px]">
                            <span className={`flex items-center gap-0.5 font-bold ${textCol}`}>
                              <span className="material-symbols-outlined text-[12px]">flag</span> {task.priority}
                            </span>
                            <span className="flex items-center gap-0.5 text-on-surface-variant font-semibold">
                              <span className="material-symbols-outlined text-[12px]">schedule</span> {task.duration}m
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold text-[10px]">
                              {task.category}
                            </span>
                            {task.rescheduled && (
                              <span className="text-secondary font-bold">Adjusted</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 self-center shrink-0">
                          <button
                            onClick={() => handleStartFocus(task)}
                            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                            <span className="hidden sm:inline">Focus</span>
                          </button>
                          <button
                            onClick={() => moveTaskToTomorrow(task.id)}
                            className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] font-semibold hidden sm:inline-flex"
                            title="Move to tomorrow"
                          >
                            → Tmrw
                          </button>
                          <button
                            onClick={() => setEditingTask({ ...task })}
                            className="text-on-surface-variant hover:text-primary p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit task"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={`p-1 rounded-lg transition-all ${
                              confirmDeleteId === task.id 
                                ? 'bg-error/10 text-error opacity-100' 
                                : 'text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100'
                            }`}
                            title={confirmDeleteId === task.id ? 'Click again to confirm' : 'Delete'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {confirmDeleteId === task.id ? 'delete_forever' : 'delete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {todayTasks.length === 0 && (
                  <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-outline-variant/10">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">event_available</span>
                    <p className="text-base text-on-surface font-bold">No tasks planned for today</p>
                    <p className="text-sm mt-1">Use the input above to manually add your tasks for today.</p>
                  </div>
                )}
              </>
            )}

            {/* UPCOMING TASKS VIEW */}
            {taskView === 'upcoming' && (
              <>
                {upcomingTasks.map((task, idx) => {
                  const isHigh = task.priority === 'High';
                  const isMed = task.priority === 'Med';
                  const borderCol = isHigh ? 'bg-error' : isMed ? 'bg-secondary' : 'bg-outline-variant';

                  return (
                    <div 
                      key={task.id} 
                      className="group bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-sm border border-outline-variant/10 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${borderCol}`}></div>
                      
                      <div className="flex gap-3 items-start pl-1">
                        <button 
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center border-outline-variant hover:border-primary hover:bg-primary/5 transition-all"
                          title="Mark task completed"
                        />
                        
                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <span className="text-sm md:text-[15px] text-on-surface font-bold leading-snug">
                            {task.name}
                          </span>

                          {task.description && (
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-bold text-[10px]">
                              📅 {task.scheduledDate === 'tomorrow' ? 'Tomorrow' : task.scheduledDate}
                            </span>
                            <span className="flex items-center gap-0.5 text-on-surface-variant font-semibold">
                              <span className="material-symbols-outlined text-[12px]">schedule</span> {task.duration}m
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold text-[10px]">
                              {task.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 self-center shrink-0">
                          <button
                            onClick={() => updateTask(task.id, { scheduledDate: 'today' })}
                            className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-0.5"
                            title="Move to Today"
                          >
                            Move to Today
                          </button>
                          <button
                            onClick={() => setEditingTask({ ...task })}
                            className="text-on-surface-variant hover:text-primary p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit task"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 rounded-lg text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {upcomingTasks.length === 0 && (
                  <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-outline-variant/10">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">schedule</span>
                    <p className="text-base text-on-surface font-bold">No upcoming tasks</p>
                    <p className="text-sm mt-1">Tasks scheduled for tomorrow or future dates will appear here.</p>
                  </div>
                )}
              </>
            )}

            {/* COMPLETED TASKS VIEW */}
            {taskView === 'completed' && (
              <>
                {completedTasks.map((task, idx) => (
                  <div 
                    key={task.id} 
                    className="group bg-surface-container-lowest/80 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-sm border border-outline-variant/10 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-emerald-500"></div>
                    
                    <div className="flex gap-3 items-start pl-1">
                      <button 
                        onClick={() => handleToggleComplete(task.id)}
                        className="mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-emerald-500 border-emerald-500 text-white transition-all"
                        title="Mark incomplete"
                      >
                        <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                      </button>
                      
                      <div className="flex flex-col flex-1 gap-1 min-w-0">
                        <span className="text-sm md:text-[15px] font-bold leading-snug line-through text-on-surface-variant">
                          {task.name}
                        </span>

                        {task.description && (
                          <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            Completed ✓
                          </span>
                          <span className="text-on-surface-variant font-medium">
                            {task.duration}m • {task.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 self-center shrink-0">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] font-semibold"
                          title="Re-open task"
                        >
                          Re-open
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 rounded-lg text-on-surface-variant hover:text-error"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {completedTasks.length === 0 && (
                  <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant border border-outline-variant/10">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2">task_alt</span>
                    <p className="text-base text-on-surface font-bold">No completed tasks yet</p>
                    <p className="text-sm mt-1">Complete your study sessions to see your progress here.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg text-on-surface font-bold">Edit Task</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Task notes or details..."
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Date</label>
                  <select
                    value={editingTask.scheduledDate || 'today'}
                    onChange={(e) => setEditingTask({ ...editingTask, scheduledDate: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="today">📅 Today</option>
                    <option value="tomorrow">📅 Tomorrow</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Med">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Duration</label>
                  <select
                    value={editingTask.duration}
                    onChange={(e) => setEditingTask({ ...editingTask, duration: Number(e.target.value) })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (1h)</option>
                    <option value={90}>90 mins (1.5h)</option>
                    <option value={120}>120 mins (2h)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={editingTask.category || 'Studies'}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="Studies">Studies</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Admin">Admin</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Completion status checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="task-completed-check"
                  checked={Boolean(editingTask.completed)}
                  onChange={(e) => setEditingTask({ ...editingTask, completed: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="task-completed-check" className="text-xs font-semibold text-on-surface cursor-pointer">
                  Mark as completed
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/15">
                <button 
                  type="button" 
                  onClick={() => setEditingTask(null)} 
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-surface-tint active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-up">
          <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {toast}
          </div>
        </div>
      )}

    </Layout>
  );
}
