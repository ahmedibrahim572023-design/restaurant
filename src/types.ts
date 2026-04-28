export type Category = 'الكل' | 'أطباق رئيسية' | 'حلويات' | 'مشروبات' | 'سناكس' | 'All' | 'Main Dishes' | 'Desserts' | 'Drinks' | 'Snacks';

export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: Category;
  categoryEn: Category;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type DeliveryType = 'takeaway' | 'dine-in';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  customerName: string;
  customerPhone: string;
  pickupTime?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
