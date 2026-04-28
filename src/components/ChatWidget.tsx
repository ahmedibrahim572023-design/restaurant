import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { ChatMessage, Language } from '../types';
import { translations } from '../translations';
import { OMAR_AVATAR } from '../constants';

interface ChatWidgetProps {
  lang: Language;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export default function ChatWidget({ lang, isOpen, setIsOpen }: ChatWidgetProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: t.chatWelcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Reset chat if language changes to show correct welcome
  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: t.chatWelcome }]);
  }, [lang]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const aiResponse = await getChatResponse(input, history);
    
    const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[100] flex flex-col items-end`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-dark-surface rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-ink/5"
          >
            {/* Header */}
            <div className="bg-ink p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={OMAR_AVATAR} 
                    alt="Omar" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-ink rounded-full" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">{t.chatHeader}</h3>
                  <span className="text-[10px] opacity-70 uppercase tracking-widest">{t.online}</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg/30 dark:bg-dark-bg/10">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? (lang === 'ar' ? 'justify-start' : 'justify-end') : (lang === 'ar' ? 'justify-end' : 'justify-start')}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-accent text-white shadow-md' 
                      : 'bg-white dark:bg-dark-surface dark:text-dark-ink text-ink border border-ink/5 shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`flex ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                  <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-ink/5 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-dark-surface border-t border-ink/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.chatPlaceholder}
                  className="w-full bg-bg dark:bg-dark-bg/50 py-3 px-4 pr-12 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all dark:text-dark-ink"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute ${lang === 'ar' ? 'left-2' : 'right-2'} p-2 bg-accent text-white rounded-xl hover:scale-105 transition-all`}
                >
                  <Send className="w-4 h-4 scale-x-[-1]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center shadow-xl relative"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full p-0.5 animate-pulse">
           <Sparkles className="w-2 h-2 text-white" />
        </span>
      </motion.button>
    </div>
  );
}
