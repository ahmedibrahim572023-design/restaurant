import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import OffersSection from './components/OffersSection';
import { MenuItem, CartItem, Language, Theme, Order, OrderStatus, Offer } from './types';

import { MENU_ITEMS } from './constants';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  // Mock initial offers
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 'offer-1',
      title: 'خصم 20% على السليق',
      titleEn: '20% off Saleeg',
      description: 'استخدم الكود للاستمتاع بخصم ربع القيمة على طبق السليق النجدي.',
      descriptionEn: 'Use code to enjoy discount on traditional Saleeg.',
      image: 'https://images.unsplash.com/photo-1512058560550-42749359a777?auto=format&fit=crop&q=80&w=800',
      isActive: true,
      code: 'MAZAJ20'
    },
    {
      id: 'offer-2',
      title: 'قهوة وحلى العصر',
      titleEn: 'Coffee & Dessert Deal',
      description: 'اطلب كيكة التمر واحصل على دلة قهوة عربية مجاناً.',
      descriptionEn: 'Order Date Cake and get a free Arabic coffee pot.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',
      isActive: true,
      code: 'COFFEEFREE'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1234',
      items: [{
        id: '1',
        name: 'كبسة دجاج ترف',
        nameEn: 'Taraf Chicken Kabsa',
        description: 'دجاج محمر مع أرز بسمتي فاخر ومجموعة من البهارات النجدية الأصيلة.',
        descriptionEn: 'Roasted chicken with premium basmati rice and a blend of authentic Najdi spices.',
        price: 45,
        category: 'أطباق رئيسية',
        categoryEn: 'Main Dishes',
        image: 'https://images.unsplash.com/photo-1512058560550-42749359a777?auto=format&fit=crop&q=80&w=800',
        quantity: 2
      }],
      total: 90,
      status: 'pending',
      deliveryType: 'takeaway',
      customerName: 'فهد محمد',
      customerPhone: '0500000000',
      createdAt: Date.now() - 3600000
    }
  ]);

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync language with DOM (RTL/LTR)
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'pending',
      createdAt: Date.now()
    };
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // Clear cart after successful order
    setIsCartOpen(false);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const updateOrderItemQuantity = (orderId: string, itemId: string, delta: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const newItems = o.items.map(item => {
        if (item.id !== itemId) return item;
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      });
      const newTotal = newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      return { ...o, items: newItems, total: newTotal };
    }));
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isAdmin) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-bg'}`}>
        <Navbar 
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          cartCount={0}
          onOpenCart={() => {}}
          onOpenChat={() => setIsAdmin(false)}
        />
        <AdminDashboard 
          orders={orders}
          offers={offers}
          menuItems={menuItems}
          onUpdateStatus={updateOrderStatus}
          onDeleteOrder={deleteOrder}
          onUpdateItemQuantity={updateOrderItemQuantity}
          onUpdateOffers={setOffers}
          onUpdateMenu={setMenuItems}
          lang={lang}
        />
        <div className="fixed bottom-6 right-6">
          <button onClick={() => setIsAdmin(false)} className="btn-primary">العودة للمتجر</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-bg'}`}>
      <Navbar 
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      
      <main>
        <Hero onOrderNow={scrollToMenu} lang={lang} />
        
        <OffersSection offers={offers} lang={lang} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <MenuSection 
            items={menuItems}
            onAddToCart={handleAddToCart} 
            lang={lang} 
          />
        </motion.div>

        <ContactSection lang={lang} />
      </main>

      <Footer lang={lang} />
      <div className="py-8 text-center opacity-20">
        <button onClick={() => setIsAdmin(true)} className="text-xs">لوحة التحكم</button>
      </div>

      <CartDrawer 
        lang={lang}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onPlaceOrder={handlePlaceOrder}
      />

      <ChatWidget 
        lang={lang} 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
      />
    </div>
  );
}
