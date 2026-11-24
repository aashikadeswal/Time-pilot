import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword, error, clearError } = useAuth();

  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'success'
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email.trim());
    setIsSubmitting(false);

    if (result.success) {
      setMessage(result.message);
      // In development mode, if a token is returned, pre-fill it
      if (result.token) {
        setResetToken(result.token);
      }
      setStep('reset');
    } else {
      setLocalError(result.error || 'Request failed');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!resetToken.trim()) {
      setLocalError('Please enter the reset token');
      return;
    }
    if (newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Za-z]/.test(newPassword)) {
      setLocalError('Password must contain at least one letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setLocalError('Password must contain at least one number');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(resetToken, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setStep('success');
    } else {
      setLocalError(result.error || 'Password reset failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <div className="fixed top-0 w-full z-40 p-4 flex justify-between items-center max-w-4xl mx-auto left-0 right-0">
        <button
          onClick={() => navigate('/signin')}
          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-xl bg-surface-container/60 hover:bg-surface-container backdrop-blur-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Sign In
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

          <div className="w-full max-w-sm flex flex-col items-center relative z-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[32px]">
                  {step === 'success' ? 'check_circle' : 'lock_reset'}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-headline-lg-mobile text-on-surface tracking-tight font-bold">
                  {step === 'email' && 'Forgot your password?'}
                  {step === 'reset' && 'Reset your password'}
                  {step === 'success' && 'Password reset!'}
                </h1>
                <p className="text-body-md text-on-surface-variant font-medium">
                  {step === 'email' && "No worries. Enter your email and we'll send you a reset link."}
                  {step === 'reset' && 'Enter the reset token and your new password.'}
                  {step === 'success' && 'Your password has been successfully reset. You are now logged in.'}
                </p>
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

            {/* Step 1: Email */}
            {step === 'email' && (
              <div className="w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,28,30,0.04)] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed via-primary-container to-tertiary-container opacity-50"></div>
                <form className="space-y-5" onSubmit={handleRequestReset}>
                  <div className="space-y-2 group">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="forgot-email">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <button
                    className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                        <span className="font-semibold">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">Send Reset Link</span>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Reset Password */}
            {step === 'reset' && (
              <div className="w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,28,30,0.04)] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed via-primary-container to-tertiary-container opacity-50"></div>

                {/* Success message */}
                {message && (
                  <div className="bg-primary-container/10 border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                    <p className="text-body-md text-on-surface font-medium">{message}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleResetPassword}>
                  {/* Reset Token */}
                  <div className="space-y-2 group">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="reset-token">
                      Reset Token
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">key</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner font-mono text-xs"
                        id="reset-token"
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Paste your reset token here"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2 group">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="new-password">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars, 1 letter + 1 number"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-outline hover:text-on-surface transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2 group">
                    <label className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" htmlFor="confirm-new-password">
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner"
                        id="confirm-new-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {confirmPassword && newPassword === confirmPassword && (
                        <span className="material-symbols-outlined absolute right-4 text-primary text-[18px]">check_circle</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                        <span className="font-semibold">Resetting...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">Reset Password</span>
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => setStep('email')}
                  className="w-full text-center text-label-sm text-on-surface-variant hover:text-primary font-medium transition-colors"
                >
                  ← Back to email input
                </button>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <div className="w-full space-y-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-semibold"
                >
                  <span>Go to Dashboard</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full text-center text-label-md text-on-surface-variant hover:text-primary font-medium transition-colors py-2"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
