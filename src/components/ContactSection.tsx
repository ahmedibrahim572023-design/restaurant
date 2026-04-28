import { motion } from 'motion/react';
import { 
  Instagram, 
  Twitter, 
  Send as Telegram, 
  Ghost as Snapchat,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';
import { 
  INSTAGRAM_LINK, 
  TWITTER_LINK, 
  SNAPCHAT_LINK, 
  TELEGRAM_LINK,
  WHATSAPP_NUMBER 
} from '../constants';
import { Language } from '../types';
import { translations } from '../translations';

interface ContactSectionProps {
  lang: Language;
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const t = translations[lang];
  const socialLinks = [
    { icon: Instagram, link: INSTAGRAM_LINK, color: 'hover:text-pink-500' },
    { icon: Twitter, link: TWITTER_LINK, color: 'hover:text-blue-400' },
    { icon: Telegram, link: TELEGRAM_LINK, color: 'hover:text-blue-500' },
    { icon: Snapchat, link: SNAPCHAT_LINK, color: 'hover:text-yellow-400' }
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-white dark:bg-dark-surface border-t border-ink/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-serif text-ink dark:text-dark-ink mb-6">{t.contactUs}</h2>
          <p className="text-primary/70 dark:text-dark-ink/60 mb-10 text-lg leading-relaxed">
            {t.contactDesc}
          </p>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-bg dark:bg-dark-bg rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold dark:text-dark-ink">{t.location}</h4>
                <p className="text-sm opacity-60 dark:text-dark-ink/50">{t.locationDesc}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-bg dark:bg-dark-bg rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold dark:text-dark-ink">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</h4>
                <p className="text-sm opacity-60 dark:text-dark-ink/50">{WHATSAPP_NUMBER}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-bg dark:bg-dark-bg rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold dark:text-dark-ink">{t.workingHours}</h4>
                <p className="text-sm opacity-60 dark:text-dark-ink/50">{t.workingHoursDesc}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -5 }}
                className={`p-4 bg-bg dark:bg-dark-bg rounded-full text-ink dark:text-dark-ink transition-colors ${social.color}`}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="pill-image h-[500px] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1500" 
            alt="Interior"
            className="w-full h-full object-cover dark:opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
