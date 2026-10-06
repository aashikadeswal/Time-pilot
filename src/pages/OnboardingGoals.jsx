import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimePilot } from '../context/TimePilotContext';

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const { goals, addGoal } = useTimePilot();

  const [selectedGoals, setSelectedGoals] = useState([
    'Political Science Revision',
    'SSC Preparation'
  ]);
  const [customGoalName, setCustomGoalName] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('High');

  const presetGoals = [
    { id: 'college', name: 'Political Science Revision', category: 'Studies', icon: 'school' },
    { id: 'exams', name: 'SSC Preparation', category: 'Competitive Exams', icon: 'menu_book' },
    { id: 'fitness', name: 'Health & Fitness', category: 'Personal', icon: 'fitness_center' },
    { id: 'thesis', name: 'Research Methodology', category: 'Thesis', icon: 'article' },
    { id: 'skills', name: 'Skill Development', category: 'Skills', icon: 'settings' },
    { id: 'hobbies', name: 'Personal Hobbies', category: 'Personal', icon: 'palette' },
    { id: 'reading', name: 'Reading & Literature', category: 'Reading', icon: 'auto_stories' },
    { id: 'career', name: 'Career & Internships', category: 'Career', icon: 'work' }
  ];

  const handleToggle = (name) => {
    setSelectedGoals(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const handleAddCustomGoal = (e) => {
    e.preventDefault();
    if (!customGoalName.trim()) return;
    const name = customGoalName.trim();
    if (!selectedGoals.includes(name)) {
      setSelectedGoals(prev => [...prev, name]);
      addGoal({
        name,
        category: 'Personal',
        priority: selectedPriority,
        targetHoursPerWeek: 10
      });
    }
    setCustomGoalName('');
    setShowAddCustom(false);
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      navigate('/onboarding/typical-day');
    }
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Progress Section: Step 1 of 3 */}
      <div className="flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
        <div className="flex items-center justify-between mb-unit">
          <span className="text-label-md text-primary font-bold">Step 1 of 3</span>
          <span className="text-label-md text-outline font-semibold">Goal Setting & Priorities</span>
        </div>
        <div className="w-full h-[4px] bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '33.3%' }}></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg max-w-container-max mx-auto w-full">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-background mb-unit text-center md:text-left font-bold">
          What are you working towards?
        </h1>
        <p className="text-body-md md:text-body-lg text-on-surface-variant text-center md:text-left font-medium">
          Select what matters most. TimePilot will use these to prioritize your focus blocks.
        </p>
      </div>

      {/* Grid Section */}
      <div className="flex-1 px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-unit md:gap-stack-md">
          {presetGoals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.name);
            return (
              <button
                key={goal.id}
                aria-pressed={isSelected}
                onClick={() => handleToggle(goal.name)}
                className={`flex flex-col items-center justify-center p-stack-md rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden active:scale-95 text-center ${
                  isSelected 
                    ? 'bg-primary-container/20 ring-2 ring-primary bg-surface-container-lowest' 
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-unit transition-colors ${
                  isSelected 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-headline-md">
                    {goal.icon}
                  </span>
                </div>
                
                <span className={`text-label-md font-bold transition-colors ${
                  isSelected ? 'text-primary' : 'text-on-surface'
                }`}>
                  {goal.name}
                </span>

                {isSelected && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">check</span> Priority
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Custom Goal Button */}
        <div className="mt-6 max-w-md mx-auto">
          {!showAddCustom ? (
            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full py-3 rounded-xl border-dashed border-2 border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/50 font-label-md flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Custom Goal
            </button>
          ) : (
            <form onSubmit={handleAddCustomGoal} className="bg-surface-container rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-label-sm text-on-surface font-bold block">New Goal Name</label>
              <input
                type="text"
                value={customGoalName}
                onChange={(e) => setCustomGoalName(e.target.value)}
                placeholder="e.g. Constitutional Law Revision"
                className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-4 py-2 rounded-lg text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container-high"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customGoalName.trim()}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-sm font-bold shadow-sm"
                >
                  Add Goal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex justify-between items-center max-w-container-max mx-auto w-full pb-12 md:pb-stack-lg">
        <button 
          onClick={() => navigate('/')}
          className="text-on-surface-variant hover:text-on-surface font-semibold text-label-md flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <button 
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className={`text-label-md px-8 py-3.5 rounded-full flex items-center gap-2 transition-all active:scale-95 font-bold ${
            selectedGoals.length > 0
              ? 'bg-primary text-on-primary shadow-md hover:bg-surface-tint'
              : 'bg-primary text-on-primary opacity-50 cursor-not-allowed'
          }`}
        >
          Continue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
