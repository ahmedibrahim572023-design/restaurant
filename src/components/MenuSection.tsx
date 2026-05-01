import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Category, MenuItem, Language } from '../types';
import { MENU_ITEMS } from '../constants';
import { translations } from '../translations';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  lang: Language;
}

const MenuItemCard = memo(({ item, lang, t, onAddToCart }: { item: MenuItem, lang: Language, t: any, onAddToCart: (item: MenuItem) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    key={item.id}
    className="glass-card rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500"
  >
    <div className="relative h-64 overflow-hidden">
      <motion.img 
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
        src={item.image} 
        alt={lang === 'ar' ? item.name : item.nameEn}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-surface/90 backdrop-blur px-3 py-1 rounded-full text-accent font-bold text-sm">
        {item.price} {t.currency}
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-serif font-bold text-ink dark:text-dark-ink mb-2">
        {lang === 'ar' ? item.name : item.nameEn}
      </h3>
      <p className="text-sm text-primary/60 dark:text-dark-ink/50 mb-6 line-clamp-2">
        {lang === 'ar' ? item.description : item.descriptionEn}
      </p>
      
      <button 
        onClick={() => onAddToCart(item)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-bg dark:bg-dark-bg/50 text-ink dark:text-dark-ink border border-ink/5 hover:bg-accent hover:text-white transition-all duration-300 group/btn"
      >
        <Plus className="w-4 h-4" />
        <span>{t.addToCart}</span>
      </button>
    </div>
  </motion.div>
));

MenuItemCard.displayName = 'MenuItemCard';

export default function MenuSection({ items, onAddToCart, lang }: MenuSectionProps) {
  const t = translations[lang];
  const CATEGORIES: Category[] = useMemo(() => lang === 'ar' 
    ? ['الكل', 'أطباق رئيسية', 'حلويات', 'مشروبات'] 
    : ['All', 'Main Dishes', 'Desserts', 'Drinks'], [lang]);
    
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);

  const filteredItems = useMemo(() => {
    return activeCategory === CATEGORIES[0]
      ? items 
      : items.filter(item => 
          lang === 'ar' ? item.category === activeCategory : item.categoryEn === activeCategory
        );
  }, [activeCategory, CATEGORIES, lang, items]);

  return (
    <section id="menu" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-ink dark:text-dark-ink mb-4">{t.menu}</h2>
        <p className="text-primary/70 dark:text-dark-ink/50">{lang === 'ar' ? 'اختر من تشكيلة واسعة من ألذ الأطباق المحضرة بعناية' : 'Choose from a wide variety of carefully prepared dishes'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-ink dark:bg-accent text-white shadow-lg' 
                : 'bg-white dark:bg-dark-surface text-ink dark:text-dark-ink hover:bg-ink/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              lang={lang} 
              t={t} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
