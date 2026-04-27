import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, LogOut, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newOrder, setNewOrder] = useState(false);
  const lastOrderCount = useRef(0);

  useEffect(() => {
    // Check login state simply
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Polling for new orders
    const checkForNewOrders = async () => {
      try {
        const orders = await api.getOrders();
        if (lastOrderCount.current > 0 && orders.length > lastOrderCount.current) {
          setNewOrder(true);
          // Play notification sound
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
          } catch (e) {
            console.error("Audio play failed:", e);
          }
        }
        lastOrderCount.current = orders.length;
      } catch (err) {
        console.error(err);
      }
    };

    checkForNewOrders();
    const interval = setInterval(checkForNewOrders, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/orders', icon: LayoutDashboard, label: '订单管理', badge: newOrder },
    { path: '/admin/dishes', icon: UtensilsCrossed, label: '菜品管理' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-orange-600 flex items-center">
            <UtensilsCrossed className="w-6 h-6 mr-2" />
            专属私人餐厅
          </h1>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (item.path === '/admin/orders') setNewOrder(false);
                    }}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-50 text-orange-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-red-500 shadow-sm animate-pulse"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white h-14 border-b border-gray-100 flex items-center justify-between px-4">
          <h1 className="font-bold text-orange-600">专属私人餐厅</h1>
          <div className="flex items-center gap-4">
            <Link to="/admin/orders" onClick={() => setNewOrder(false)} className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {newOrder && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            </Link>
            <button onClick={handleLogout} className="text-gray-600"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (item.path === '/admin/orders') setNewOrder(false);
              }}
              className={`flex-1 py-3 flex flex-col items-center relative ${
                isActive ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-3 right-1/4 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}