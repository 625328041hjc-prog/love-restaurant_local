import { Dish, Order, OrderItem } from '@/types';

const API_BASE = '/api';

export const api = {
  async getDishes(): Promise<Dish[]> {
    const res = await fetch(`${API_BASE}/dishes`);
    if (!res.ok) throw new Error('Failed to fetch dishes');
    return res.json();
  },

  async addDish(dish: Partial<Dish>): Promise<Dish> {
    const res = await fetch(`${API_BASE}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish),
    });
    if (!res.ok) throw new Error('Failed to add dish');
    return res.json();
  },

  async updateDish(id: number, dish: Partial<Dish>): Promise<void> {
    const res = await fetch(`${API_BASE}/dishes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish),
    });
    if (!res.ok) throw new Error('Failed to update dish');
  },

  async deleteDish(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/dishes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete dish');
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(note: string, items: { dish_id: number; qty: number; price: number }[]): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, items }),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },

  async updateOrderStatus(id: number, status: string): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
  },

  async addReview(orderId: number, rating: number, comment: string): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to add review');
  }
};
