import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Trash2, 
  Plus, 
  Minus,
  ChevronRight,
  User,
  Phone,
  Package,
  Send,
  AlertTriangle,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { Order, OrderStatus, Language, Offer, MenuItem } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  orders: Order[];
  offers: Offer[];
  menuItems: MenuItem[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateItemQuantity: (orderId: string, itemId: string, delta: number) => void;
  onUpdateOffers: (offers: Offer[]) => void;
  onUpdateMenu: (items: MenuItem[]) => void;
  lang: Language;
}

export default function AdminDashboard({ 
  orders, 
  offers,
  menuItems,
  onUpdateStatus, 
  onDeleteOrder, 
  onUpdateItemQuantity,
  onUpdateOffers,
  onUpdateMenu,
  lang 
}: AdminDashboardProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'orders' | 'offers' | 'menu'>('orders');
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    const baseOrders = filter === 'all' 
      ? orders 
      : orders.filter(o => o.status === filter);
    
    return [...baseOrders].sort((a, b) => a.createdAt - b.createdAt);
  }, [orders, filter]);

  const handleNotifyOutOfStock = (order: Order, item: any) => {
    const text = lang === 'ar'
      ? `يا هلا والله ${order.customerName}🧡\n\nنعتذر منك جداً، صنف (${lang === 'ar' ? item.name : item.nameEn}) خلص حالياً من المطبخ للأسف. \n\nهل ودك تبدله بصنف ثاني بنفس القيمة أو نلغي الصنف من الطلب؟\n\nأبشر بالعوض، ومزاج يحييك!`
      : `Hello ${order.customerName}🧡\n\nWe apologize, but (${item.nameEn}) is currently out of stock. \n\nWould you like to replace it with something else or remove it from your order?\n\nMazaj greets you!`;
    
    window.open(`https://wa.me/${order.customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddOffer = () => {
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      title: 'عرض جديد',
      titleEn: 'New Offer',
      description: 'وصف العرض هنا',
      descriptionEn: 'Offer description here',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
      isActive: true,
      code: 'MAZAJ20'
    };
    onUpdateOffers([newOffer, ...offers]);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing': return <ClipboardList className="w-5 h-5 text-blue-500" />;
      case 'ready': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'delivered': return <Truck className="w-5 h-5 text-gray-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'delivered': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-bg dark:bg-dark-bg transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink dark:text-dark-ink">{t.adminDashboard}</h1>
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-sm font-medium transition-all ${activeTab === 'orders' ? 'text-accent border-b-2 border-accent' : 'opacity-40'}`}
            >
              الطلبات ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('offers')}
              className={`text-sm font-medium transition-all ${activeTab === 'offers' ? 'text-accent border-b-2 border-accent' : 'opacity-40'}`}
            >
              العروض ({offers.length})
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`text-sm font-medium transition-all ${activeTab === 'menu' ? 'text-accent border-b-2 border-accent' : 'opacity-40'}`}
            >
              المنيو ({menuItems.length})
            </button>
          </div>
        </div>
        
        {activeTab === 'orders' && (
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'preparing', 'ready', 'delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filter === f 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'bg-white dark:bg-dark-surface dark:text-dark-ink text-ink hover:bg-black/5'
                }`}
              >
                {f === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : t[`status${f.charAt(0).toUpperCase() + f.slice(1)}` as keyof typeof t]}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'offers' && (
          <button 
            onClick={handleAddOffer}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عرض</span>
          </button>
        )}

        {activeTab === 'menu' && (
          <button 
            onClick={() => {
              const newItem: MenuItem = {
                id: `item-${Date.now()}`,
                name: 'طبق جديد',
                nameEn: 'New Dish',
                description: 'وصف الطبق هنا',
                descriptionEn: 'Dish description here',
                price: 0,
                category: 'أطباق رئيسية',
                categoryEn: 'Main Dishes',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
              };
              onUpdateMenu([newItem, ...menuItems]);
            }}
            className="btn-primary py-2 px-6 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف</span>
          </button>
        )}
      </div>

      {activeTab === 'orders' ? (
        filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Package className="w-20 h-20 mb-4" />
            <p className="text-xl">{t.noOrders}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-4 bg-ink text-white/50 text-xs font-bold uppercase tracking-wider rounded-2xl mb-4">
              <div className="col-span-2">الطلب والتوقيت</div>
              <div className="col-span-2">العميل</div>
              <div className="col-span-1">النوع</div>
              <div className="col-span-3">الأصناف</div>
              <div className="col-span-1">الإجمالي</div>
              <div className="col-span-3">الإجراءات</div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-[24px] overflow-hidden border border-ink/5 bg-white dark:bg-dark-surface p-4 lg:p-0 transition-hover hover:shadow-xl"
                >
                  <div className="lg:grid lg:grid-cols-12 gap-4 lg:items-center lg:px-8 lg:py-6">
                    <div className="col-span-2 mb-4 lg:mb-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-bold text-ink dark:text-dark-ink text-sm">
                            #{order.id.slice(-4).toUpperCase()}
                          </h3>
                          <p className="text-[10px] opacity-50 font-mono">
                            {new Date(order.createdAt).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 mb-4 lg:mb-0">
                      <div className="text-sm font-medium dark:text-dark-ink">{order.customerName}</div>
                      <div className="text-xs opacity-50 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {order.customerPhone}
                      </div>
                    </div>

                    <div className="col-span-1 mb-4 lg:mb-0">
                      <div className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.deliveryType === 'takeaway' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                        {order.deliveryType === 'takeaway' ? t.takeaway : t.dineIn}
                      </div>
                      {order.pickupTime && <p className="text-[9px] opacity-40 mt-1">🕒 {order.pickupTime}</p>}
                    </div>

                    <div className="col-span-3 mb-4 lg:mb-0">
                      <div className="flex -space-x-2 rtl:space-x-reverse mb-1">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="relative group">
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-surface overflow-hidden shadow-sm">
                              <img src={item.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <button 
                              onClick={() => handleNotifyOutOfStock(order, item)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75"
                              title="إبلاغ بنفاد الصنف"
                            >
                              <AlertTriangle className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] opacity-60">
                        {order.items.map(i => `${i.quantity}x ${lang === 'ar' ? i.name : i.nameEn}`).join('، ')}
                      </p>
                    </div>

                    <div className="col-span-1 mb-4 lg:mb-0">
                      <div className="text-lg font-serif font-bold text-accent">{order.total} {t.currency}</div>
                    </div>

                    <div className="col-span-3 flex flex-wrap lg:flex-nowrap items-center gap-2">
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-bg dark:bg-dark-bg border border-ink/5 rounded-xl px-3 py-2 text-xs focus:outline-none flex-1 lg:max-w-[120px] dark:text-dark-ink"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="preparing">يتم التحضير</option>
                        <option value="ready">جاهز</option>
                        <option value="delivered">تم الاستلام</option>
                        <option value="cancelled">ملغي</option>
                      </select>

                      <button 
                        onClick={() => {
                          const statusTextsAr: Record<OrderStatus, string> = {
                            pending: 'استلمنا طلبك وأبشر بالسعد، بنبدأ فيه حالا!',
                            preparing: 'طلبك جالس يتجهز بكل حب في المطبخ 👨‍🍳',
                            ready: 'أبشرك! طلبك صار جاهز، حياك الله تستلمه في أي وقت ☕',
                            delivered: 'تم تسليم الطلب، عوافي على قلبك ونشوفك مرة ثانية!',
                            cancelled: 'نعتذر منك، تم إلغاء الطلب. تواصل معنا لأي استفسار.'
                          };
                          const statusTextsEn: Record<OrderStatus, string> = {
                            pending: 'We received your order and we are on it!',
                            preparing: 'Your order is being prepared with love 👨‍🍳',
                            ready: 'Great news! Your order is ready for pickup ☕',
                            delivered: 'Order delivered, enjoy your meal!',
                            cancelled: 'Sorry, your order has been cancelled.'
                          };

                          const text = lang === 'ar' 
                            ? `يا هلا والله ${order.customerName}🧡\n\n${statusTextsAr[order.status]}\n\nرقم الطلب: #${order.id.slice(-4).toUpperCase()}\nمطعم مزاج يحييك!`
                            : `Hello ${order.customerName}🧡\n\n${statusTextsEn[order.status]}\n\nOrder ID: #${order.id.slice(-4).toUpperCase()}\nMazaj Restaurant greets you!`;
                          
                          window.open(`https://wa.me/${order.customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md shadow-green-500/20 transition-all group"
                        title="تحديث العميل"
                      >
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button 
                        onClick={() => onDeleteOrder(order.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-1 bg-bg dark:bg-dark-bg p-1 rounded-xl">
                        <button onClick={() => onUpdateItemQuantity(order.id, order.items[0]?.id, 1)} className="p-1 hover:text-accent">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => onUpdateItemQuantity(order.id, order.items[0]?.id, -1)} className="p-1 hover:text-accent">
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      ) : activeTab === 'offers' ? (
        /* Offers Management Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="glass-card rounded-3xl overflow-hidden border border-ink/5 bg-white dark:bg-dark-surface p-6">
              <div className="relative h-40 mb-4 rounded-2xl overflow-hidden">
                <img src={offer.image} className="w-full h-full object-cover" alt="" />
                <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-xl text-ink hover:text-accent">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <input 
                  value={lang === 'ar' ? offer.title : offer.titleEn}
                  onChange={(e) => {
                    const newOffers = offers.map(o => o.id === offer.id 
                      ? { ...o, [lang === 'ar' ? 'title' : 'titleEn']: e.target.value } 
                      : o);
                    onUpdateOffers(newOffers);
                  }}
                  className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-sm font-bold dark:text-dark-ink"
                  placeholder={t.offerTitle || "Offer Title"}
                />
                <textarea 
                  value={lang === 'ar' ? offer.description : offer.descriptionEn}
                  onChange={(e) => {
                    const newOffers = offers.map(o => o.id === offer.id 
                      ? { ...o, [lang === 'ar' ? 'description' : 'descriptionEn']: e.target.value } 
                      : o);
                    onUpdateOffers(newOffers);
                  }}
                  className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-xs h-20 resize-none dark:text-dark-ink"
                  placeholder={t.offerDesc || "Offer Description"}
                />
                
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {offer.isActive ? (t.active || 'Active') : (t.inactive || 'Inactive')}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newOffers = offers.map(o => o.id === offer.id ? { ...o, isActive: !o.isActive } : o);
                        onUpdateOffers(newOffers);
                      }}
                      className="p-2 bg-bg dark:bg-dark-bg rounded-xl hover:bg-accent hover:text-white transition-all text-xs font-bold"
                    >
                      {offer.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button 
                      onClick={() => onUpdateOffers(offers.filter(o => o.id !== offer.id))}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Menu Management Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="glass-card rounded-[32px] overflow-hidden border border-ink/5 bg-white dark:bg-dark-surface p-6 flex flex-col">
              <div className="relative h-40 mb-4 rounded-2xl overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt="" />
                <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-xl text-ink hover:text-accent">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] opacity-40 uppercase font-bold">الاسم (عربي)</label>
                    <input 
                      value={item.name}
                      onChange={(e) => onUpdateMenu(menuItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                      className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-xs font-bold dark:text-dark-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] opacity-40 uppercase font-bold">Name (EN)</label>
                    <input 
                      value={item.nameEn}
                      onChange={(e) => onUpdateMenu(menuItems.map(i => i.id === item.id ? { ...i, nameEn: e.target.value } : i))}
                      className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-xs font-bold dark:text-dark-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] opacity-40 uppercase font-bold">السعر</label>
                    <input 
                      type="number"
                      value={item.price}
                      onChange={(e) => onUpdateMenu(menuItems.map(i => i.id === item.id ? { ...i, price: Number(e.target.value) } : i))}
                      className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-xs font-bold dark:text-dark-ink"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] opacity-40 uppercase font-bold">التصنيف</label>
                    <select 
                      value={item.category}
                      onChange={(e) => onUpdateMenu(menuItems.map(i => i.id === item.id ? { ...i, category: e.target.value } : i))}
                      className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-[10px] font-bold dark:text-dark-ink focus:outline-none"
                    >
                      <option value="أطباق رئيسية">أطباق رئيسية</option>
                      <option value="حلويات">حلويات</option>
                      <option value="مشروبات">مشروبات</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] opacity-40 uppercase font-bold">الوصف</label>
                  <textarea 
                    value={lang === 'ar' ? item.description : item.descriptionEn}
                    onChange={(e) => onUpdateMenu(menuItems.map(i => i.id === item.id ? { ...i, [lang === 'ar' ? 'description' : 'descriptionEn']: e.target.value } : i))}
                    className="w-full bg-bg dark:bg-dark-bg/50 border-none rounded-xl px-3 py-2 text-[10px] h-16 resize-none dark:text-dark-ink"
                  />
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-ink/5 flex justify-between">
                <button 
                  onClick={() => onUpdateMenu(menuItems.filter(i => i.id !== item.id))}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الصنف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
