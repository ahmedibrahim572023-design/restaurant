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
import { MenuItem, CartItem, Language, Theme, Order, OrderStatus } from './types';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mock orders for demonstration
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
          onUpdateStatus={updateOrderStatus}
          onDeleteOrder={deleteOrder}
          onUpdateItemQuantity={updateOrderItemQuantity}
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
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <MenuSection onAddToCart={handleAddToCart} lang={lang} />
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
      />

      <ChatWidget 
        lang={lang} 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
      />
    </div>
  );
}
