import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, X, Home, Users, Zap, Trophy, CheckSquare, ShoppingBag, Gamepad2, Box, Upload, ArrowUpDown, Package } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShopItem } from '../types/shop';

interface AdminShopPageProps {
  onBack: () => void;
  onNavigateToSection: (section: string) => void;
  onNavigateToModeration?: () => void;
  shopItems: ShopItem[];
  setShopItems: (items: ShopItem[]) => void;
}

export function AdminShopPage({ onBack, onNavigateToSection, onNavigateToModeration, shopItems, setShopItems }: AdminShopPageProps) {
  // Товары теперь управляются через глобальное состояние
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigationItems = [
    { icon: Home, label: 'Главная', section: 'dashboard' },
    { icon: Users, label: 'Воркеры', section: 'workers' },
    { icon: Zap, label: 'Баттлы', section: 'battles' },
    { icon: Trophy, label: 'Достижения', section: 'achievements' },
    { icon: CheckSquare, label: 'Задачи', section: 'tasks' },
    { icon: ShoppingBag, label: 'Товары', section: 'shop' },
    { icon: Gamepad2, label: 'Игры', section: 'games' },
    { icon: Box, label: 'Кейсы', section: 'cases' }
  ];

  const categories = [
    { value: 'bonus', label: 'Бонус' },
    { value: 'privilege', label: 'Привилегия' },
    { value: 'cosmetic', label: 'Косметика' },
    { value: 'tool', label: 'Инструмент' }
  ];

  const sortedItems = [...shopItems].sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  const handleEditItem = (item: ShopItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const handleItemClick = (item: ShopItem) => {
    setSelectedItem(item);
    setShowEditItem(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteItem = (itemId: string) => {
    setShopItems(prev => prev.filter(item => item.id !== itemId));
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок страницы */}
      <div className="p-6">
        <h1 className="text-lg font-medium text-foreground text-center mb-4">Панель управления</h1>
        
        {/* Управление */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowAddItem(true)}
            className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Доб. товар
          </button>
          
          <button
            onClick={() => onNavigateToModeration?.()}
            className="px-4 py-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
          >
            Одобрить
          </button>
        </div>
      </div>

      {/* Содержимое */}
      <div className="px-6 space-y-6 pb-60">
        {/* Секция товаров */}
        <div className="glass-card rounded-2xl apple-shadow p-4">
          {/* Заголовок с кнопкой сортировки */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Доступные товары</h2>
            <button
              onClick={toggleSortOrder}
              className="p-2 glass-card rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title={`Сортировать по стоимости ${sortOrder === 'asc' ? 'по убыванию' : 'по возрастанию'}`}
            >
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>



          {/* Список товаров */}
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 border border-border/20 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  {/* Картинка товара */}
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <ImageWithFallback 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Стоимость: {item.price}g
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Логика покупки будет добавлена позже
                  }}
                  className="px-4 py-2 glass-card rounded-lg text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Купить
                </button>
              </div>
            ))}
            {sortedItems.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Нет товаров для отображения
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно добавления товара */}
      {showAddItem && (
        <ShopItemModal
          isEdit={false}
          item={null}
          onClose={() => setShowAddItem(false)}
          onSave={(itemData) => {
            const newItem: ShopItem = {
              id: Date.now().toString(),
              ...itemData,
              isActive: true
            };
            setShopItems(prev => [...prev, newItem]);
            setShowAddItem(false);
          }}
          categories={categories}
        />
      )}

      {/* Модальное окно редактирования товара */}
      {showEditItem && selectedItem && (
        <ShopItemModal
          isEdit={true}
          item={selectedItem}
          onClose={() => {
            setShowEditItem(false);
            setSelectedItem(null);
          }}
          onSave={(itemData) => {
            setShopItems(prev => prev.map(item => 
              item.id === selectedItem.id 
                ? { ...item, ...itemData }
                : item
            ));
            setShowEditItem(false);
            setSelectedItem(null);
          }}
          categories={categories}
        />
      )}

      {/* Быстрая навигация */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/20">
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {navigationItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = item.section === 'shop';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => item.section === 'dashboard' ? onBack() : onNavigateToSection(item.section)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 apple-shadow ${
                    isActive ? 'bg-primary' : 'glass-card'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-foreground/70'
                    }`} />
                  </div>
                  <span className={`text-xs ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {navigationItems.slice(4, 8).map((item, index) => {
              const Icon = item.icon;
              const isActive = item.section === 'shop';
              return (
                <button 
                  key={index} 
                  className="flex flex-col items-center text-center"
                  onClick={() => onNavigateToSection(item.section)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 apple-shadow ${
                    isActive ? 'bg-primary' : 'glass-card'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-foreground/70'
                    }`} />
                  </div>
                  <span className={`text-xs ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShopItemModalProps {
  isEdit: boolean;
  item: ShopItem | null;
  onClose: () => void;
  onSave: (itemData: Omit<ShopItem, 'id' | 'isActive'>) => void;
  categories: Array<{ value: string; label: string }>;
}

function ShopItemModal({ isEdit, item, onClose, onSave, categories }: ShopItemModalProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    price: item?.price || 0,
    description: item?.description || '',
    category: item?.category || 'bonus' as const,
    image: item?.image || ''
  });
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || formData.price <= 0) {
      alert('Заполните все обязательные поля');
      return;
    }
    onSave(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">
          {isEdit ? 'Редактирование товара' : 'Добавление товара'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Модальное окно для {isEdit ? 'редактирования существующего' : 'добавления нового'} товара в магазин с возможностью настройки названия, цены, категории и изображения
        </DialogDescription>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground text-center flex-1">
              {isEdit ? item?.title || 'Товар' : 'Название товара'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-4">
            {/* Картинка товара и описание */}
            <div className="flex gap-4">
              {/* Картинка */}
              <div className="relative">
                <div 
                  className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {formData.image ? (
                    <ImageWithFallback 
                      src={formData.image} 
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              {/* Описание */}
              <div className="flex-1 glass-card rounded-2xl p-3">
                <div className="text-sm font-medium text-foreground mb-2">Описание товара</div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="• Подзадача"
                  className="w-full bg-transparent text-sm text-muted-foreground resize-none border-none outline-none"
                  rows={3}
                />
              </div>
            </div>
            {/* Изменение цены (только для редактирования) */}
            {isEdit && (
              <div className="text-center">
                {!isEditingPrice ? (
                  <div
                    className="inline-block glass-card rounded-2xl px-4 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsEditingPrice(true)}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Цена:</div>
                    <div className="font-medium text-foreground">
                      {formData.price}g
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-4">
                    <div className="text-sm font-medium text-foreground/80 mb-3 text-center">
                      Изменить стоимость товара
                    </div>
                    <div className="flex gap-3 mb-4">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="1"
                        className="flex-1 p-3 bg-input-background border border-border rounded-2xl text-sm text-center"
                      />
                      <div className="w-16 p-3 bg-input-background border border-border rounded-2xl text-sm text-center text-muted-foreground">
                        G
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingPrice(false)}
                        className="flex-1"
                      >
                        Отменить
                      </Button>
                      <Button
                        onClick={() => setIsEditingPrice(false)}
                        className="flex-1 bg-primary text-primary-foreground"
                      >
                        Применить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isEdit && (
              <>
                {/* Название товара */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Введите название товара..."
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                  />
                </div>

                {/* Цена */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Цена (G-монеты) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="1"
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                  />
                </div>

                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Категория *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 border-t border-border/20 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отменить
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {isEdit ? 'Применить' : 'Добавить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}