import { motion } from 'motion/react';
import { Tag, ArrowRight } from 'lucide-react';
import { Offer, Language } from '../types';
import { translations } from '../translations';

interface OffersSectionProps {
  offers: Offer[];
  lang: Language;
}

export default function OffersSection({ offers, lang }: OffersSectionProps) {
  const t = translations[lang];
  const activeOffers = offers.filter(o => o.isActive);

  if (activeOffers.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-accent rounded-xl text-white">
          <Tag className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-ink dark:text-dark-ink">{t.specialOffers}</h2>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
        {activeOffers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[300px] md:w-[450px] snap-center glass-card rounded-[32px] overflow-hidden group border border-ink/5 relative"
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-2/5 h-40 md:h-full overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={lang === 'ar' ? offer.title : offer.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <h3 className="text-xl font-bold dark:text-dark-ink mb-2">
                  {lang === 'ar' ? offer.title : offer.titleEn}
                </h3>
                <p className="text-sm opacity-60 dark:text-dark-ink/60 mb-4 line-clamp-2">
                  {lang === 'ar' ? offer.description : offer.descriptionEn}
                </p>
                {offer.code && (
                  <div className="mt-auto">
                    <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-mono font-bold tracking-widest">
                      {offer.code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
