import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function Timeline({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [timelineItems, setTimelineItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState('1h');
  const [type, setType] = useState('Fixed');

  useEffect(() => {
    async function loadCommitments() {
      const fetched = await api.fetchCommitments();
      setTimelineItems(fetched);
    }
    loadCommitments();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name) return;

    let color = 'bg-surface-variant';
    let line = 'bg-outline';
    let ring = '';

    if (type === 'Flexible') {
      color = 'bg-primary';
      line = 'bg-primary/50';
    } else if (type === 'Rest') {
      color = 'bg-secondary-container';
      line = 'bg-secondary-container';
    } else if (type === 'Planned') {
      color = 'bg-surface';
      ring = 'ring-4 ring-primary';
      line = 'bg-primary';
    }

    const newItem = {
      id: String(Date.now()),
      time,
      name,
      type,
      duration,
      color,
      line,
      ring,
      opacity: type === 'Rest' && name === 'Sleep' ? 'opacity-70' : ''
    };

    // Optimistic sorting and update
    const updatedItems = [...timelineItems, newItem].sort((a, b) => a.time.localeCompare(b.time));
    setTimelineItems(updatedItems);
    setName('');
    setShowModal(false);

    await api.saveCommitment(newItem);
  };

  const handleDelete = async (id) => {
    setTimelineItems(timelineItems.filter(item => item.id !== id));
    await api.deleteCommitment(id);
  };

  return (
    <Layout title="Plan" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full min-h-full pb-24 relative text-left">
        
        {/* Header Day Section */}
        <div className="px-margin-mobile pt-stack-md pb-stack-lg flex flex-col gap-unit">
          <div className="flex flex-col">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">Your Day</span>
            <span className="font-body-md text-body-md text-on-surface-variant font-semibold">Thursday, Oct 26</span>
          </div>
          
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-stack-md flex items-center justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="flex flex-col relative z-10">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim font-bold">Available Focus</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-display font-bold">2<span className="font-headline-md text-headline-md font-medium">h</span> 15<span className="font-headline-md text-headline-md font-medium">m</span></span>
              </div>
            </div>
            <div className="relative z-10 bg-primary/20 p-3 rounded-full flex items-center justify-center text-primary-fixed">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="flex-1 px-margin-mobile relative">
          {/* Vertical central timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-surface-container-highest/50 z-0"></div>
          
          <div className="flex flex-col gap-stack-md pb-stack-lg relative z-10">
            {timelineItems.map((item) => (
              <div key={item.id} className={`flex group transition-all hover:translate-x-0.5 ${item.opacity || ''}`}>
                
                {/* Time Indicator */}
                <div className="w-12 pt-1 flex-shrink-0 flex flex-col items-end pr-3 select-none">
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold">{item.time}</span>
                </div>
                
                {/* Visual Timeline Dot */}
                <div className="relative flex flex-col items-center mr-3 mt-1.5">
                  <div className={`w-3 h-3 rounded-full ring-4 ring-surface shadow-sm z-10 ${item.color} ${item.ring || ''}`}></div>
                </div>
                
                {/* Event Card */}
                <div className={`flex-1 rounded-xl p-3 flex items-center justify-between shadow-sm relative overflow-hidden group/card ${
                  item.type === 'Flexible' 
                    ? 'bg-primary/10 hover:bg-primary/15' 
                    : item.type === 'Planned'
                      ? 'bg-surface-container-lowest ring-1 ring-primary/20 hover:shadow-md'
                      : item.type === 'Rest'
                        ? 'bg-secondary-container/20 hover:bg-secondary-container/25'
                        : 'bg-surface-container hover:bg-surface-container-high'
                }`}>
                  {item.type !== 'Rest' && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.line}`}></div>
                  )}
                  
                  <div className="flex items-center gap-3 pl-1">
                    {item.type === 'Fixed' && <div className="w-1.5 h-8 rounded-full bg-outline"></div>}
                    {item.type === 'Planned' && <div className="w-1.5 h-8 rounded-full bg-primary"></div>}
                    {item.type === 'Rest' && <div className="w-1.5 h-8 rounded-full bg-secondary-container"></div>}
                    
                    <div className="flex flex-col">
                      <span className={`font-label-md text-label-md font-bold ${
                        item.type === 'Flexible' ? 'text-primary' : 'text-on-surface'
                      }`}>
                        {item.name}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                        {item.type} • {item.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.type === 'Flexible' && (
                      <button 
                        onClick={() => navigate('/planning')}
                        className="px-3 py-1.5 rounded-lg bg-surface/80 text-primary font-label-sm text-label-sm shadow-sm hover:bg-surface active:scale-95 transition-all font-bold"
                      >
                        Plan
                      </button>
                    )}
                    
                    {/* Delete action for custom or any item */}
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-on-surface-variant hover:text-error hover:bg-error/10 p-1.5 rounded-full opacity-0 group-hover/card:opacity-100 transition-all"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    
                    {item.type !== 'Flexible' && item.type !== 'Rest' && (
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-90">
                        <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
            {timelineItems.length === 0 && (
              <p className="font-body-md text-on-surface-variant italic py-8 text-center">No timeline blocks scheduled.</p>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-margin-mobile w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 hover:scale-105 transition-all z-50 hover:shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in">
            <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
              <h2 className="text-headline-md text-on-surface font-semibold">Add Time Block</h2>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Event Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. Study, Library, Gym"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Time</label>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Duration</label>
                    <input 
                      type="text" 
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g. 1h, 45m"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Fixed', 'Flexible', 'Planned', 'Rest'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                          type === t 
                            ? 'bg-primary text-on-primary shadow-sm scale-[1.02]' 
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant/30">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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

      </div>
    </Layout>
  );
}
