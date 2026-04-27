import { useState, useEffect } from 'react';
import { Dish } from '@/types';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [method, setMethod] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setDishes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const openModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish);
      setName(dish.name);
      setPrice(dish.price.toString());
      setMethod(dish.method);
      setImagePreview(dish.image);
    } else {
      setEditingDish(null);
      setName('');
      setPrice('');
      setMethod('');
      setImagePreview('');
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imagePath = editingDish ? editingDish.image : '';

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        imagePath = publicUrl;
      }

      const dishData = {
        name,
        price: parseFloat(price) || 0,
        method,
        image: imagePath
      };

      if (editingDish) {
        const { error } = await supabase
          .from('dishes')
          .update(dishData)
          .eq('id', editingDish.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('dishes')
          .insert([dishData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchDishes();
    } catch (err) {
      console.error(err);
      alert('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这道菜吗？她可能再也吃不到啦！')) return;
    try {
      const { error } = await supabase.from('dishes').delete().eq('id', id);
      if (error) throw error;
      fetchDishes();
    } catch (err) {
      console.error(err);
      alert('删除失败');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">私房菜菜单</h2>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加新菜品
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(dish => (
          <div key={dish.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-48 bg-gray-50 relative">
              {dish.image ? (
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-500 shadow-sm">
                ¥{dish.price}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{dish.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-4">{dish.method}</p>
              
              <div className="flex justify-end gap-2 border-t border-gray-50 pt-4">
                <button
                  onClick={() => openModal(dish)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                {editingDish ? '编辑菜品' : '添加新菜品'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">菜品图片</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    点击图片区域上传<br/>建议尺寸 1:1
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  placeholder="例如：糖醋排骨"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">价格 (象征性收费~)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">做法说明 / 描述</label>
                <textarea
                  rows={3}
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all resize-none"
                  placeholder="少盐无糖，记得多加爱心..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                  保存菜品
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}