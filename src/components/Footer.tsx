import { Language } from "../types";
import { translations } from "../translations";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="py-12 bg-ink text-white/40 text-center text-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white font-serif font-bold text-2xl">
            {lang === 'ar' ? 'م' : 'M'}
          </div>
          <p className="font-serif text-white/80 text-xl">{t.restaurantName}</p>
        </div>
        <p>© {new Date().getFullYear()} {t.restaurantName}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
        <p className="mt-2">{t.footerDesc}</p>
      </div>
    </footer>
  );
}
