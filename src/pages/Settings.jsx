import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function Settings({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    goals,
    addGoal,
    updateGoal,
    toggleGoalPause,
    toggleGoalCompleted,
    deleteGoal,
    scheduleGoalFocusBlock,
    settings,
    setSettings
  } = useTimePilot();

  const [activeTab, setActiveTab] = useState('goals'); // 'goals' | 'settings'
  const [goalFilter, setGoalFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Add Goal Modal
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Studies');
  const [newGoalPriority, setNewGoalPriority] = useState('High');
  const [newGoalTargetHours, setNewGoalTargetHours] = useState(10);
  const [newGoalDue, setNewGoalDue] = useState('Ongoing');
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);
  const [goalError, setGoalError] = useState(null);

  // Edit Goal Modal
  const [editingGoal, setEditingGoal] = useState(null);

  // Delete Goal Confirmation Modal
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Edit Profile Modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || isSubmittingGoal) return;

    setIsSubmittingGoal(true);
    setGoalError(null);

    try {
      await addGoal({
        name: newGoalName.trim(),
        description: newGoalDescription.trim(),
        category: newGoalCategory,
        priority: newGoalPriority,
        targetHoursPerWeek: Number(newGoalTargetHours) || 10,
        due: newGoalDue.trim() || 'Ongoing'
      });

      showToast(`Goal "${newGoalName.trim()}" saved successfully ✓`);
      setNewGoalName('');
      setNewGoalDescription('');
      setNewGoalDue('Ongoing');
      setShowAddGoalModal(false);
    } catch (err) {
      setGoalError(err.message || 'Failed to save goal. Please check your connection.');
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleSaveGoalEdit = (e) => {
    e.preventDefault();
    if (!editingGoal) return;
    updateGoal(editingGoal.id, {
      name: editingGoal.name,
      description: editingGoal.description || '',
      priority: editingGoal.priority,
      category: editingGoal.category,
      targetHoursPerWeek: Number(editingGoal.targetHoursPerWeek),
      due: editingGoal.due
    });
    showToast(`Updated goal "${editingGoal.name}"`);
    setEditingGoal(null);
  };

  const confirmDeleteGoal = () => {
    if (!goalToDelete) return;
    deleteGoal(goalToDelete.id);
    showToast(`Deleted goal "${goalToDelete.name}"`);
    setGoalToDelete(null);
  };

  const handleTogglePause = (goal) => {
    toggleGoalPause(goal.id);
    showToast(goal.status === 'paused' ? `Resumed "${goal.name}"` : `Paused "${goal.name}"`);
  };

  const handleToggleCompleteGoal = (goal) => {
    toggleGoalCompleted(goal.id);
    showToast(goal.status === 'completed' ? `Re-opened "${goal.name}"` : `Completed "${goal.name}" ✓`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: userName.trim(), email: userEmail.trim() });
    showToast('Profile updated');
    setShowEditProfile(false);
  };

  const handleToggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    showToast('Preference updated');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Layout title={activeTab === 'goals' ? 'Goals' : 'Settings'} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full pb-16 text-left max-w-xl mx-auto animate-fade-in relative">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-slide-up">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Top Tab Pill Selector (Goals | Settings) */}
        <div className="px-margin-mobile pt-stack-sm pb-stack-sm flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('goals')}
            className={`px-5 py-2 rounded-full font-label-md text-xs font-bold transition-all shadow-sm ${
              activeTab === 'goals'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Goals ({goals.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2 rounded-full font-label-md text-xs font-bold transition-all shadow-sm ${
              activeTab === 'settings'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Settings & Profile
          </button>
        </div>

        {/* ----------------- GOALS TAB ----------------- */}
        {activeTab === 'goals' && (
          <div className="flex flex-col w-full px-margin-mobile gap-stack-md py-stack-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Goals Management</h2>
                <p className="text-xs text-on-surface-variant font-medium">Track and organize your long-term study & personal targets</p>
              </div>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-surface-tint active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span> Add New Goal
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-outline-variant/20 pb-2">
              <button
                onClick={() => setGoalFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  goalFilter === 'all'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Goals ({goals.length})
              </button>
              <button
                onClick={() => setGoalFilter('active')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  goalFilter === 'active'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                In Progress ({goals.filter(g => g.status !== 'completed').length})
              </button>
              <button
                onClick={() => setGoalFilter('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  goalFilter === 'completed'
                    ? 'bg-surface-container-high text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Completed ({goals.filter(g => g.status === 'completed').length})
              </button>
            </div>

            <div className="space-y-3">
              {goals
                .filter(g => {
                  if (goalFilter === 'active') return g.status !== 'completed';
                  if (goalFilter === 'completed') return g.status === 'completed';
                  return true;
                })
                .map((goal) => {
                  const isHigh = goal.priority === 'High';
                  const isMed = goal.priority === 'Med';
                  const borderCol = goal.status === 'completed'
                    ? 'bg-emerald-500'
                    : isHigh ? 'bg-primary' : isMed ? 'bg-secondary' : 'bg-tertiary';
                  const hoursLogged = Math.round((goal.focusLoggedMinutes || 0) / 60);
                  const isPaused = goal.status === 'paused';
                  const isCompleted = goal.status === 'completed';

                  return (
                    <div 
                      key={goal.id} 
                      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm relative overflow-hidden border border-outline-variant/20 transition-all ${
                        isPaused ? 'opacity-60' : ''
                      } ${isCompleted ? 'bg-surface-container-lowest/80' : ''}`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderCol}`}></div>
                      
                      <div className="flex justify-between items-start mb-2 pl-1">
                        <div className="flex items-start gap-2.5 flex-1 pr-2">
                          <button
                            onClick={() => handleToggleCompleteGoal(goal)}
                            className={`p-1 -ml-1 rounded-full text-xs font-bold transition-colors ${
                              isCompleted
                                ? 'text-emerald-500 hover:text-emerald-600'
                                : 'text-on-surface-variant hover:text-primary'
                            }`}
                            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                          >
                            <span 
                              className="material-symbols-outlined text-xl"
                              style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-headline-md text-on-surface font-bold text-[17px] ${
                                isCompleted ? 'line-through text-on-surface-variant' : ''
                              }`}>
                                {goal.name}
                              </h3>
                              {isCompleted && (
                                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                                  Completed ✓
                                </span>
                              )}
                              {isPaused && !isCompleted && (
                                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full">
                                  Paused
                                </span>
                              )}
                            </div>
                            
                            {goal.description && (
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                {goal.description}
                              </p>
                            )}

                            <p className="font-label-md text-xs text-on-surface-variant mt-1 font-medium">
                              {goal.priority} Priority • Target: {goal.due || 'Ongoing'} • {goal.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!isCompleted && (
                            <button
                              onClick={() => handleTogglePause(goal)}
                              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full text-xs font-bold"
                              title={isPaused ? 'Resume Goal' : 'Pause Goal'}
                            >
                              <span className="material-symbols-outlined text-base">
                                {isPaused ? 'play_circle' : 'pause_circle'}
                              </span>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingGoal({ ...goal })}
                            className="text-on-surface-variant hover:text-primary p-1 rounded-full text-xs"
                            title="Edit Goal"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => setGoalToDelete(goal)}
                            className="text-on-surface-variant hover:text-error p-1 rounded-full text-xs"
                            title="Delete Goal"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-surface-container-highest rounded-full my-2.5 overflow-hidden pl-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCompleted ? 'bg-emerald-500' : isHigh ? 'bg-primary' : isMed ? 'bg-secondary' : 'bg-tertiary'
                          }`}
                          style={{ width: `${isCompleted ? 100 : (goal.progress || 0)}%` }}
                        ></div>
                      </div>

                      {/* Stats Row & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 pt-2 bg-surface/50 rounded-xl px-3 py-2 text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-primary">
                            <span className="material-symbols-outlined text-sm">timer</span>
                            <span>{hoursLogged}h focused</span>
                          </div>
                          <div className="flex items-center gap-1 text-secondary">
                            <span className="material-symbols-outlined text-sm">local_fire_department</span>
                            <span>{goal.streakDays || 0}d streak</span>
                          </div>
                          <div className="text-on-surface-variant font-medium hidden md:block">
                            Target: {goal.targetHoursPerWeek || 10}h/wk ({isCompleted ? 100 : (goal.progress || 0)}%)
                          </div>
                        </div>

                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => {
                              scheduleGoalFocusBlock(goal);
                              showToast(`Focus block for "${goal.name}" added to today's schedule ✓`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary hover:text-on-primary text-primary text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95"
                            title="Schedule a focus block on today's timeline"
                          >
                            <span className="material-symbols-outlined text-[13px]">calendar_add_on</span>
                            Schedule Focus Block
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {goals.length === 0 && (
                <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-1 text-primary">flag</span>
                  <p className="font-headline-md text-on-surface font-bold text-base">Set your first goal</p>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    Define meaningful learning and personal targets. Time Pilot will help you prioritize daily focus tasks accordingly.
                  </p>
                  <button
                    onClick={() => setShowAddGoalModal(true)}
                    className="mt-4 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md hover:bg-surface-tint"
                  >
                    Add New Goal
                  </button>
                </div>
              )}

              {goals.length > 0 && goals.filter(g => {
                if (goalFilter === 'active') return g.status !== 'completed';
                if (goalFilter === 'completed') return g.status === 'completed';
                return true;
              }).length === 0 && (
                <div className="bg-surface-container/60 rounded-2xl p-6 text-center text-on-surface-variant text-xs font-medium">
                  No {goalFilter} goals found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SETTINGS TAB ----------------- */}
        {activeTab === 'settings' && (
          <div className="flex flex-col w-full px-margin-mobile gap-stack-md py-stack-sm">
            
            {/* Profile Card */}
            <section className="flex items-center justify-between p-4 bg-surface-container rounded-2xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-3.5">
                <img 
                  alt="Profile Avatar" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" 
                  src={user.avatar}
                />
                <div className="flex flex-col">
                  <h2 className="font-headline-md text-on-surface font-bold text-lg">{user.name}</h2>
                  <span className="text-xs text-on-surface-variant font-medium">{user.email}</span>
                  <span className="text-[11px] text-primary font-semibold mt-0.5">{user.field || 'Student'}</span>
                </div>
              </div>
              <button
                onClick={() => setShowEditProfile(true)}
                className="text-primary hover:bg-primary/10 p-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">edit</span> Edit
              </button>
            </section>

            {/* Typical Day Schedule Preferences */}
            <section className="flex flex-col gap-2">
              <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest pl-1 font-bold">
                Typical Day Timing
              </h3>
              <div className="bg-surface-container rounded-2xl p-4 shadow-sm border border-outline-variant/20 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-lg">wb_sunny</span>
                    <div>
                      <p className="font-body-md text-on-surface font-semibold text-sm">Start Day</p>
                      <p className="text-xs text-on-surface-variant">Morning wake-up and planning</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-on-surface">{settings.dayStartTime || '08:00 AM'}</span>
                </div>

                <div className="h-px bg-surface-variant/30"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary text-lg">bedtime</span>
                    <div>
                      <p className="font-body-md text-on-surface font-semibold text-sm">End Day & Sleep</p>
                      <p className="text-xs text-on-surface-variant">Evening wind-down</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-on-surface">{settings.dayEndTime || '11:00 PM'}</span>
                </div>
              </div>
            </section>

            {/* Pilot Intelligent Preferences */}
            <section className="flex flex-col gap-2">
              <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest pl-1 font-bold">
                Pilot Preferences
              </h3>
              
              <div className="bg-surface-container rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
                {/* Smart Scheduling */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                    <div>
                      <p className="font-body-md text-on-surface font-semibold text-sm">Smart Scheduling & Rebalance</p>
                      <p className="text-xs text-on-surface-variant">Automatically balance task sizes and capacities</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('autoSchedule')}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      settings.autoSchedule ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                      settings.autoSchedule ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="h-px bg-surface-variant/20 mx-4"></div>

                {/* Daily Focus Digest */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">today</span>
                    <div>
                      <p className="font-body-md text-on-surface font-semibold text-sm">Daily Focus Digest</p>
                      <p className="text-xs text-on-surface-variant">Summary of available blocks every morning</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('dailyDigest')}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      settings.dailyDigest ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                      settings.dailyDigest ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="h-px bg-surface-variant/20 mx-4"></div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">notifications</span>
                    <div>
                      <p className="font-body-md text-on-surface font-semibold text-sm">Focus Session Alerts</p>
                      <p className="text-xs text-on-surface-variant">Gentle prompt before flexible blocks</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleSetting('notifications')}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      settings.notifications ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                      settings.notifications ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </section>

            {/* Logout & Navigation back */}
            <section className="pt-2">
              <button 
                onClick={handleLogout}
                className="w-full py-3.5 rounded-xl bg-error/10 hover:bg-error/20 text-error font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
            </section>
          </div>
        )}

      </div>

      {/* ADD GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Add New Goal</h3>
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {goalError && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {goalError}
              </div>
            )}
            
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={newGoalName}
                  onChange={(e) => {
                    setNewGoalName(e.target.value);
                    if (goalError) setGoalError(null);
                  }}
                  placeholder="e.g. Political Science Case Law Revision"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="What does success look like? Any milestones or notes..."
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={newGoalPriority}
                    onChange={(e) => setNewGoalPriority(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Med">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Hours/Wk</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newGoalTargetHours}
                    onChange={(e) => setNewGoalTargetHours(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="Studies">Studies</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Personal">Personal</option>
                    <option value="Career">Career</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Date</label>
                  <input
                    type="text"
                    value={newGoalDue}
                    onChange={(e) => setNewGoalDue(e.target.value)}
                    placeholder="e.g. Dec 15 or 2026-12-15"
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGoal || !newGoalName.trim()}
                  className={`px-5 py-2 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all ${
                    isSubmittingGoal || !newGoalName.trim()
                      ? 'bg-primary/50 text-on-primary/70 cursor-not-allowed'
                      : 'bg-primary text-on-primary hover:bg-surface-tint active:scale-95'
                  }`}
                >
                  {isSubmittingGoal ? (
                    <>
                      <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">save</span>
                      Save Goal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GOAL MODAL */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Edit Goal</h3>
            
            <form onSubmit={handleSaveGoalEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingGoal.description || ''}
                  onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                  placeholder="Milestones or description..."
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={editingGoal.priority}
                    onChange={(e) => setEditingGoal({ ...editingGoal, priority: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Med">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Hours/Wk</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingGoal.targetHoursPerWeek || 10}
                    onChange={(e) => setEditingGoal({ ...editingGoal, targetHoursPerWeek: Number(e.target.value) })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={editingGoal.category || 'Studies'}
                    onChange={(e) => setEditingGoal({ ...editingGoal, category: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  >
                    <option value="Studies">Studies</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Personal">Personal</option>
                    <option value="Career">Career</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Date</label>
                  <input
                    type="text"
                    value={editingGoal.due || ''}
                    onChange={(e) => setEditingGoal({ ...editingGoal, due: e.target.value })}
                    placeholder="e.g. Dec 15 or 2026-12-15"
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm hover:bg-surface-tint"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Edit Profile</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE GOAL CONFIRMATION MODAL */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
              <h3 className="text-headline-md text-on-surface font-bold text-lg">Delete Goal?</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to delete <strong>"{goalToDelete.name}"</strong>? This will remove all associated target stats.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGoalToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteGoal}
                className="px-4 py-2 text-xs font-bold bg-error text-on-error rounded-lg shadow-sm hover:bg-error/90"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
