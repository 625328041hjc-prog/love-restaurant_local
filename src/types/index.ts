export interface Dish {
  id: number;
  name: string;
  image: string;
  price: number;
  method: string;
  created_at: string;
}

export interface OrderItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: string; // JSON string in DB, but we will parse it in frontend
  parsedItems?: OrderItem[];
  total_price: number;
  status: 'new' | 'completed';
  created_at: string;
}
