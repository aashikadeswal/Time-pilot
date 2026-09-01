import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goalsList = [
    { id: 'college', name: 'College Studies', icon: 'school' },
    { id: 'exams', name: 'Competitive Exams', icon: 'menu_book' },
    { id: 'fitness', name: 'Health & Fitness', icon: 'fitness_center' },
    { id: 'skills', name: 'Skill Development', icon: 'settings' },
    { id: 'hobbies', name: 'Personal Hobbies', icon: 'palette' },
    { id: 'reading', name: 'Reading', icon: 'auto_stories' },
    { id: 'language', name: 'Language Learning', icon: 'language' },
    { id: 'career', name: 'Career Prep', icon: 'work' }
  ];

  const handleToggle = (id) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      navigate('/onboarding/typical-day');
    }
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Progress Section */}
      <div className="flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md">
        <div className="flex items-center justify-between mb-unit">
          <span className="text-label-md text-outline font-semibold">Step 1 of 5</span>
          <span className="text-label-md text-outline font-semibold">Goal Setting</span>
        </div>
        <div className="w-full h-[4px] bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '20%' }}></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg max-w-container-max mx-auto w-full">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-background mb-unit text-center md:text-left font-bold">
          What are you working towards?
        </h1>
        <p className="text-body-md md:text-body-lg text-on-surface-variant text-center md:text-left font-medium">
          Select all that apply. We'll help you balance them.
        </p>
      </div>

      {/* Grid Section */}
      <div className="flex-1 px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-unit md:gap-stack-md">
          {goalsList.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                aria-pressed={isSelected}
                onClick={() => handleToggle(goal.id)}
                className={`flex flex-col items-center justify-center p-stack-md rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden active:scale-95 group ${
                  isSelected 
                    ? 'bg-primary-container/20 ring-2 ring-primary bg-surface-container-lowest' 
                    : 'bg-surface-container-low'
                }`}
              >
                <div className={`absolute inset-0 bg-primary rounded-xl transition-opacity ${
                  isSelected ? 'opacity-5' : 'opacity-0'
                }`}></div>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-unit transition-colors ${
                  isSelected 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-headline-md">
                    {goal.icon}
                  </span>
                </div>
                
                <span className={`text-label-md text-center font-semibold transition-colors ${
                  isSelected ? 'text-primary' : 'text-on-surface'
                }`}>
                  {goal.name}
                </span>
              </button>
            );
          })}
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
          className={`text-label-md px-8 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95 font-semibold ${
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
