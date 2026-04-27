import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { CheckCircle2, Clock, Utensils, AlertCircle, Star } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, status: 'new' | 'completed') => {
    try {
      await api.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
      alert('状态更新失败');
    }
  };

  if (loading && orders.length === 0) return <div className="flex justify-center py-20 text-orange-500"><AlertCircle className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">最新订单</h2>
        <p className="text-gray-500 mt-2">她饿啦！快去厨房准备吧~</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>目前还没有订单哦</p>
          </div>
        ) : (
          orders.map(order => {
            const isNew = order.status === 'new' || order.status === 'pending';
            const totalQuantity = order.items.reduce((acc, item) => acc + item.qty, 0);
            const totalPrice = order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
            
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 ${
                  isNew ? 'shadow-lg border-2 border-orange-400 transform hover:scale-[1.01]' : 'shadow-sm border border-gray-100 opacity-70'
                }`}
              >
                <div className={`px-6 py-4 flex justify-between items-center ${isNew ? 'bg-orange-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isNew ? 'bg-orange-500 text-white' : 'bg-gray-300 text-white'}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        订单 #{order.id}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {isNew ? (
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold shadow-md transition-colors active:scale-95 flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      标记完成
                    </button>
                  ) : (
                    <span className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-full text-xs font-bold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      已完成
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                            {item.qty}x
                          </span>
                          <span className="font-medium text-gray-800 text-lg">{(item as any).name || '未知菜品'}</span>
                        </div>
                        <span className="text-gray-500 font-medium">
                          ¥{item.price * item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500">共 {totalQuantity} 件菜品</span>
                    <div className="text-xl font-bold text-orange-500">
                      总计: ¥{totalPrice}
                    </div>
                  </div>

                  {order.reviews && order.reviews.length > 0 && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-bold text-orange-600 mr-2">她的评价:</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < order.reviews[0].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      {order.reviews[0].comment && (
                        <p className="text-sm text-gray-700 italic">"{order.reviews[0].comment}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}