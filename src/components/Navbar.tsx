import { ShoppingBag, MessageSquare, Sun, Moon, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, Theme } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  onOpenChat, 
  lang, 
  setLang, 
  theme, 
  toggleTheme 
}: NavbarProps) {
  const t = translations[lang];

  return (
    <nav className="sticky top-0 z-50 glass-card px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <motion.div 
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg"
        >
          {lang === 'ar' ? 'م' : 'M'}
        </motion.div>
        <span className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-ink">{t.restaurantName}</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Toggle */}
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="icon-btn flex items-center gap-1.5 px-3"
        >
          <Globe className="w-5 h-5 text-primary dark:text-accent" />
          <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'EN' : 'AR'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="icon-btn"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-accent" />
          )}
        </button>

        {/* Chat Toggle */}
        <button 
          onClick={onOpenChat}
          className="icon-btn"
        >
          <MessageSquare className="w-5 h-5 text-primary dark:text-accent" />
        </button>
        
        {/* Cart Toggle */}
        <button 
          onClick={onOpenCart}
          className="icon-btn"
        >
          <ShoppingBag className="w-5 h-5 text-primary dark:text-accent" />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-[10px] flex items-center justify-center rounded-full border-2 border-bg dark:border-dark-bg"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>
    </nav>
  );
}
