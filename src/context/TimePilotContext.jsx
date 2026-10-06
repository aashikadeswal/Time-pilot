import React, { createContext, useContext, useState, useEffect } from 'react';

const TimePilotContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'timepilot_user',
  TASKS: 'timepilot_tasks',
  COMMITMENTS: 'timepilot_commitments',
  GOALS: 'timepilot_goals',
  FOCUS_HISTORY: 'timepilot_focus_history',
  CHAT_HISTORY: 'timepilot_chat_history',
  SETTINGS: 'timepilot_settings'
};

const INITIAL_USER = {
  name: 'Ashika',
  email: 'ashika@student.edu',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALzdez3qfxdaYGTtcpF7k1j9YIRBuRJdmDCUmHeonyv3vuiXbTz_IF6H3fb-1D-b7e5DKaINv9mWHH-WztaVO9UvO24fHBjV18v3n9-enf-quau4qT67eXETDT9R2SuQprf6N5UlafzatCcjOJVOswGRbN4GrOBgbTeSmWtBdXjlsFSZ6NkZmKA9gPlcU4ATcKzExG61kRp59D_YWZjX88oaSUWTvqUTeb3e7d8R6WKELXbdtMUgzREg',
  institution: 'University of Delhi',
  field: 'Political Science & Law'
};

const INITIAL_GOALS = [
  {
    id: 'g-1',
    name: 'Political Science Revision',
    category: 'Studies',
    priority: 'High',
    progress: 78,
    due: 'Nov 15',
    status: 'active',
    focusLoggedMinutes: 7440, // 124h
    streakDays: 5,
    targetHoursPerWeek: 15,
    icon: 'school'
  },
  {
    id: 'g-2',
    name: 'SSC Preparation',
    category: 'Competitive Exams',
    priority: 'High',
    progress: 64,
    due: 'Dec 01',
    status: 'active',
    focusLoggedMinutes: 2520, // 42h
    streakDays: 3,
    targetHoursPerWeek: 10,
    icon: 'menu_book'
  },
  {
    id: 'g-3',
    name: 'Health & Fitness',
    category: 'Personal',
    priority: 'Med',
    progress: 52,
    due: 'Ongoing',
    status: 'active',
    focusLoggedMinutes: 1080, // 18h
    streakDays: 4,
    targetHoursPerWeek: 5,
    icon: 'fitness_center'
  },
  {
    id: 'g-4',
    name: 'Research Paper Methodology',
    category: 'Thesis',
    priority: 'Med',
    progress: 40,
    due: 'Nov 30',
    status: 'active',
    focusLoggedMinutes: 1800, // 30h
    streakDays: 2,
    targetHoursPerWeek: 8,
    icon: 'article'
  }
];

const INITIAL_COMMITMENTS = [
  {
    id: 'c-1',
    time: '09:00',
    endTime: '15:00',
    name: 'College Lectures',
    type: 'Fixed',
    duration: '6h',
    durationMins: 360,
    location: 'Campus Block B',
    color: 'bg-surface-variant',
    line: 'bg-outline',
    icon: 'school'
  },
  {
    id: 'c-2',
    time: '15:00',
    endTime: '16:00',
    name: 'Travel & Commute',
    type: 'Fixed',
    duration: '1h',
    durationMins: 60,
    location: 'Metro Route',
    color: 'bg-surface-variant',
    line: 'bg-outline',
    icon: 'directions_transit'
  },
  {
    id: 'c-3',
    time: '16:00',
    endTime: '17:00',
    name: 'Flexible Study Block',
    type: 'Flexible',
    duration: '1h',
    durationMins: 60,
    location: 'Home Desk',
    color: 'bg-primary',
    line: 'bg-primary/50',
    icon: 'schedule'
  },
  {
    id: 'c-4',
    time: '17:00',
    endTime: '18:00',
    name: 'Political Science Revision',
    type: 'Planned',
    duration: '1h',
    durationMins: 60,
    location: 'Library',
    color: 'bg-surface',
    ring: 'ring-4 ring-primary',
    line: 'bg-primary',
    icon: 'assignment'
  },
  {
    id: 'c-5',
    time: '18:00',
    endTime: '19:15',
    name: 'Flexible Evening Block',
    type: 'Flexible',
    duration: '1h 15m',
    durationMins: 75,
    location: 'Home Desk',
    color: 'bg-primary',
    line: 'bg-primary/50',
    icon: 'schedule'
  },
  {
    id: 'c-6',
    time: '19:15',
    endTime: '20:15',
    name: 'Gym & Fitness',
    type: 'Personal',
    duration: '1h',
    durationMins: 60,
    location: 'Fitness Center',
    color: 'bg-tertiary-container',
    line: 'bg-tertiary',
    icon: 'fitness_center'
  },
  {
    id: 'c-7',
    time: '20:30',
    endTime: '22:00',
    name: 'Dinner & Wind Down',
    type: 'Rest',
    duration: '1h 30m',
    durationMins: 90,
    location: 'Home',
    color: 'bg-secondary-container',
    line: 'bg-secondary-container',
    icon: 'restaurant'
  },
  {
    id: 'c-8',
    time: '23:00',
    endTime: '07:00',
    name: 'Sleep',
    type: 'Rest',
    duration: '8h',
    durationMins: 480,
    location: 'Bedroom',
    color: 'bg-secondary-container',
    line: 'bg-secondary-container',
    opacity: 'opacity-70',
    icon: 'bedtime'
  }
];

const INITIAL_TASKS = [
  {
    id: 't-1',
    name: 'Political Science Revision',
    priority: 'High',
    duration: 45,
    category: 'Studies',
    type: 'Flexible',
    goalId: 'g-1',
    scheduledTime: '16:00',
    scheduledDate: 'today',
    completed: false,
    missed: false,
    rescheduled: false,
    reasonWhy: 'High priority, aligns with your Political Science goal, and fits before dinner.'
  },
  {
    id: 't-2',
    name: 'SSC Quantitative Aptitude Practice',
    priority: 'High',
    duration: 60,
    category: 'Competitive Exams',
    type: 'Flexible',
    goalId: 'g-2',
    scheduledTime: '17:00',
    scheduledDate: 'today',
    completed: false,
    missed: false,
    rescheduled: false,
    reasonWhy: 'High priority exam preparation session.'
  },
  {
    id: 't-3',
    name: 'Review Chapter 4 literature notes',
    priority: 'Med',
    duration: 30,
    category: 'Thesis',
    type: 'Flexible',
    goalId: 'g-4',
    scheduledTime: '18:15',
    scheduledDate: 'today',
    completed: false,
    missed: false,
    rescheduled: false,
    reasonWhy: 'Med priority thesis check.'
  },
  {
    id: 't-4',
    name: 'Email Professor regarding research draft',
    priority: 'Low',
    duration: 15,
    category: 'Admin',
    type: 'Personal',
    goalId: null,
    scheduledTime: '12:30',
    scheduledDate: 'today',
    completed: true,
    missed: false,
    rescheduled: false,
    reasonWhy: 'Quick administrative task.'
  }
];

const INITIAL_FOCUS_HISTORY = [
  {
    id: 'fh-1',
    category: 'Political Science Revision',
    goalId: 'g-1',
    secondsLogged: 2700, // 45m
    completed: true,
    sentiment: 'Focused',
    distractionReason: '',
    timestamp: 'Today, 11:30 AM'
  },
  {
    id: 'fh-2',
    category: 'SSC Quantitative Aptitude',
    goalId: 'g-2',
    secondsLogged: 2100, // 35m
    completed: true,
    sentiment: 'Mostly focused',
    distractionReason: 'Phone notification',
    timestamp: 'Yesterday, 5:00 PM'
  },
  {
    id: 'fh-3',
    category: 'Research Paper Methodology',
    goalId: 'g-4',
    secondsLogged: 3600, // 60m
    completed: true,
    sentiment: 'Focused',
    distractionReason: '',
    timestamp: 'Yesterday, 10:00 AM'
  },
  {
    id: 'fh-4',
    category: 'Constitutional Law Case Studies',
    goalId: 'g-1',
    secondsLogged: 1800, // 30m
    completed: true,
    sentiment: 'Focused',
    distractionReason: '',
    timestamp: '2 days ago'
  }
];

const INITIAL_CHAT_HISTORY = [
  {
    id: 'm-1',
    sender: 'coach',
    text: "Hello Ashika! I'm your TimePilot Coach. I keep track of your commitments, available study hours, and priorities. What's on your mind today?"
  }
];

const INITIAL_SETTINGS = {
  notifications: true,
  autoSchedule: true,
  dailyDigest: true,
  dayStartTime: '08:00',
  dayEndTime: '23:00',
  defaultSessionMins: 45,
  targetWeeklyHours: 25
};

export function TimePilotProvider({ children }) {
  // Load from localStorage or defaults
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [commitments, setCommitments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMITMENTS);
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [focusHistory, setFocusHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOCUS_HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_FOCUS_HISTORY;
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_HISTORY;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Active task for Focus Center
  const [activeFocusTask, setActiveFocusTask] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMITMENTS, JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOCUS_HISTORY, JSON.stringify(focusHistory));
  }, [focusHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // --- Flexible Available Time Calculation ---
  // Calculates flexible study time available in the day (minutes)
  const getFlexibleMinutesAvailable = () => {
    // 24 hours = 1440 mins
    // Deduct all Fixed and Rest commitments
    const fixedAndRestMins = commitments
      .filter(c => c.type === 'Fixed' || c.type === 'Rest')
      .reduce((sum, c) => {
        if (c.durationMins) return sum + c.durationMins;
        const h = parseInt(c.duration) || 0;
        return sum + h * 60;
      }, 0);

    const available = Math.max(1440 - fixedAndRestMins, 135); // at least 2h 15m default
    return available;
  };

  // Planned tasks total duration (uncompleted tasks scheduled for today)
  const getTotalPlannedMinutes = () => {
    return tasks
      .filter(t => !t.completed && t.scheduledDate !== 'tomorrow')
      .reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
  };

  // Capacity Check
  const getCapacityStatus = () => {
    const planned = getTotalPlannedMinutes();
    const available = getFlexibleMinutesAvailable();
    const isOverCapacity = planned > available;
    const overMins = isOverCapacity ? planned - available : 0;
    const percentage = available > 0 ? Math.round((planned / available) * 100) : 0;

    return {
      totalPlannedMinutes: planned,
      availableMinutes: available,
      isOverCapacity,
      overMins,
      percentage
    };
  };

  // Smart Recommendation: "What should I do now?" / "Up Next"
  const getRecommendation = () => {
    const uncompletedToday = tasks.filter(t => !t.completed && t.scheduledDate !== 'tomorrow');
    if (uncompletedToday.length === 0) return null;

    // Sort by Priority: High > Med > Low, then by duration fit
    const priorityWeight = { High: 3, Med: 2, Low: 1 };
    const sorted = [...uncompletedToday].sort((a, b) => {
      const pDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return a.duration - b.duration;
    });

    const topTask = sorted[0];
    const availableFreeBlockMins = 50; // Mock current window before next commitment

    return {
      task: topTask,
      availableWindowMins: availableFreeBlockMins,
      fits: topTask.duration <= availableFreeBlockMins,
      title: topTask.name,
      duration: topTask.duration,
      priority: topTask.priority,
      category: topTask.category,
      reason: `You have ${availableFreeBlockMins} minutes before your next commitment. Recommended: ${topTask.name} — ${topTask.duration} min. It matches your top priority and fits your available window perfectly.`
    };
  };

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      id: String(Date.now()),
      name: taskData.name || 'New Focus Task',
      priority: taskData.priority || 'Med',
      duration: Number(taskData.duration) || 45,
      category: taskData.category || 'Studies',
      type: taskData.type || 'Flexible',
      goalId: taskData.goalId || null,
      scheduledTime: taskData.scheduledTime || '16:00',
      scheduledDate: taskData.scheduledDate || 'today',
      completed: false,
      missed: false,
      rescheduled: false,
      reasonWhy: taskData.reasonWhy || 'Planned task for today.'
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return { ...t, completed: nextCompleted, missed: false };
        }
        return t;
      })
    );
  };

  const moveTaskToTomorrow = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, scheduledDate: 'tomorrow', rescheduled: true, missed: false } : t))
    );
  };

  const shortenTask = (taskId, newDuration) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, duration: Number(newDuration), rescheduled: true } : t))
    );
  };

  const markTaskMissed = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, missed: true } : t))
    );
  };

  const rescheduleMissedTask = (taskId, newTime, newDuration = null) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            scheduledTime: newTime,
            duration: newDuration ? Number(newDuration) : t.duration,
            missed: false,
            rescheduled: true
          };
        }
        return t;
      })
    );
  };

  // Schedule Recovery System: "Today Didn't Go As Planned"
  const recoverSchedule = (strategy = 'smart_balance') => {
    setTasks(prev => {
      let uncompleted = prev.filter(t => !t.completed && t.scheduledDate !== 'tomorrow');
      const completed = prev.filter(t => t.completed || t.scheduledDate === 'tomorrow');

      if (strategy === 'move_low_priority') {
        // Move low priority to tomorrow
        const updated = uncompleted.map(t => {
          if (t.priority === 'Low') {
            return { ...t, scheduledDate: 'tomorrow', rescheduled: true, missed: false };
          }
          return { ...t, missed: false, rescheduled: true };
        });
        return [...completed, ...updated];
      }

      if (strategy === 'shorten_sessions') {
        // Shorten sessions > 45m by 15-30m
        const updated = uncompleted.map(t => {
          if (t.duration > 45) {
            return { ...t, duration: Math.max(30, t.duration - 20), rescheduled: true, missed: false };
          }
          return { ...t, missed: false };
        });
        return [...completed, ...updated];
      }

      // Default smart_balance: Keep highest priority, shorten remaining, move low priority
      const highAndMed = uncompleted.filter(t => t.priority === 'High' || t.priority === 'Med');
      const low = uncompleted.filter(t => t.priority === 'Low');

      const balancedHighMed = highAndMed.map((t, idx) => ({
        ...t,
        duration: t.duration > 45 ? 45 : t.duration,
        scheduledTime: idx === 0 ? '17:30' : '18:30',
        missed: false,
        rescheduled: true
      }));

      const movedLow = low.map(t => ({
        ...t,
        scheduledDate: 'tomorrow',
        rescheduled: true,
        missed: false
      }));

      return [...completed, ...balancedHighMed, ...movedLow];
    });
  };

  // Commitment Actions
  const addCommitment = (cData) => {
    const newC = {
      id: String(Date.now()),
      time: cData.time || '12:00',
      endTime: cData.endTime || '13:00',
      name: cData.name || 'Activity',
      type: cData.type || 'Fixed',
      duration: cData.duration || '1h',
      durationMins: cData.durationMins || 60,
      location: cData.location || '',
      icon: cData.icon || 'schedule',
      color: cData.type === 'Flexible' ? 'bg-primary' : cData.type === 'Rest' ? 'bg-secondary-container' : 'bg-surface-variant',
      line: cData.type === 'Flexible' ? 'bg-primary/50' : cData.type === 'Rest' ? 'bg-secondary-container' : 'bg-outline'
    };
    setCommitments(prev => [...prev, newC].sort((a, b) => a.time.localeCompare(b.time)));
    return newC;
  };

  const deleteCommitment = (cId) => {
    setCommitments(prev => prev.filter(c => c.id !== cId));
  };

  // Goal Actions
  const addGoal = (gData) => {
    const newGoal = {
      id: String(Date.now()),
      name: gData.name,
      category: gData.category || 'General',
      priority: gData.priority || 'High',
      progress: 0,
      due: gData.due || 'Next Month',
      status: 'active',
      focusLoggedMinutes: 0,
      streakDays: 0,
      targetHoursPerWeek: Number(gData.targetHoursPerWeek) || 10,
      icon: gData.icon || 'flag'
    };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = (gId, updates) => {
    setGoals(prev => prev.map(g => (g.id === gId ? { ...g, ...updates } : g)));
  };

  const toggleGoalPause = (gId) => {
    setGoals(prev =>
      prev.map(g => (g.id === gId ? { ...g, status: g.status === 'active' ? 'paused' : 'active' } : g))
    );
  };

  const deleteGoal = (gId) => {
    setGoals(prev => prev.filter(g => g.id !== gId));
  };

  // Focus Log Action
  const logFocusSession = (sessionData) => {
    const newSession = {
      id: String(Date.now()),
      category: sessionData.category || 'Deep Focus',
      goalId: sessionData.goalId || null,
      secondsLogged: Number(sessionData.secondsLogged) || 1800,
      completed: Boolean(sessionData.completed),
      sentiment: sessionData.sentiment || 'Focused',
      distractionReason: sessionData.distractionReason || '',
      timestamp: 'Just now'
    };

    setFocusHistory(prev => [newSession, ...prev]);

    // Update goal focus hours if goal matches
    if (sessionData.goalId || sessionData.category) {
      setGoals(prev =>
        prev.map(g => {
          if (g.id === sessionData.goalId || g.name === sessionData.category) {
            const addedMins = Math.round(newSession.secondsLogged / 60);
            const newTotalMins = (g.focusLoggedMinutes || 0) + addedMins;
            const targetMins = (g.targetHoursPerWeek || 10) * 60;
            const newProg = Math.min(100, Math.round((newTotalMins / targetMins) * 100));
            return {
              ...g,
              focusLoggedMinutes: newTotalMins,
              progress: Math.max(g.progress, newProg)
            };
          }
          return g;
        })
      );
    }

    return newSession;
  };

  // AI Coach Chat
  const sendChatMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: userText
    };

    setChatHistory(prev => [...prev, userMsg]);

    // Context-aware response generation
    const textLower = userText.toLowerCase();
    let reply = '';

    const capacity = getCapacityStatus();
    const rec = getRecommendation();

    if (textLower.includes('what should i do') || textLower.includes('right now') || textLower.includes('prioritize')) {
      if (rec) {
        reply = `You have about ${rec.availableWindowMins} minutes before your next fixed commitment. I recommend working on **${rec.title}** (${rec.duration}m). It aligns directly with your **${rec.category}** goal and is your highest priority task for today.`;
      } else {
        reply = "You've completed all scheduled tasks for today! Take a well-deserved break or wind down early.";
      }
    } else if (textLower.includes('missed') || textLower.includes('didn\'t go as planned') || textLower.includes('behind')) {
      reply = `Don't worry, schedule changes happen! You currently have ${tasks.filter(t => !t.completed).length} incomplete tasks. Would you like me to:\n1. **Move low-priority tasks to tomorrow**\n2. **Shorten remaining sessions by 15-20 minutes**\n3. **Run 1-Click Recovery** on your schedule?`;
    } else if (textLower.includes('capacity') || textLower.includes('too much') || textLower.includes('fit')) {
      if (capacity.isOverCapacity) {
        reply = `Your day is currently **over capacity** by ${Math.floor(capacity.overMins / 60)}h ${capacity.overMins % 60}m. You planned ${Math.floor(capacity.totalPlannedMinutes / 60)}h ${capacity.totalPlannedMinutes % 60}m of tasks, but only have ${Math.floor(capacity.availableMinutes / 60)}h ${capacity.availableMinutes % 60}m of flexible time. I recommend moving low-priority tasks to tomorrow.`;
      } else {
        reply = `Your day looks realistic! You have planned ${Math.floor(capacity.totalPlannedMinutes / 60)}h ${capacity.totalPlannedMinutes % 60}m out of ${Math.floor(capacity.availableMinutes / 60)}h ${capacity.availableMinutes % 60}m available (${capacity.percentage}% capacity). You have buffer time built in.`;
      }
    } else if (textLower.includes('postponing') || textLower.includes('procrastinat') || textLower.includes('focus')) {
      reply = "When postponing revision, the friction is usually starting, not doing. Try a gentle **15-minute starter session** in the Focus Center with no pressure to finish everything. Small starts build momentum.";
    } else {
      reply = `I'm analyzing your schedule for **${user.name}**. You have ${tasks.filter(t => !t.completed).length} tasks remaining today. Let me know if you want me to rebalance your timeline, start a focus timer, or check capacity!`;
    }

    const coachMsg = {
      id: String(Date.now() + 1),
      sender: 'coach',
      text: reply
    };

    setChatHistory(prev => [...prev, coachMsg]);
  };

  const value = {
    user,
    setUser,
    goals,
    commitments,
    tasks,
    focusHistory,
    chatHistory,
    settings,
    setSettings,
    activeFocusTask,
    setActiveFocusTask,
    // Methods
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    moveTaskToTomorrow,
    shortenTask,
    markTaskMissed,
    rescheduleMissedTask,
    recoverSchedule,
    addCommitment,
    deleteCommitment,
    addGoal,
    updateGoal,
    toggleGoalPause,
    deleteGoal,
    logFocusSession,
    sendChatMessage,
    getFlexibleMinutesAvailable,
    getTotalPlannedMinutes,
    getCapacityStatus,
    getRecommendation
  };

  return (
    <TimePilotContext.Provider value={value}>
      {children}
    </TimePilotContext.Provider>
  );
}

export function useTimePilot() {
  const context = useContext(TimePilotContext);
  if (!context) {
    throw new Error('useTimePilot must be used within a TimePilotProvider');
  }
  return context;
}
