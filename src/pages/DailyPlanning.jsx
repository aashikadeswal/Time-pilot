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
    shortenTask,
    recoverSchedule,
    getFlexibleMinutesAvailable,
    getCapacityStatus,
    setActiveFocusTask
  } = useTimePilot();

  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('High');
  const [duration, setDuration] = useState(45);
  const [category, setCategory] = useState('Studies');
  const [type, setType] = useState('Flexible');
  const [isFocused, setIsFocused] = useState(false);

  // Edit modal
  const [editingTask, setEditingTask] = useState(null);

  const capacity = getCapacityStatus();
  const flexibleMins = getFlexibleMinutesAvailable();
  const flexHours = Math.floor(flexibleMins / 60);
  const flexRemainder = flexibleMins % 60;

  const todayTasks = tasks.filter(t => t.scheduledDate !== 'tomorrow');
  const tomorrowTasks = tasks.filter(t => t.scheduledDate === 'tomorrow');

  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!taskName.trim()) return;

    addTask({
      name: taskName.trim(),
      priority,
      duration: Number(duration),
      category,
      type,
      scheduledTime: '16:00'
    });

    setTaskName('');
    setIsFocused(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask) return;
    updateTask(editingTask.id, {
      name: editingTask.name,
      priority: editingTask.priority,
      duration: Number(editingTask.duration),
      category: editingTask.category,
      type: editingTask.type
    });
    setEditingTask(null);
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
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in-up pb-16 max-w-container-max mx-auto text-left">
        
        {/* Header Section */}
        <section className="flex flex-col gap-1 px-margin-mobile">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            What matters today?
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Focus on what moves the needle. Leave the rest for tomorrow.
          </p>
        </section>

        {/* Task Creation Input */}
        <section className="px-margin-mobile relative z-10">
          <div className="bg-surface-container rounded-2xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] p-4 flex flex-col gap-4 transition-all duration-300 focus-within:bg-surface-container-lowest focus-within:shadow-[0_8px_32px_rgba(26,28,30,0.08)] border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
              <input 
                className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none transition-colors" 
                placeholder="Add a new task or study session..." 
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
            
            {/* Input expanded options */}
            {(isFocused || taskName) && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-variant/30 transition-all duration-300">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority selector */}
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface font-label-sm text-xs shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer font-bold"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Med">🟡 Med Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>

                  {/* Duration selector */}
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface font-label-sm text-xs shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer font-bold"
                  >
                    <option value={15}>15m</option>
                    <option value={30}>30m</option>
                    <option value={45}>45m</option>
                    <option value={60}>60m (1h)</option>
                    <option value={90}>90m (1.5h)</option>
                    <option value={120}>120m (2h)</option>
                  </select>

                  {/* Category selector */}
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface font-label-sm text-xs shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer font-bold"
                  >
                    <option value="Studies">Studies</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Admin">Admin</option>
                    <option value="Personal">Personal</option>
                  </select>

                  {/* Type selector */}
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface font-label-sm text-xs shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer font-bold"
                  >
                    <option value="Flexible">Flexible (Study)</option>
                    <option value="Fixed">Fixed (Class/Meeting)</option>
                    <option value="Personal">Personal (Gym/Errand)</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleAddTask}
                  className="w-9 h-9 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-md hover:bg-surface-tint transition-transform active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Capacity Evaluation & Warnings */}
        <section className="px-margin-mobile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Real Capacity Status Card */}
            {!capacity.isOverCapacity ? (
              <div className="bg-primary-container/20 text-on-surface rounded-2xl p-5 shadow-sm border border-primary/20 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-bold">Capacity Check</span>
                    <h3 className="font-headline-md text-on-surface font-bold text-lg mt-0.5">Realistic Plan</h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  Your planned tasks fit within your {flexHours}h {flexRemainder > 0 && `${flexRemainder}m`} of flexible study time.
                </p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Planned: {formatDuration(capacity.totalPlannedMinutes)}</span>
                    <span className="text-primary">Available: {formatDuration(capacity.availableMinutes)}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${Math.min(capacity.percentage, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              /* Over Capacity Warning Card */
              <div className="bg-secondary-container/30 text-on-surface rounded-2xl p-5 shadow-sm border border-secondary/30 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Capacity Warning</span>
                    <h3 className="font-headline-md text-on-surface font-bold text-lg mt-0.5">Your Day is Over Capacity</h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mt-2 font-medium">
                  You have <strong>{formatDuration(capacity.totalPlannedMinutes)}</strong> of tasks, but only <strong>{formatDuration(capacity.availableMinutes)}</strong> of available time.
                </p>

                {/* Over capacity quick resolution buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => recoverSchedule('move_low_priority')}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container text-xs font-bold shadow-sm transition-all"
                  >
                    Move Low Priority to Tomorrow
                  </button>
                  <button
                    onClick={() => recoverSchedule('shorten_sessions')}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container text-xs font-bold shadow-sm transition-all"
                  >
                    Shorten Sessions by 15m
                  </button>
                </div>
              </div>
            )}

            {/* Classification Guide Card */}
            <div className="bg-surface-container rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-bold">Task Classification</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-outline block">Fixed</span>
                    <span className="text-[11px] text-on-surface-variant">Classes, meetings</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-primary block">Flexible</span>
                    <span className="text-[11px] text-on-surface-variant">Study, revision</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-tertiary block">Personal</span>
                    <span className="text-[11px] text-on-surface-variant">Meals, gym</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-2">
                TimePilot automatically safeguards your personal breaks and schedules flexible study blocks around fixed commitments.
              </p>
            </div>

          </div>
        </section>

        {/* Planned Tasks List for Today */}
        <section className="flex flex-col gap-stack-md px-margin-mobile">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Today's Planned Tasks ({todayTasks.filter(t => !t.completed).length})
            </h2>
            <button
              onClick={() => recoverSchedule('smart_balance')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Smart Rebalance
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {todayTasks.map((task) => {
              const isHigh = task.priority === 'High';
              const isMed = task.priority === 'Med';
              const borderCol = isHigh ? 'bg-error' : isMed ? 'bg-secondary' : 'bg-outline-variant';
              const textCol = isHigh ? 'text-error' : isMed ? 'text-secondary' : 'text-on-surface-variant';

              return (
                <div 
                  key={task.id} 
                  className={`group bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] border border-outline-variant/20 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${borderCol}`}></div>
                  
                  <div className="flex gap-3 items-start pl-1">
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center hover:border-primary transition-colors ${
                        task.completed 
                          ? 'bg-primary border-primary text-on-primary' 
                          : 'border-outline-variant hover:bg-surface-container-high'
                      }`}
                      title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-on-primary text-[14px] font-bold">check</span>
                      )}
                    </button>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-1 gap-1 text-left">
                      <span className={`font-body-lg text-body-lg text-on-surface font-bold text-[16px] leading-tight ${
                        task.completed ? 'line-through text-on-surface-variant' : ''
                      }`}>
                        {task.name}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1 text-xs">
                        <span className={`flex items-center gap-1 font-bold ${textCol}`}>
                          <span className="material-symbols-outlined text-[14px]">flag</span> {task.priority} Priority
                        </span>
                        <span className="flex items-center gap-1 text-on-surface-variant font-semibold">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> {task.duration}m
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                          {task.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          {task.type || 'Flexible'}
                        </span>
                        {task.rescheduled && (
                          <span className="text-secondary font-bold">Adjusted</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-center">
                      {!task.completed && (
                        <button
                          onClick={() => handleStartFocus(task)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-surface-tint shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">play_arrow</span> Focus
                        </button>
                      )}
                      <button
                        onClick={() => moveTaskToTomorrow(task.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-semibold"
                        title="Move task to tomorrow"
                      >
                        → Tomorrow
                      </button>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-on-surface-variant hover:text-primary p-1.5 rounded-full"
                        title="Edit task"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-on-surface-variant hover:text-error p-1.5 rounded-full"
                        title="Delete task"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {todayTasks.length === 0 && (
              <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">event_available</span>
                <p className="font-headline-md text-on-surface font-bold">No tasks planned for today</p>
                <p className="text-sm mt-1">Add a new study session above to construct your plan.</p>
              </div>
            )}
          </div>
        </section>

        {/* Tomorrow's Tasks (Moved / Rescheduled) */}
        {tomorrowTasks.length > 0 && (
          <section className="flex flex-col gap-stack-sm px-margin-mobile mt-4">
            <h3 className="font-headline-md text-headline-md text-on-surface-variant font-bold text-base">
              Moved to Tomorrow ({tomorrowTasks.length})
            </h3>
            <div className="space-y-2">
              {tomorrowTasks.map((task) => (
                <div key={task.id} className="bg-surface-container/60 rounded-xl p-3.5 flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="font-body-md text-on-surface font-semibold text-sm">{task.name}</span>
                    <span className="text-xs text-on-surface-variant block">{task.duration}m • {task.priority} Priority</span>
                  </div>
                  <button
                    onClick={() => updateTask(task.id, { scheduledDate: 'today' })}
                    className="px-3 py-1 rounded-lg bg-surface-container-high text-primary text-xs font-bold hover:bg-surface-container-highest"
                  >
                    Move to Today
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Edit Task</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Duration</label>
                  <select
                    value={editingTask.duration}
                    onChange={(e) => setEditingTask({ ...editingTask, duration: Number(e.target.value) })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                    <option value={120}>120 mins</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-surface-tint"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
}
