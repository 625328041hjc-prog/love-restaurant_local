import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ClientHome from "@/pages/ClientHome";
import ClientOrders from "@/pages/ClientOrders";
import AdminLogin from "@/pages/admin/Login";
import AdminDishes from "@/pages/admin/Dishes";
import AdminOrders from "@/pages/admin/Orders";
import AdminLayout from "@/components/AdminLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/history" element={<ClientOrders />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="dishes" element={<AdminDishes />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}