import { useState, useEffect } from 'react';
import { Dish } from '@/types';
import { Check, ShoppingBag, Loader2, Sparkles, Star, History } from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function ClientHome() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await api.getDishes();
        setDishes(data);
      } catch (err) {
        console.error('Failed to fetch dishes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const toggleItem = (dish: Dish) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[dish.id]) {
        delete newItems[dish.id];
      } else {
        newItems[dish.id] = 1;
      }
      return newItems;
    });
  };

  const totalPrice = Object.entries(selectedItems).reduce((total, [id, quantity]) => {
    const dish = dishes.find(d => d.id === Number(id));
    return total + (dish?.price || 0) * quantity;
  }, 0);

  const submitOrder = async () => {
    if (Object.keys(selectedItems).length === 0) return;
    
    setSubmitting(true);
    
    const items = Object.entries(selectedItems).map(([id, quantity]) => {
      const dish = dishes.find(d => d.id === Number(id));
      return {
        dish_id: Number(id),
        price: dish?.price || 0,
        qty: quantity
      };
    });

    try {
      await api.createOrder('', items);
      
      setOrderSuccess(true);
      setSelectedItems({});
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('订单提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlindBox = () => {
    if (dishes.length === 0) return;
    setIsSpinning(true);
    
    let times = 0;
    const maxTimes = 15;
    const interval = setInterval(() => {
      const randomId = dishes[Math.floor(Math.random() * dishes.length)].id;
      setSelectedItems({ [randomId]: 1 });
      times++;
      
      if (times >= maxTimes) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-8 rounded-b-3xl shadow-sm mb-6 relative">
        <Link to="/history" className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 bg-gray-50 rounded-full transition-colors active:scale-95">
          <History className="w-5 h-5" />
        </Link>
        <div className="flex justify-between items-end">
          <div className="pr-4">
            <h1 className="text-2xl font-bold text-gray-800 leading-tight mt-4">今天想吃什么呢？💕</h1>
            <p className="text-gray-500 mt-2 text-sm">专属私人菜单，选好后我来做~</p>
          </div>
          <button 
            onClick={handleBlindBox}
            disabled={isSpinning || dishes.length === 0}
            className="flex flex-col items-center justify-center p-3 bg-orange-100 text-orange-600 rounded-2xl hover:bg-orange-200 transition-colors active:scale-95 flex-shrink-0"
          >
            <Sparkles className={`w-6 h-6 mb-1 ${isSpinning ? 'animate-spin text-yellow-500' : ''}`} />
            <span className="text-xs font-bold whitespace-nowrap">不知道吃啥</span>
          </button>
        </div>
      </header>

      {/* Hot/Recommended Dishes (optional, just pick first 3) */}
      {dishes.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center mb-3 px-2">
            <Star className="w-5 h-5 text-yellow-500 mr-1 fill-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">今日推荐</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 px-2">
            {dishes.slice(0, 3).map(dish => (
              <div 
                key={`hot-${dish.id}`}
                onClick={() => toggleItem(dish)}
                className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform relative"
              >
                <div className="h-28 bg-gray-100 relative">
                  {dish.image_url ? (
                    <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">无图</div>
                  )}
                  {selectedItems[dish.id] && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-orange-500 text-white rounded-full p-1">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{dish.name}</h3>
                  {dish.price > 0 && <p className="text-orange-500 text-xs mt-1 font-semibold">¥{dish.price}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dish List */}
      <div className="px-4 space-y-4">
        {dishes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>菜单空空如也，快让他加点菜吧！</p>
          </div>
        ) : (
          dishes.map(dish => {
            const isSelected = !!selectedItems[dish.id];
            return (
              <div 
                key={dish.id}
                onClick={() => toggleItem(dish)}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 transform ${
                  isSelected ? 'ring-2 ring-orange-400 shadow-md scale-[1.02]' : 'shadow-sm'
                }`}
              >
                <div className="flex p-3">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                    {dish.image_url ? (
                      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        无图
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-orange-500 text-white rounded-full p-1">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col justify-between py-1 flex-1">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{dish.name}</h3>
                      {dish.method && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{dish.method}</p>
                      )}
                    </div>
                    {dish.price > 0 && (
                      <div className="text-orange-500 font-semibold text-sm">
                        ¥{dish.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
              {Object.keys(selectedItems).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {Object.keys(selectedItems).length}
                </span>
              )}
            </div>
            {totalPrice > 0 && (
              <span className="ml-3 font-bold text-lg">¥{totalPrice}</span>
            )}
          </div>
          
          <button
            onClick={submitOrder}
            disabled={Object.keys(selectedItems).length === 0 || submitting}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center ${
              Object.keys(selectedItems).length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-md'
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : orderSuccess ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {orderSuccess ? '发送成功！' : '发送订单'}
          </button>
        </div>
      </div>
    </div>
  );
}