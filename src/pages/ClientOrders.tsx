import { useState, useEffect } from 'react';
import { Order, OrderReview } from '@/types';
import { ChevronLeft, Star, Utensils, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

export default function ClientOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingOrderId, setReviewingOrderId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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
  }, []);

  const submitReview = async (orderId: number) => {
    if (!rating) return;
    setSubmittingReview(true);
    try {
      await api.addReview(orderId, rating, comment);
      setReviewingOrderId(null);
      setRating(5);
      setComment('');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('评价提交失败，请重试');
    } finally {
      setSubmittingReview(false);
    }
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
      <header className="bg-white px-6 py-6 rounded-b-3xl shadow-sm mb-6 flex items-center">
        <Link to="/" className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors mr-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">我的点餐记录 📝</h1>
      </header>

      <div className="px-4 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>还没有点过餐哦，快去看看今天吃什么吧！</p>
          </div>
        ) : (
          orders.map(order => {
            const hasReview = order.reviews && order.reviews.length > 0;
            const review = hasReview ? order.reviews[0] : null;
            const isCompleted = order.status === 'completed';

            return (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                  <div className="text-sm text-gray-500 font-medium">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> 已完成
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      制作中...
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{(item as any).name || '未知菜品'} <span className="text-gray-400 ml-1">x{item.qty}</span></span>
                      <span className="text-gray-500">¥{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {isCompleted && !hasReview && reviewingOrderId !== order.id && (
                  <button
                    onClick={() => { setReviewingOrderId(order.id); setRating(5); setComment(''); }}
                    className="w-full mt-2 py-2.5 bg-orange-100 text-orange-600 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    写评价 / 留言
                  </button>
                )}

                {reviewingOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          onClick={() => setRating(star)}
                          className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="有什么想对他说的？(比如：太咸啦、超好吃！)"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm mb-3 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReviewingOrderId(null)}
                        className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => submitReview(order.id)}
                        disabled={submittingReview}
                        className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold flex items-center justify-center"
                      >
                        {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : '提交评价'}
                      </button>
                    </div>
                  </div>
                )}

                {hasReview && review && (
                  <div className="mt-4 p-4 bg-orange-50/50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <div className="flex gap-1 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-orange-600 font-bold">我的评价</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}