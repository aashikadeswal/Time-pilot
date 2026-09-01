import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function Dashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedTasks = await api.fetchTasks();
      setTasks(fetchedTasks);

      const fetchedCommitments = await api.fetchCommitments();
      setTimelineItems(fetchedCommitments);
    }
    loadData();
  }, []);

  const toggleTaskCompleted = async (task) => {
    const updated = { ...task, completed: !task.completed };
    // Optimistic state update
    setTasks(tasks.map(t => t.id === task.id ? updated : t));
    await api.updateTask(task.id, updated);
  };

  const tasksLeftCount = tasks.filter(t => !t.completed).length;

  return (
    <Layout title="Dashboard" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full gap-stack-lg animate-fade-in pb-12">
        
        {/* Header Greeting */}
        <section className="flex flex-col gap-unit px-margin-mobile">
          <h1 className="font-display text-display text-on-surface font-bold">Good afternoon, Sam</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">Here's how your time looks today.</p>
        </section>

        {/* Status Cards */}
        <section className="px-margin-mobile">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-sm">
            <div className="bg-surface-container rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Flexible Time</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">2h 15m</span>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Today's Tasks</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  {tasksLeftCount} left
                </span>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-xl p-4 shadow-[0_4px_20px_rgba(26,28,30,0.04)] flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(26,28,30,0.08)] transition-all col-span-2 sm:col-span-1">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-tertiary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Focus Today</span>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">1h 20m</span>
              </div>
            </div>
          </div>
        </section>

        {/* Suggestion Card */}
        <section className="px-margin-mobile">
          <div className="bg-primary-container text-on-primary-container rounded-xl p-6 shadow-[0_8px_32px_rgba(26,28,30,0.08)] relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col gap-stack-md text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-primary-container">lightbulb</span>
                <h2 className="font-label-sm text-label-sm tracking-wider uppercase text-on-primary-container/80 font-bold">What can I do now?</h2>
              </div>
              
              <div>
                <p className="font-headline-lg-mobile text-headline-lg-mobile mb-1 font-bold">You have 35 minutes available.</p>
                
                <div className="bg-surface/10 rounded-lg p-4 mt-4 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-on-primary-container flex items-center gap-2 font-semibold">
                      Mathematics Practice
                    </h3>
                    <span className="px-2 py-1 bg-error/20 text-error-container rounded-full font-label-sm text-label-sm flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[14px]">priority_high</span> High
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-on-primary-container/80 font-label-md text-label-md mb-3 font-semibold">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">timer</span> 30 mins</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">school</span> Study</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-primary-container/90 bg-primary/20 p-3 rounded-lg border-l-2 border-primary-fixed font-medium">
                    This fits perfectly into your available block and tackles one of today's highest priorities before dinner.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-stack-sm mt-2">
                <button 
                  onClick={() => navigate('/focus')}
                  className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg w-full sm:w-auto shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <span className="material-symbols-outlined">play_arrow</span> Start Focus
                </button>
                <button className="bg-transparent text-on-primary-container border border-on-primary-container/30 font-label-md text-label-md py-3 px-6 rounded-lg w-full sm:w-auto hover:bg-on-primary-container/10 transition-colors flex items-center justify-center font-bold">
                  Choose Something Else
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Preview */}
        <section className="px-margin-mobile flex flex-col gap-stack-md text-left">
          <div className="flex justify-between items-end">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Today's Timeline</h2>
            <button 
              onClick={() => navigate('/timeline')}
              className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors font-bold"
            >
              See Plan
            </button>
          </div>
          
          <div className="flex flex-col gap-2 relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant before:rounded-full">
            {timelineItems.slice(0, 3).map((item) => (
              <div key={item.id} className="relative">
                <div className={`absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-surface z-10 ${
                  item.type === 'Flexible' ? 'bg-primary' : 'bg-surface-variant'
                }`}></div>
                <div className="bg-surface-container rounded-lg p-3">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mb-1 block font-semibold">
                    {item.time} ({item.duration})
                  </span>
                  <p className="font-body-md text-body-md text-on-surface font-semibold">{item.name}</p>
                </div>
              </div>
            ))}
            {timelineItems.length === 0 && (
              <p className="font-body-md text-on-surface-variant italic">No commitments scheduled.</p>
            )}
          </div>
        </section>

        {/* Tasks Preview */}
        <section className="px-margin-mobile flex flex-col gap-stack-md mt-4 text-left">
          <div className="flex justify-between items-end">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Today's Tasks</h2>
            <button 
              onClick={() => navigate('/planning')}
              className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors font-bold"
            >
              See All
            </button>
          </div>
          
          <div className="flex flex-col gap-stack-sm">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-surface-container rounded-xl p-4 flex items-center gap-4 hover:shadow-[0_4px_20px_rgba(26,28,30,0.04)] transition-all ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <button 
                  onClick={() => toggleTaskCompleted(task)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    task.completed 
                      ? 'bg-primary border-primary text-on-primary' 
                      : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  {task.completed && (
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  )}
                </button>
                
                <div className="flex-1 flex flex-col">
                  <span className={`font-body-md text-body-md text-on-surface font-bold ${
                    task.completed ? 'line-through text-on-surface-variant' : ''
                  }`}>
                    {task.name}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Est. {task.duration}m</span>
                </div>
                
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded font-label-sm text-label-sm font-semibold select-none">
                  {task.category}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="font-body-md text-on-surface-variant italic py-4">No tasks scheduled for today.</p>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}
