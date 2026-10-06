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
    deleteGoal,
    settings,
    setSettings
  } = useTimePilot();

  const [activeTab, setActiveTab] = useState('goals'); // 'goals' | 'settings'

  // Add Goal Modal
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Studies');
  const [newGoalPriority, setNewGoalPriority] = useState('High');
  const [newGoalTargetHours, setNewGoalTargetHours] = useState(10);
  const [newGoalDue, setNewGoalDue] = useState('Dec 15');

  // Edit Goal Modal
  const [editingGoal, setEditingGoal] = useState(null);

  // Edit Profile Modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    addGoal({
      name: newGoalName.trim(),
      category: newGoalCategory,
      priority: newGoalPriority,
      targetHoursPerWeek: Number(newGoalTargetHours),
      due: newGoalDue
    });

    setNewGoalName('');
    setShowAddGoalModal(false);
  };

  const handleSaveGoalEdit = (e) => {
    e.preventDefault();
    if (!editingGoal) return;
    updateGoal(editingGoal.id, {
      name: editingGoal.name,
      priority: editingGoal.priority,
      category: editingGoal.category,
      targetHoursPerWeek: Number(editingGoal.targetHoursPerWeek),
      due: editingGoal.due
    });
    setEditingGoal(null);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: userName.trim(), email: userEmail.trim() });
    setShowEditProfile(false);
  };

  const handleToggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Layout title={activeTab === 'goals' ? 'Goals' : 'Settings'} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full pb-16 text-left max-w-xl mx-auto animate-fade-in">
        
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
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold text-lg">Active Goals</h2>
                <p className="text-xs text-on-surface-variant font-medium">Priorities shaping your daily study schedule</p>
              </div>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-surface-tint"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => {
                const isHigh = goal.priority === 'High';
                const isMed = goal.priority === 'Med';
                const borderCol = isHigh ? 'bg-primary' : isMed ? 'bg-secondary' : 'bg-tertiary';
                const hoursLogged = Math.round((goal.focusLoggedMinutes || 0) / 60);
                const isPaused = goal.status === 'paused';

                return (
                  <div 
                    key={goal.id} 
                    className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm relative overflow-hidden border border-outline-variant/20 transition-all ${
                      isPaused ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderCol}`}></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-md text-on-surface font-bold text-[17px]">
                            {goal.name}
                          </h3>
                          {isPaused && (
                            <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full">
                              Paused
                            </span>
                          )}
                        </div>
                        <p className="font-label-md text-xs text-on-surface-variant mt-0.5 font-medium">
                          {goal.priority} Priority • Due {goal.due || 'Ongoing'} • {goal.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleGoalPause(goal.id)}
                          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full text-xs font-bold"
                          title={isPaused ? 'Resume Goal' : 'Pause Goal'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {isPaused ? 'play_circle' : 'pause_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => setEditingGoal(goal)}
                          className="text-on-surface-variant hover:text-primary p-1 rounded-full text-xs"
                          title="Edit Goal"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-on-surface-variant hover:text-error p-1 rounded-full text-xs"
                          title="Delete Goal"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full my-2 overflow-hidden pl-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          isHigh ? 'bg-primary' : isMed ? 'bg-secondary' : 'bg-tertiary'
                        }`}
                        style={{ width: `${goal.progress || 10}%` }}
                      ></div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mt-2 pt-2 bg-surface/50 rounded-xl px-3 py-2 text-xs font-semibold">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        <span>{hoursLogged}h focused</span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-sm">local_fire_department</span>
                        <span>{goal.streakDays || 3}d streak</span>
                      </div>
                      <div className="text-on-surface-variant">
                        Target: {goal.targetHoursPerWeek || 10}h/wk
                      </div>
                    </div>
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="bg-surface-container rounded-2xl p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-1">flag</span>
                  <p className="font-headline-md text-on-surface font-bold">Set your first goal</p>
                  <p className="text-xs mt-1">Goals help TimePilot recommend your highest priority focus tasks.</p>
                  <button
                    onClick={() => setShowAddGoalModal(true)}
                    className="mt-3 px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold"
                  >
                    Add Goal
                  </button>
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
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Add New Goal</h3>
            
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Political Science Case Law"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  autoFocus
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
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
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
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newGoalDue}
                    onChange={(e) => setNewGoalDue(e.target.value)}
                    placeholder="e.g. Dec 15"
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GOAL MODAL */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in text-left">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-headline-md text-on-surface font-bold text-[18px]">Edit Goal</h3>
            
            <form onSubmit={handleSaveGoalEdit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
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
                    <option value="High">🔴 High</option>
                    <option value="Med">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Target Hours/Wk</label>
                  <input
                    type="number"
                    value={editingGoal.targetHoursPerWeek || 10}
                    onChange={(e) => setEditingGoal({ ...editingGoal, targetHoursPerWeek: e.target.value })}
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2 text-on-surface text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg shadow-sm"
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

    </Layout>
  );
}
