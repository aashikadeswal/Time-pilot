import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication and navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="bg-background font-display min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col w-full h-full min-h-[100dvh] bg-surface relative justify-center items-center px-6 py-12">
          {/* Subtle ambient background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-fixed-dim opacity-[0.03] blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-tertiary-fixed opacity-[0.03] blur-3xl"></div>
          </div>
          
          <div className="w-full max-w-sm flex flex-col items-center relative z-10 space-y-12">
            {/* Header / Branding */}
            <div className="flex flex-col items-center space-y-6 text-center">
              <img 
                alt="Time Pilot Logo" 
                className="w-16 h-16 rounded-2xl shadow-sm object-cover" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLu_r4dGIZwKFNOJuIZHmrubYRUwyt0u4hDAxuaqMLVox8TBRigOn39EturTFUryW0ieOArQ8UuzfB1gQqdY3jsmX3gqXRg6D-yfoM5-YtBe62I7l23D2WFpmhR_9XR_F6sDq_vxQIIk42AJGbC5Qon7-8E4iU47OO10c7Bsy3AOVFf669qATcTHSgJdnxQn70Prabz4BswGWNyRWiKugx4tn3sECrm8JTBH454OSj6AweI7DNn-2VfU_u87"
              />
              <div className="space-y-2">
                <h1 className="text-headline-lg-mobile text-on-surface tracking-tight font-bold">Welcome back.</h1>
                <p className="text-body-md text-on-surface-variant font-medium">Sign in to continue your focus session.</p>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="w-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_4px_24px_rgba(26,28,30,0.04)] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed via-primary-container to-tertiary-container opacity-50"></div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="space-y-2 group relative">
                  <label 
                    className="text-label-sm text-on-surface-variant uppercase tracking-wider block ml-1 transition-colors group-focus-within:text-primary font-bold" 
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">
                      mail
                    </span>
                    <input 
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner" 
                      id="email" 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" 
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 group relative">
                  <div className="flex justify-between items-center ml-1">
                    <label 
                      className="text-label-sm text-on-surface-variant uppercase tracking-wider transition-colors group-focus-within:text-primary font-bold" 
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a 
                      className="text-label-sm text-primary hover:text-primary-container transition-colors font-medium" 
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input 
                      className="w-full bg-surface-container-low text-on-surface text-body-md rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 shadow-inner" 
                      id="password" 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                    />
                    <button 
                      aria-label="Toggle password visibility" 
                      className="absolute right-4 text-outline hover:text-on-surface transition-colors focus:outline-none flex items-center justify-center" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button 
                  className="w-full bg-primary text-on-primary text-label-md py-4 rounded-xl shadow-md hover:bg-primary-container hover:shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 group relative overflow-hidden" 
                  type="submit"
                >
                  <span className="relative z-10 font-semibold tracking-wide">Sign In</span>
                  <span className="material-symbols-outlined relative z-10 text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2 select-none">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink-0 mx-4 text-label-sm text-outline uppercase tracking-widest font-semibold">Or</span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>

              {/* Social Logins */}
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-surface rounded-xl hover:bg-surface-container transition-colors shadow-sm text-on-surface text-label-md group relative overflow-hidden" 
                  type="button"
                >
                  <div className="absolute inset-0 border border-outline-variant/50 rounded-xl group-hover:border-outline/50 transition-colors pointer-events-none"></div>
                  {/* Google Icon SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Continue with Google</span>
                </button>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-inverse-surface text-inverse-on-surface rounded-xl hover:bg-inverse-surface/90 transition-colors shadow-sm text-label-md active:scale-[0.98]" 
                  type="button"
                >
                  {/* Apple Icon SVG */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.365 7.643c-.024 1.704 1.341 2.946 2.871 3.238-.346 1.042-1.282 2.766-2.527 4.549-1.127 1.615-2.029 3.195-3.834 3.195-1.745 0-2.317-1.077-4.14-1.077-1.879 0-2.535 1.037-4.137 1.037-1.777 0-2.91-1.737-4.153-3.486-2.548-3.57-4.321-8.528-2.673-12.012 1.258-2.66 3.978-4.225 6.438-4.225 1.735 0 3.208 1.157 4.144 1.157 1.035 0 2.65-1.192 4.673-1.192 1.956.027 3.528.847 4.498 1.968-2.366 1.455-2.732 4.298-1.16 5.848zM14.654 4.534c.594-.697 1.01-1.735 1.01-2.775 0-.158-.027-.318-.052-.475-1.04.053-2.348.694-3.125 1.597-.568.65-1.042 1.657-1.042 2.697 0 .178.026.335.053.475 1.15-.054 2.457-.753 3.156-1.519z"></path>
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-body-md text-on-surface-variant pb-8 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/onboarding/goals')}
                className="text-primary font-medium hover:text-primary-container hover:underline underline-offset-4 decoration-2 transition-all"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
