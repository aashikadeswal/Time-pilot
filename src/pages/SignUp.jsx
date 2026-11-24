import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Client-side validation
    if (!name.trim()) {
      setLocalError('Name is required');
      return;
    }
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Za-z]/.test(password)) {
      setLocalError('Password must contain at least one letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setLocalError('Password must contain at least one number');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      institution: institution.trim(),
      field_of_study: fieldOfStudy.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/onboarding/goals');
    } else {
      setLocalError(result.error || 'Signup failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <div className="fixed top-0 w-full z-40 p-4 flex justify-between items-center max-w-4xl mx-auto left-0 right-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-xl bg-surface-container/60 hover:bg-surface-container backdrop-blur-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Home
        </button>
        {setDarkMode && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container/60 hover:bg-surface-container backdrop-blur-md text-on-surface-variant hover:text-on-surface transition-all active:scale-90"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}
      </div>

      <main className="flex-1 flex flex-col">
        <div className="flex flex-col w-full h-full min-h-[100dvh] bg-surface relative justify-center items-center px-6 py-12">
          {/* Ambient background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed-dim opacity-[0.03] blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-tertiary-fixed opacity-[0.03] blur-3xl"></div>
          </div>

          <div className="w-full max-w-sm flex flex-col items-center relative z-10 space-y-8 mt-12">
            {/* Header */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <img
                alt="Time Pilot Logo"
                className="w-14 h-14 rounded-2xl shadow-sm object-cover"
                src="https://lh3.googleusercontent.com/aida/AP1WRLu_r4dGIZwKFNOJuIZHmrubYRUwyt0u4hDAxuaqMLVox8TBRigOn39EturTFUryW0ieOArQ8UuzfB1gQqdY3jsmX3gqXRg6D-yfoM5-YtBe62I7l23D2WFpmhR_9XR_F6sDq_vxQIIk42AJGbC5Qon7-8E4iU47OO10c7Bsy3AOVFf669qATcTHSgJdnxQn70Prabz4BswGWNyRWiKugx4tn3sECrm8JTBH454OSj6AweI7DNn-2VfU_u87"
              />
              <div className="space-y-1.5">
                <h1 className="text-headline-lg-mobile text-on-surface tracking-tight font-bold">Create your account</h1>
                <p className="text-body-md text-on-surface-variant font-medium">Start your journey to better time management.</p>
              </div>
            </div>

            {/* Error Banner */}
            {displayError && (
              <div className="w-full bg-error-container/20 border border-error/30 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">error</span>
                <p className="text-body-md text-error font-medium flex-1">{displayError}</p>
                <button onClick={() => { setLocalError(''); clearError(); }} className="text-error/60 hover:text-error">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Signup Form */}
            <div className="w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,28,30,0.04)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed via-primary-container to-tertiary-container opacity-50"></div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-1.5 group">
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
                    <input
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                      id="signup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ashika Deswal"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5 group">
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="signup-email">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                    <input
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5 group">
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                    <input
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 letter + 1 number"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-outline hover:text-on-surface transition-colors focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 ml-1 mt-1">
                      <div className="flex gap-1 flex-1">
                        <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 8 ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
                        <div className={`h-1 flex-1 rounded-full transition-colors ${/[A-Za-z]/.test(password) && /[0-9]/.test(password) ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
                        <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 12 && /[^A-Za-z0-9]/.test(password) ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-semibold">
                        {password.length < 8 ? 'Weak' : password.length >= 12 && /[^A-Za-z0-9]/.test(password) ? 'Strong' : 'Good'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 group">
                  <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="signup-confirm">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                    <input
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                      id="signup-confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    {confirmPassword && password === confirmPassword && (
                      <span className="material-symbols-outlined absolute right-4 text-primary text-[18px]">check_circle</span>
                    )}
                  </div>
                </div>

                {/* Optional fields toggle */}
                <details className="group">
                  <summary className="text-label-sm text-primary font-bold cursor-pointer select-none flex items-center gap-1 ml-1 hover:text-primary-container transition-colors">
                    <span className="material-symbols-outlined text-[14px] group-open:rotate-90 transition-transform">chevron_right</span>
                    Optional: Institution & Field
                  </summary>
                  <div className="space-y-3 mt-3">
                    <div className="space-y-1.5 group">
                      <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 font-bold" htmlFor="signup-institution">Institution</label>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                        id="signup-institution"
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. University of Delhi"
                      />
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 font-bold" htmlFor="signup-field">Field of Study</label>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                        id="signup-field"
                        type="text"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        placeholder="e.g. Political Science & Law"
                      />
                    </div>
                  </div>
                </details>

                {/* Submit Button */}
                <button
                  className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      <span className="font-semibold">Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 font-semibold tracking-wide">Create Account</span>
                      <span className="material-symbols-outlined relative z-10 text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>
            </div>

            {/* Footer */}
            <p className="text-body-md text-on-surface-variant pb-8 font-medium">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="text-primary font-medium hover:text-primary-container hover:underline underline-offset-4 decoration-2 transition-all"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
