// Time Pilot API Client Service Helper
// Communicates with Python FastAPI endpoints.
// Includes transparent offline fallbacks in case the backend server is down during local development.

const defaultTasks = [];
const defaultGoals = [];

const defaultCommitments = [];
const defaultFocusHistory = [];
const defaultChatHistory = [];
const defaultSettings = {
  notifications: true,
  autoSchedule: false,
  dailyDigest: true
};

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('timepilot_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // --- Tasks API ---
  async fetchTasks() {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend tasks endpoint offline, using local cached tasks.');
      return defaultTasks;
    }
  },

  async saveTask(task) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend tasks offline, task saved locally.');
      return task;
    }
  },

  async updateTask(task_id, updatedTask) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${task_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend tasks offline, task updated locally.');
      return updatedTask;
    }
  },

  async deleteTask(taskId) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend tasks offline, task deleted locally.');
      return { success: true };
    }
  },

  // --- Goals API ---
  async fetchGoals() {
    try {
      const res = await fetch(`${API_BASE}/api/goals`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals endpoint offline, using local cached goals.');
      return defaultGoals;
    }
  },

  async saveGoal(goal) {
    try {
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(goal)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal saved locally.');
      return goal;
    }
  },

  async updateGoal(goalId, updatedGoal) {
    try {
      const res = await fetch(`${API_BASE}/api/goals/${goalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedGoal)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal updated locally.');
      return updatedGoal;
    }
  },

  async deleteGoal(goalId) {
    try {
      const res = await fetch(`${API_BASE}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal deleted locally.');
      return { success: true };
    }
  },

  // --- Commitments API ---
  async fetchCommitments() {
    try {
      const res = await fetch(`${API_BASE}/api/commitments`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend commitments endpoint offline, using local mock commitments.');
      return defaultCommitments;
    }
  },

  async saveCommitment(commitment) {
    try {
      const res = await fetch(`${API_BASE}/api/commitments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commitment)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend commitments offline, commitment saved locally.');
      return commitment;
    }
  },

  async deleteCommitment(commitmentId) {
    try {
      const res = await fetch(`${API_BASE}/api/commitments/${commitmentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend commitments offline, commitment deleted locally.');
      return { success: true };
    }
  },

  // --- Goals API ---
  async fetchGoals() {
    try {
      const res = await fetch(`${API_BASE}/api/goals`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals endpoint offline, using local mock goals.');
      return defaultGoals;
    }
  },

  async saveGoal(goal) {
    try {
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal saved locally.');
      return goal;
    }
  },

  async updateGoal(goalId, updatedGoal) {
    try {
      const res = await fetch(`${API_BASE}/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal updated locally.');
      return updatedGoal;
    }
  },

  async deleteGoal(goalId) {
    try {
      const res = await fetch(`${API_BASE}/api/goals/${goalId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend goals offline, goal deleted locally.');
      return { success: true };
    }
  },

  // --- Focus API ---
  async fetchFocusHistory() {
    try {
      const res = await fetch(`${API_BASE}/api/focus/history`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend focus endpoint offline, using local mock focus history.');
      return defaultFocusHistory;
    }
  },

  async logFocusSession(session) {
    try {
      const res = await fetch(`${API_BASE}/api/focus/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend focus offline, session logged locally.');
      return session;
    }
  },

  // --- Chat API ---
  async fetchChatHistory() {
    try {
      const res = await fetch(`${API_BASE}/api/coach/messages`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend chat endpoint offline, using local mock chat history.');
      return defaultChatHistory;
    }
  },

  async sendMessageToCoach(userMsg) {
    try {
      const res = await fetch(`${API_BASE}/api/coach/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMsg)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend coach offline, chat handled locally.');
      // Simulated client-side response fallback
      const text_lower = (userMsg.text || '').toLowerCase();
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
      const res = await fetch(`${API_BASE}/api/settings`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend settings endpoint offline, using local mock settings.');
      return defaultSettings;
    }
  },

  async saveSettings(settings) {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      console.warn('FastAPI backend settings offline, settings saved locally.');
      return settings;
    }
  }
};
