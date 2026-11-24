/**
 * Authentication Context for Time Pilot
 * Manages user authentication state, JWT tokens, login/signup/logout flows,
 * session persistence, and password recovery.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'timepilot_auth_token';
const USER_KEY = 'timepilot_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user && !!token;

  // ----- Persist to localStorage -----
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  // ----- API Helper -----
  const authFetch = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    let res;
    try {
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      throw new Error(`Network error: Unable to reach server (${networkErr.message || 'connection failed'}). Check your backend connection or VITE_API_URL.`);
    }
    
    // Safely parse the response text first so empty/HTML responses (204, 404, 405, 500) don't crash JSON.parse()
    const text = await res.text();
    let data = null;
    
    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        // Response was not valid JSON (e.g., HTML 404/502 page from proxy/CDN or empty response)
        const preview = text.length > 120 ? text.slice(0, 120) + '...' : text;
        throw new Error(
          `Server returned HTTP ${res.status} ${res.statusText || ''} with non-JSON body: ${preview}`
        );
      }
    }
    
    if (!res.ok) {
      const errMsg =
        data?.detail ||
        data?.message ||
        (typeof data === 'string' ? data : null) ||
        `Request failed with status ${res.status} (${res.statusText || 'Error'})`;
      throw new Error(errMsg);
    }
    
    // If response was 204 No Content or body was empty but OK (200-299)
    return data || { success: true };
  }, [token]);

  // ----- Validate session on mount -----
  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authFetch('/api/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Invalid session
          setToken(null);
          setUser(null);
        }
      } catch {
        // Token expired or invalid — clear session silently
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Signup -----
  const signup = async ({ name, email, password, institution, field_of_study }) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, institution, field_of_study }),
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message };
    } catch (err) {
      const message = err.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Login -----
  const login = async ({ email, password }) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Logout -----
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Also try to call backend logout (best effort)
    fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' }).catch(() => {});
  }, []);

  // ----- Forgot Password -----
  const forgotPassword = async (email) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { success: true, message: data.message, token: data.token };
    } catch (err) {
      const message = err.message || 'Request failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Reset Password -----
  const resetPassword = async (resetToken, newPassword) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, new_password: newPassword }),
      });

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
      }
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.message || 'Password reset failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Change Password (while logged in) -----
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.message || 'Password change failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Update Profile -----
  const updateProfile = async (updates) => {
    setError(null);
    try {
      const data = await authFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (data.success && data.user) {
        setUser(data.user);
      }
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.message || 'Profile update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // ----- Complete Onboarding -----
  const completeOnboarding = async () => {
    try {
      const data = await authFetch('/api/auth/complete-onboarding', {
        method: 'POST',
      });
      if (data.success && data.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    completeOnboarding,
    clearError,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
