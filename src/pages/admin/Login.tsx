import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UtensilsCrossed } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hjclovezyt') {
      localStorage.setItem('adminToken', 'true');
      navigate('/admin/orders');
    } else {
      setError('密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <UtensilsCrossed className="w-10 h-10 text-orange-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">专属餐厅后台</h2>
        <p className="text-gray-500 mb-8">准备好为她做一顿大餐了吗？</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-gray-700"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-left px-4">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
          >
            登录后台
          </button>
        </form>
      </div>
    </div>
  );
}
