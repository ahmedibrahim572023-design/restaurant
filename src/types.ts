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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';
