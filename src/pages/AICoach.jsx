import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

export default function AICoach({ darkMode, setDarkMode }) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  const quickPrompts = [
    { text: 'What should I do now?' },
    { text: 'Plan my day' },
    { text: 'Analyze my week' },
    { text: 'Do I have too much planned?' }
  ];

  useEffect(() => {
    async function loadChat() {
      const fetched = await api.fetchChatHistory();
      setMessages(fetched);
    }
    loadChat();
  }, []);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text
    };

    // Optimistic user bubble append
    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setIsTyping(true);

    const updatedHistory = await api.sendMessageToCoach(userMessage);
    setMessages(updatedHistory);
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <Layout title="AI" darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="flex flex-col w-full h-[76vh] justify-between relative text-left">
        
        {/* Chat History View */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-24 scrollbar-hide">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                    isUser 
                      ? 'bg-primary text-on-primary rounded-tr-none' 
                      : 'bg-surface-container text-on-surface rounded-tl-none border-l-4 border-primary'
                  }`}
                >
                  <p className="font-body-md text-body-md whitespace-pre-line leading-relaxed font-semibold">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start animate-pulse">
              <div className="bg-surface-container text-on-surface rounded-2xl rounded-tl-none p-4 border-l-4 border-primary shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Actions Floating Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface via-surface to-transparent pt-4 pb-safe flex flex-col gap-3">
          
          {/* Quick Prompts Carousel */}
          {messages.length <= 1 && !isTyping && (
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {quickPrompts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSend(p.text)}
                  className="snap-center shrink-0 bg-surface-container hover:bg-surface-container-high border border-outline-variant/35 text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm font-semibold active:scale-95 transition-all"
                >
                  {p.text}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputMsg); }}
            className="bg-surface-container rounded-xl p-3 flex items-center gap-3 shadow-md focus-within:bg-surface-container-lowest focus-within:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-outline text-[22px]">auto_awesome</span>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Message Coach..."
              className="flex-1 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline-variant/60"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
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
