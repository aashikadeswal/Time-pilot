import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTimePilot } from '../context/TimePilotContext';

export default function AICoach({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const {
    user,
    tasks,
    chatHistory,
    sendChatMessage,
    getCapacityStatus,
    getRecommendation,
    recoverSchedule,
    setActiveFocusTask
  } = useTimePilot();

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const chatEndRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const capacity = getCapacityStatus();
  const rec = getRecommendation();
  const uncompleted = tasks.filter(t => !t.completed);

  const practicalPrompts = [
    { title: 'Prioritize Now', prompt: 'I have some free time right now. What should I prioritize?' },
    { title: 'Missed Session', prompt: 'I missed my planned study session. How do I recover my schedule?' },
    { title: 'Capacity Check', prompt: 'Do I have too much planned for today?' },
    { title: 'Postponing Task', prompt: 'I keep postponing my revision. What should I do?' }
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setInputMsg('');
    setIsTyping(true);

    await sendChatMessage(text);
    setIsTyping(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied advice to clipboard');
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleQuickFocus = () => {
    if (rec && rec.task) {
      setActiveFocusTask(rec.task);
      navigate('/focus', { state: { task: rec.task } });
    }
  };

  const handleQuickRecover = () => {
    recoverSchedule('smart_balance');
    sendChatMessage("I've applied 1-Click Schedule Recovery. How does my day look now?");
    showToast('Applied 1-Click Recovery');
  };

  return (
    <Layout title="AI" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full h-[calc(100vh-140px)] justify-between relative text-left max-w-2xl mx-auto animate-fade-in">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-slide-up">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Context Awareness Top Bar */}
        <div className="bg-surface-container rounded-xl p-3 mb-2 flex items-center justify-between border border-outline-variant/20 shadow-sm flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs text-on-surface-variant font-medium">
              Context: <strong className="text-on-surface">{user.name}</strong> • {uncompleted.length} tasks remaining • {capacity.isOverCapacity ? 'Over capacity' : 'Realistic capacity'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {capacity.isOverCapacity && (
              <button
                onClick={handleQuickRecover}
                className="text-[11px] bg-secondary text-on-secondary font-bold px-2.5 py-1 rounded-lg hover:bg-secondary/90 transition-colors active:scale-95"
                title="Reorganize remaining tasks"
              >
                1-Click Recovery
              </button>
            )}
            {rec && (
              <button
                onClick={handleQuickFocus}
                className="text-[11px] bg-primary text-on-primary font-bold px-2.5 py-1 rounded-lg hover:bg-surface-tint transition-colors active:scale-95"
              >
                Focus Next: {rec.title.slice(0, 16)}...
              </button>
            )}
          </div>
        </div>

        {/* Chat History View */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-28 scrollbar-hide">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in group`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative text-sm ${
                    isUser 
                      ? 'bg-primary text-on-primary rounded-tr-none font-medium' 
                      : 'bg-surface-container text-on-surface rounded-tl-none border-l-4 border-primary font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                  
                  {!isUser && (
                    <div className="flex justify-end pt-2 mt-1 border-t border-outline-variant/20">
                      <button
                        onClick={() => copyToClipboard(msg.text)}
                        className="text-[11px] text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors opacity-70 hover:opacity-100"
                        title="Copy advice"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start animate-pulse">
              <div className="bg-surface-container text-on-surface rounded-2xl rounded-tl-none p-4 border-l-4 border-primary shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Bar: Action Pills + Message Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface via-surface to-transparent pt-3 pb-safe flex flex-col gap-2">
          
          {/* Quick Real Situation Prompts */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
            {practicalPrompts.map((p) => (
              <button
                key={p.title}
                onClick={() => handleSend(p.prompt)}
                className="shrink-0 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs px-3.5 py-1.5 rounded-full font-bold active:scale-95 transition-all"
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputMsg); }}
            className="bg-surface-container rounded-2xl p-3 flex items-center gap-3 shadow-md border border-outline-variant/30 focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/30 transition-all"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask TimePilot Coach about your schedule..."
              className="flex-1 bg-transparent text-on-surface text-sm focus:outline-none placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                inputMsg.trim() 
                  ? 'bg-primary text-on-primary active:scale-90 hover:bg-surface-tint' 
                  : 'bg-surface-variant text-outline-variant cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
}
