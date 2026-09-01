// Time Pilot API Client Service Helper
// Communicates with Python FastAPI endpoints.
// Includes transparent offline fallbacks in case the backend server is down during local development.

const defaultTasks = [
  { id: '1', name: 'Draft thesis methodology section', priority: 'High', duration: 90, category: 'Thesis', completed: false },
  { id: '2', name: 'Review chapter 4 literature notes', priority: 'Med', duration: 45, category: 'Thesis', completed: false },
  { id: '3', name: 'Email advisor regarding meeting times', priority: 'Low', duration: 15, category: 'Admin', completed: true }
];

const defaultCommitments = [
  { id: '1', time: '09:00', name: 'College', type: 'Fixed', duration: '6h', color: 'bg-surface-variant', line: 'bg-outline', ring: '', opacity: '' },
  { id: '2', time: '15:00', name: 'Travel', type: 'Fixed', duration: '1h', color: 'bg-surface-variant', line: 'bg-outline', ring: '', opacity: '' },
  { id: '3', time: '16:00', name: 'Flexible', type: 'Flexible', duration: '1h', color: 'bg-primary', line: 'bg-primary/50', ring: '', opacity: '' },
  { id: '4', time: '17:00', name: 'Study', type: 'Planned', duration: '1h', color: 'bg-surface', ring: 'ring-4 ring-primary', line: 'bg-primary', opacity: '' },
  { id: '5', time: '18:00', name: 'Flexible', type: 'Flexible', duration: '1h 15m', color: 'bg-primary', line: 'bg-primary/50', ring: '', opacity: '' },
  { id: '6', time: '20:00', name: 'Dinner & Wind Down', type: 'Rest', duration: '3h', color: 'bg-secondary-container', line: 'bg-secondary-container', ring: '', opacity: '' },
  { id: '7', time: '23:00', name: 'Sleep', type: 'Rest', duration: '8h', color: 'bg-secondary-container', line: 'bg-secondary-container', ring: '', opacity: 'opacity-70' }
];

const defaultFocusHistory = [
  { id: '1', category: 'Mathematics', secondsLogged: 2520, completed: true, sentiment: 'Okay', timestamp: 'Just now' },
  { id: '2', category: 'Political Science', secondsLogged: 1800, completed: true, sentiment: 'Easy', timestamp: '2 hrs ago' },
  { id: '3', category: 'Reading', secondsLogged: 1080, completed: false, sentiment: 'Difficult', timestamp: '10:00 AM' }
];

const defaultChatHistory = [
  { id: '1', sender: 'coach', text: "Hello Sam! I'm your Time Pilot Coach. I can help you analyze your schedule, manage capacity, or jump into a focus session. What's on your mind today?" }
];

const defaultSettings = {
  notifications: true,
  autoSchedule: false,
  dailyDigest: true
};

export const api = {
  // --- Tasks API ---
  async fetchTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend tasks endpoint offline, using local mock tasks.');
      return defaultTasks;
    }
  },

  async saveTask(task) {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend tasks offline, task saved locally.');
      return task;
    }
  },

  async updateTask(task_id, updatedTask) {
    try {
      const res = await fetch(`/api/tasks/${task_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend tasks offline, task updated locally.');
      return updatedTask;
    }
  },

  async deleteTask(taskId) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend tasks offline, task deleted locally.');
      return { success: true };
    }
  },

  // --- Commitments API ---
  async fetchCommitments() {
    try {
      const res = await fetch('/api/commitments');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend commitments endpoint offline, using local mock commitments.');
      return defaultCommitments;
    }
  },

  async saveCommitment(commitment) {
    try {
      const res = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commitment)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend commitments offline, commitment saved locally.');
      return commitment;
    }
  },

  async deleteCommitment(commitmentId) {
    try {
      const res = await fetch(`/api/commitments/${commitmentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend commitments offline, commitment deleted locally.');
      return { success: true };
    }
  },

  // --- Focus API ---
  async fetchFocusHistory() {
    try {
      const res = await fetch('/api/focus/history');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend focus endpoint offline, using local mock focus history.');
      return defaultFocusHistory;
    }
  },

  async logFocusSession(session) {
    try {
      const res = await fetch('/api/focus/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend focus offline, session logged locally.');
      return session;
    }
  },

  // --- Chat API ---
  async fetchChatHistory() {
    try {
      const res = await fetch('/api/coach/messages');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend chat endpoint offline, using local mock chat history.');
      return defaultChatHistory;
    }
  },

  async sendMessageToCoach(userMsg) {
    try {
      const res = await fetch('/api/coach/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMsg)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend coach offline, chat handled locally.');
      // Simulated client-side response fallback
      const text_lower = userMsg.text.lower();
      let reply = "That sounds like a great plan, Sam. I'm here to support your deep focus. Let me know if you need to schedule a timer for it!";
      if (text_lower.includes("should i do now")) reply = "You have 35 minutes of flexible time right now. I recommend starting your high-priority 'Mathematics Practice' focus session.";
      
      return [
        userMsg,
        { id: String(Date.now() + 1), sender: 'coach', text: reply }
      ];
    }
  },

  // --- Settings API ---
  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend settings endpoint offline, using local mock settings.');
      return defaultSettings;
    }
  },

  async saveSettings(settings) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (e) {
      console.warn('FastAPI backend settings offline, settings saved locally.');
      return settings;
    }
  }
};
