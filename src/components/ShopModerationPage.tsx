import { useState } from 'react';
import { ArrowLeft, X, Package, CheckCircle, XCircle } from './Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Order } from '../types/shop';

interface ShopModerationPageProps {
  onBack: () => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (orderId: string, trackingInfo: string) => void;
  onReject: (orderId: string, reason: string) => void;
}

function OrderDetailsModal({ order, isOpen, onClose, onApprove, onReject }: OrderDetailsModalProps) {
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    if (!trackingInfo.trim()) {
      alert('Необходимо заполнить информацию для отслеживания');
      return;
    }
    onApprove(order!.id, trackingInfo);
    onClose();
    setTrackingInfo('');
    setShowApprovalForm(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Необходимо указать причину отклонения');
      return;
    }
    onReject(order!.id, rejectionReason);
    onClose();
    setRejectionReason('');
    setShowRejectionForm(false);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-none max-w-sm p-0 [&>button]:hidden max-h-[90vh] overflow-hidden rounded-3xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-foreground text-center mb-4">
              Товар
            </DialogTitle>
            <DialogDescription className="sr-only">
              Детали заказа товара для модерации
            </DialogDescription>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1"></div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Товар */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden">
                  {order.itemImage ? (
                    <ImageWithFallback 
                      src={order.itemImage} 
                      alt={order.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{order.itemName}</div>
                  <div className="text-xs text-muted-foreground">
                    Стоимость: {order.itemPrice}g
                  </div>
                </div>
              </div>
            </div>

            {/* Информация о сотруднике */}
            <div>
              <div className="text-sm font-medium text-foreground mb-2">Сотрудник: {order.customerName}, {order.customerTeam}</div>
              <div className="text-sm text-muted-foreground">Баланс сотрудника:</div>
              <div className="text-sm font-medium text-foreground">{order.customerBalance}g</div>
            </div>

            {/* Формы одобрения/отклонения */}
            {showApprovalForm && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-3">
                  Информация для отслеживания *
                </div>
                <textarea
                  value={trackingInfo}
                  onChange={(e) => setTrackingInfo(e.target.value)}
                  placeholder="Введите трек-номер, ссылку на сертификат или другую информацию для отслеживания..."
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowApprovalForm(false)}
                    className="flex-1"
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Одобрить
                  </Button>
                </div>
              </div>
            )}

            {showRejectionForm && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-sm font-medium text-foreground mb-3">
                  Причина отклонения *
                </div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Укажите причину отклонения заказа..."
                  className="w-full p-3 bg-input-background border border-border rounded-2xl text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectionForm(false)}
                    className="flex-1"
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleReject}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Отклонить
                  </Button>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            {!showApprovalForm && !showRejectionForm && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionForm(true)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Отклонить
                </Button>
                <Button
                  onClick={() => setShowApprovalForm(true)}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  Одобрить
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShopModerationPage({ onBack, orders, setOrders }: ShopModerationPageProps) {
  // Заказы теперь управляются через глобальное состояние

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleApproveOrder = (orderId: string, trackingInfo: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'approved' as const, trackingInfo }
        : order
    ));
    // Здесь будет логика отправки данных на сервер
    console.log(`Order ${orderId} approved with tracking: ${trackingInfo}`);
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'rejected' as const, rejectionReason: reason }
        : order
    ));
    // Здесь будет логика отправки данных на сервер
    console.log(`Order ${orderId} rejected with reason: ${reason}`);
  };

  const pendingOrdersList = orders.filter(order => order.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Заголовок страницы */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </button>
          <h1 className="text-lg font-medium text-foreground">Модерация товаров</h1>
        </div>
      </div>

      {/* Содержимое */}
      <div className="px-6 space-y-4 pb-20">
        {pendingOrdersList.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-foreground font-medium mb-2">Нет заказов на модерации</div>
            <div className="text-sm text-muted-foreground">
              Все заказы обработаны
            </div>
          </div>
        ) : (
          pendingOrdersList.map((order) => (
            <div 
              key={order.id}
              className="glass-card rounded-2xl p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    {order.itemImage ? (
                      <ImageWithFallback 
                        src={order.itemImage} 
                        alt={order.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{order.itemName}</div>
                    <div className="text-xs text-muted-foreground">
                      Стоимость: {order.itemPrice}g
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Быстрое отклонение
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Быстрое одобрение
                    }}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Модальное окно деталей заказа */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        onApprove={handleApproveOrder}
        onReject={handleRejectOrder}
      />
    </div>
  );
}