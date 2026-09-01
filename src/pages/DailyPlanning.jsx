import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function DailyPlanning({ darkMode, setDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('High');
  const [duration, setDuration] = useState(45); // in minutes
  const [category, setCategory] = useState('Thesis');
  const [isFocused, setIsFocused] = useState(false);

  const availableTime = 150; // 2h 30m in minutes

  useEffect(() => {
    async function loadTasks() {
      const fetched = await api.fetchTasks();
      setTasks(fetched);
    }
    loadTasks();
  }, []);

  const handleAddTask = async (e) => {
    if (e) e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: String(Date.now()),
      name: taskName,
      priority,
      duration: Number(duration),
      category,
      completed: false
    };

    // Optimistic UI update
    setTasks([newTask, ...tasks]);
    setTaskName('');
    setIsFocused(false);

    await api.saveTask(newTask);
  };

  const toggleTaskCompleted = async (task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === task.id ? updated : t));
    await api.updateTask(task.id, updated);
  };

  const handleDeleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    await api.deleteTask(id);
  };

  // Calculate total planned time (uncompleted tasks)
  const totalPlannedMins = tasks
    .filter(t => !t.completed)
    .reduce((sum, t) => sum + t.duration, 0);

  const formatDuration = (mins) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    if (hrs > 0) return `${hrs}h ${m > 0 ? m + 'm' : ''}`;
    return `${m}m`;
  };

  const isOverCapacity = totalPlannedMins > availableTime;
  const capacityPercentage = Math.min((totalPlannedMins / availableTime) * 100, 100);

  return (
    <Layout title="Plan" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in-up pb-12 text-left">
        
        {/* Header Section */}
        <section className="flex flex-col gap-stack-sm px-margin-mobile">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">What matters today?</h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">Focus on what moves the needle. Leave the rest for tomorrow.</p>
        </section>

        {/* Task Creation Input */}
        <section className="px-margin-mobile relative z-10">
          <div className="bg-surface-container rounded-xl shadow-[0_4px_20px_rgba(26,28,30,0.04)] p-4 flex flex-col gap-4 transition-all duration-300 focus-within:bg-surface-container-lowest focus-within:shadow-[0_8px_32px_rgba(26,28,30,0.08)] group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-outline text-xl">add_circle</span>
              <input 
                className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none transition-colors" 
                placeholder="Add a new task..." 
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
            
            {/* Input expanded options */}
            {(isFocused || taskName) && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-variant/20 transition-all duration-300">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority selector */}
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Med</option>
                    <option value="Low">🟢 Low</option>
                  </select>

                  {/* Duration selector */}
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer"
                  >
                    <option value={15}>15m</option>
                    <option value={30}>30m</option>
                    <option value={45}>45m</option>
                    <option value={60}>60m</option>
                    <option value={90}>90m</option>
                    <option value={120}>2h</option>
                  </select>

                  {/* Category selector */}
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-container-high transition-colors focus:outline-none border-none cursor-pointer"
                  >
                    <option value="Thesis">Thesis</option>
                    <option value="Studies">Studies</option>
                    <option value="Admin">Admin</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleAddTask}
                  className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-md hover:bg-primary-container transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Capacity Cards (Dynamic check) */}
        <section className="flex gap-4 px-margin-mobile overflow-x-auto snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide">
          {/* Capacity Check Card */}
          {!isOverCapacity ? (
            <div className="snap-center shrink-0 w-[280px] bg-primary-container/20 text-on-surface rounded-xl p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(26,28,30,0.04)] relative overflow-hidden transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-xl"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Capacity Check</span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">Realistic plan.</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-2 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-label-sm font-semibold">Planned</span>
                  <span className="font-label-md font-bold">{formatDuration(totalPlannedMins)}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${capacityPercentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-on-surface-variant font-label-sm font-semibold">Available</span>
                  <span className="font-label-md font-bold">{formatDuration(availableTime)}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Overloaded Capacity Warning Card */
            <div className="snap-center shrink-0 w-[280px] bg-secondary-container/30 text-on-surface rounded-xl p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(26,28,30,0.04)] relative overflow-hidden transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/20 rounded-full blur-xl"></div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Capacity Warning</span>
                  <span className="font-headline-md text-headline-md text-on-surface mt-1 leading-tight font-bold">Over capacity.</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mt-2 relative z-10 font-semibold">
                Your planned tasks take longer than available time. Consider moving one task to tomorrow.
              </p>
              <div className="flex justify-between items-center text-sm mt-1 relative z-10">
                <span className="font-label-sm text-secondary font-bold">Planned: {formatDuration(totalPlannedMins)}</span>
                <span className="font-label-sm text-on-surface-variant font-semibold">Avail: {formatDuration(availableTime)}</span>
              </div>
            </div>
          )}
        </section>

        {/* Task List */}
        <section className="flex flex-col gap-stack-md px-margin-mobile">
          <h2 className="font-headline-md text-headline-md text-on-surface mt-2 font-bold">
            Planned ({tasks.filter(t => !t.completed).length})
          </h2>
          
          <div className="flex flex-col gap-3">
            {tasks.map((task) => {
              const isHigh = task.priority === 'High';
              const isMed = task.priority === 'Med';
              const borderCol = isHigh ? 'bg-error' : isMed ? 'bg-secondary' : 'bg-outline-variant';
              const textCol = isHigh ? 'text-error' : isMed ? 'text-secondary' : 'text-on-surface-variant';

              return (
                <div 
                  key={task.id} 
                  className={`group bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${borderCol}`}></div>
                  <div className="flex gap-3 items-start">
                    <button 
                      onClick={() => toggleTaskCompleted(task)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center hover:border-primary transition-colors ${
                        task.completed 
                          ? 'bg-primary border-primary text-on-primary' 
                          : 'border-outline-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-on-primary text-[14px] font-bold">check</span>
                      )}
                    </button>
                    
                    <div className="flex flex-col flex-1 gap-1 text-left">
                      <span className={`font-body-lg text-body-lg text-on-surface font-semibold leading-tight ${
                        task.completed ? 'line-through text-on-surface-variant' : ''
                      }`}>
                        {task.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1">
                        <span className={`flex items-center gap-1 font-label-sm text-label-sm font-bold ${textCol}`}>
                          <span className="material-symbols-outlined text-[14px]">flag</span> {task.priority}
                        </span>
                        <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> {task.duration}m
                        </span>
                        {!task.completed && (
                          <span className="flex items-center gap-1 font-label-sm text-label-sm text-error font-bold">
                            <span className="material-symbols-outlined text-[14px]">event</span> Today
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-bold">
                          {task.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all self-center"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && (
              <p className="font-body-md text-on-surface-variant italic text-center py-8">No tasks planned yet. Add one above!</p>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}
