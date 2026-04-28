import { useState } from 'react';
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
  Package
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateItemQuantity: (orderId: string, itemId: string, delta: number) => void;
  lang: Language;
}

export default function AdminDashboard({ 
  orders, 
  onUpdateStatus, 
  onDeleteOrder, 
  onUpdateItemQuantity,
  lang 
}: AdminDashboardProps) {
  const t = translations[lang];
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

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
          <p className="text-primary/60 dark:text-dark-ink/50 mt-1">إدارة وتحكم في كافة طلبات المطعم</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'preparing', 'ready', 'delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-accent text-white shadow-lg' 
                  : 'bg-white dark:bg-dark-surface dark:text-dark-ink text-ink hover:bg-black/5'
              }`}
            >
              {f === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : t[`status${f.charAt(0).toUpperCase() + f.slice(1)}` as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <Package className="w-20 h-20 mb-4" />
          <p className="text-xl">{t.noOrders}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-[32px] overflow-hidden border border-ink/5"
              >
                <div className="p-6 border-b border-ink/5 flex justify-between items-center bg-white/50 dark:bg-dark-surface/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink dark:text-dark-ink flex items-center gap-2">
                         طلب #{order.id.slice(-4).toUpperCase()}
                         <span className="text-xs font-normal opacity-50">{new Date(order.createdAt).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs opacity-60">
                        <User className="w-3 h-3" /> {order.customerName} | <Phone className="w-3 h-3" /> {order.customerPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.deliveryType === 'takeaway' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                    {order.deliveryType === 'takeaway' ? t.takeaway : t.dineIn}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="font-medium text-sm">{lang === 'ar' ? item.name : item.nameEn}</p>
                            <p className="text-xs opacity-50">{item.price} {t.currency}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-bg dark:bg-dark-bg px-2 py-1 rounded-lg">
                            <button onClick={() => onUpdateItemQuantity(order.id, item.id, -1)} className="p-1 hover:text-accent"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => onUpdateItemQuantity(order.id, item.id, 1)} className="p-1 hover:text-accent"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-sm font-bold min-w-[60px] text-left">{item.price * item.quantity} {t.currency}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-ink/5 flex justify-between items-center">
                    <span className="font-serif text-lg opacity-60">{t.totalAmount}</span>
                    <span className="text-2xl font-serif font-bold text-accent">{order.total} {t.currency}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <select 
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="flex-1 bg-bg dark:bg-dark-bg border border-ink/5 rounded-xl px-4 py-2 text-sm focus:outline-none"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="preparing">يتم التحضير</option>
                      <option value="ready">جاهز للاستلام</option>
                      <option value="delivered">تم الاستلام</option>
                      <option value="cancelled">ملغي</option>
                    </select>

                    <button 
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
