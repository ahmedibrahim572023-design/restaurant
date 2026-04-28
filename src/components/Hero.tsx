import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  onOrderNow: () => void;
  lang: Language;
}

export default function Hero({ onOrderNow, lang }: HeroProps) {
  const t = translations[lang];

  return (
    <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg dark:to-dark-bg z-10" />
        <img 
          src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=2000"
          alt="Restaurant Hero"
          className="w-full h-full object-cover opacity-30 dark:opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 max-w-2xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent font-medium tracking-[0.2em] text-sm uppercase mb-4 block"
        >
          {lang === 'ar' ? 'تجربة نجدية أصيلة' : 'Authentic Najdi Experience'}
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-serif text-ink dark:text-dark-ink mb-6 leading-[1.1]"
        >
          {t.slogan.split(' ').map((word, i) => (
            <span key={i} className={word === 'مزاجك' || word === 'Mood' ? 'italic text-accent' : ''}>
              {word}{' '}
            </span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-primary/80 dark:text-dark-ink/60 mb-10 max-w-lg mx-auto"
        >
          {t.subSlogan}
        </motion.p>
        
        <motion.button 
          onClick={onOrderNow}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          {t.orderNow}
        </motion.button>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-50"
      >
        <ChevronDown className="w-6 h-6 text-primary dark:text-accent" />
      </motion.div>
    </section>
  );
}
