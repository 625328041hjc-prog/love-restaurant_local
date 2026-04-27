export interface Dish {
  id: number;
  name: string;
  image_url: string;
  price: number;
  method: string;
  is_active: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  dish_id: number;
  qty: number;
  price: number;
}

export interface OrderReview {
  id: number;
  order_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Order {
  id: number;
  note: string;
  status: 'new' | 'completed' | 'pending';
  created_at: string;
  items: OrderItem[];
  reviews: OrderReview[];
}
