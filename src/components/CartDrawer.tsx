import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, Send, ShoppingCart } from 'lucide-react';
import { CartItem, Language, DeliveryType } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { translations } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  lang: Language;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  lang
}: CartDrawerProps) {
  const t = translations[lang];
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('takeaway');
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    let message = lang === 'ar' ? `*طلب جديد من مزاج 🍽️*\n\n` : `*New Order from Mazaj 🍽️*\n\n`;
    message += `*النوع:* ${deliveryType === 'takeaway' ? t.takeaway : t.dineIn}\n`;
    if (pickupTime) message += `*وقت الاستلام:* ${pickupTime}\n`;
    message += `\n*الأصناف:*\n`;
    items.forEach(item => {
      message += `• ${lang === 'ar' ? item.name : item.nameEn} (x${item.quantity}) - ${item.price * item.quantity} ${t.currency}\n`;
    });
    message += `\n*${t.total}: ${total} ${t.currency}*\n\n${lang === 'ar' ? 'الاسم' : 'Name'}: ${customerName}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          <motion.div 
            initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} h-full w-full sm:max-w-md bg-bg dark:bg-dark-bg shadow-2xl z-[60] flex flex-col`}
          >
            <div className="p-6 border-b border-ink/5 flex justify-between items-center bg-white dark:bg-dark-surface">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-2 dark:text-dark-ink">
                {t.cart}
                <span className="text-sm font-sans bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {items.length} {t.items}
                </span>
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-bg dark:hover:bg-dark-bg rounded-full transition-colors dark:text-dark-ink">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-primary/50 opacity-50 dark:text-dark-ink">
                  <ShoppingCart className="w-16 h-16 mb-4" />
                  <p>{t.emptyCart}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-bg dark:bg-dark-bg/50 rounded-2xl">
                      <button 
                        onClick={() => setDeliveryType('takeaway')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${deliveryType === 'takeaway' ? 'bg-accent text-white shadow-md' : 'opacity-50'}`}
                      >
                        {t.takeaway}
                      </button>
                      <button 
                        onClick={() => setDeliveryType('dine-in')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${deliveryType === 'dine-in' ? 'bg-accent text-white shadow-md' : 'opacity-50'}`}
                      >
                        {t.dineIn}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder={lang === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white dark:bg-dark-surface p-4 rounded-2xl border border-ink/5 focus:ring-2 focus:ring-accent/20 outline-none transition-all dark:text-dark-ink"
                      />
                      <input 
                        type="time" 
                        placeholder={lang === 'ar' ? 'وقت الاستلام (اختياري)' : 'Pickup Time (Optional)'}
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white dark:bg-dark-surface p-4 rounded-2xl border border-ink/5 focus:ring-2 focus:ring-accent/20 outline-none transition-all dark:text-dark-ink"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-sm border border-ink/5">
                    <img 
                      src={item.image} 
                      alt={lang === 'ar' ? item.name : item.nameEn} 
                      className="w-20 h-20 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-ink dark:text-dark-ink">{lang === 'ar' ? item.name : item.nameEn}</h4>
                        <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-bold">{item.price} {t.currency}</span>
                        <div className="flex items-center gap-3 bg-bg dark:bg-dark-bg/50 px-3 py-1 rounded-full dark:text-dark-ink">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-accent disabled:opacity-30" disabled={item.quantity <= 1}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-accent">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

            <div className="p-6 bg-white dark:bg-dark-surface border-t border-ink/5 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-center mb-6 dark:text-dark-ink">
                <span className="text-primary dark:text-dark-ink/70 font-medium">{t.total}</span>
                <span className="text-3xl font-serif font-bold text-ink dark:text-dark-ink">{total} {t.currency}</span>
              </div>
              <button 
                onClick={handleSendOrder}
                disabled={items.length === 0}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-lg shadow-accent/20 disabled:grayscale disabled:opacity-50"
              >
                <Send className={`w-5 h-5 ${lang === 'ar' ? '' : 'rotate-180'}`} />
                <span className="text-lg">{t.sendWhatsapp}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
