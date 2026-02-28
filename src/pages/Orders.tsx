import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Download,
  Plus,
  Eye,
  Trash2,
  MessageCircle,
  Package,
  X,
  Check,
  Truck,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useOrdersStore } from '@/hooks/useStore';
import { getStatusColor, downloadCSV } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export function Orders() {
  const { t, currency, dateTime, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const { getOrdersByTenant, updateOrderStatus, deleteOrder, loadOrders } = useOrdersStore();

  useEffect(() => {
    if (currentTenant) loadOrders(currentTenant.id);
  }, [currentTenant, loadOrders]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const orders = useMemo(() => {
    if (!currentTenant) return [];
    let filtered = getOrdersByTenant(currentTenant.id);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerPhone.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter((o) => o.source === sourceFilter);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [currentTenant, getOrdersByTenant, searchQuery, statusFilter, sourceFilter]);

  const statusTranslations: Record<string, string> = {
    pending: t('status.pending'),
    confirmed: t('status.confirmed'),
    preparing: t('status.preparing'),
    shipped: t('status.shipped'),
    delivered: t('status.delivered'),
    cancelled: t('status.cancelled'),
  };

  const sourceTranslations: Record<string, string> = {
    whatsapp: t('source.whatsapp'),
    manual: t('source.manual'),
    recurring: t('source.recurring'),
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      setOrderToDelete(null);
      setShowDeleteDialog(false);
      if (selectedOrder?.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
    }
  };

  const handleExport = () => {
    const exportData = orders.map((o) => ({
      'Numero': o.orderNumber,
      'Cliente': o.customerName,
      'Telefono': o.customerPhone,
      'Estado': statusTranslations[o.status],
      'Total': o.total,
      'Origen': sourceTranslations[o.source],
      'Fecha': dateTime(o.createdAt),
      'Direccion': o.deliveryAddress,
    }));
    downloadCSV(exportData, `pedidos-${new Date().toISOString().split('T')[0]}`);
  };

  const getNextStatusActions = (status: OrderStatus): { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] => {
    switch (status) {
      case 'pending':
        return [
          { status: 'confirmed', label: t('orders.confirm'), icon: Check },
          { status: 'cancelled', label: t('orders.cancel'), icon: X },
        ];
      case 'confirmed':
        return [
          { status: 'preparing', label: t('orders.prepare'), icon: Package },
          { status: 'cancelled', label: t('orders.cancel'), icon: X },
        ];
      case 'preparing':
        return [
          { status: 'shipped', label: t('orders.ship'), icon: Truck },
          { status: 'cancelled', label: t('orders.cancel'), icon: X },
        ];
      case 'shipped':
        return [
          { status: 'delivered', label: t('orders.deliver'), icon: Check },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('orders.title')}</h1>
          <p className="text-slate-500 mt-1">
            {orders.length} {language === 'es' ? 'pedidos encontrados' : 'orders found'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t('orders.newOrder')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('orders.search')}
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t('orders.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('orders.all')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="confirmed">{t('status.confirmed')}</SelectItem>
                  <SelectItem value="preparing">{t('status.preparing')}</SelectItem>
                  <SelectItem value="shipped">{t('status.shipped')}</SelectItem>
                  <SelectItem value="delivered">{t('status.delivered')}</SelectItem>
                  <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('orders.source')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('orders.all')}</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">{t('orders.orderNumber')}</th>
                  <th className="table-header">{t('orders.customer')}</th>
                  <th className="table-header">{t('orders.date')}</th>
                  <th className="table-header">{t('orders.status')}</th>
                  <th className="table-header">{t('orders.source')}</th>
                  <th className="table-header text-right">{t('orders.total')}</th>
                  <th className="table-header text-center">{t('orders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="table-cell">
                      <span className="font-medium text-slate-800">{order.orderNumber}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-slate-800">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="table-cell text-slate-600">
                      {dateTime(order.createdAt)}
                    </td>
                    <td className="table-cell">
                      <Badge className={getStatusColor(order.status)}>
                        {statusTranslations[order.status]}
                      </Badge>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        {order.source === 'whatsapp' ? (
                          <MessageCircle className="w-4 h-4 text-whatsapp" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-slate-600">{sourceTranslations[order.source]}</span>
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold text-slate-800">
                      {currency(order.total)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 w-8"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setOrderToDelete(order);
                            setShowDeleteDialog(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">{t('common.noData')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span>{selectedOrder.orderNumber}</span>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {statusTranslations[selectedOrder.status]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {language === 'es' ? 'Detalles del pedido' : 'Order details'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">
                      {t('orders.customer')}
                    </h4>
                    <p className="font-medium text-slate-800">{selectedOrder.customerName}</p>
                    <p className="text-sm text-slate-600">{selectedOrder.customerPhone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">
                      {t('orders.delivery')}
                    </h4>
                    <p className="text-sm text-slate-600">{selectedOrder.deliveryAddress}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedOrder.deliveryTime}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-3">{t('orders.items')}</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="table-header">{t('products.name')}</th>
                          <th className="table-header text-center">Cant.</th>
                          <th className="table-header text-right">{t('products.price')}</th>
                          <th className="table-header text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-t border-slate-100">
                            <td className="table-cell">
                              <p className="font-medium text-slate-800">{item.productName}</p>
                              <p className="text-xs text-slate-500">{item.productSku}</p>
                            </td>
                            <td className="table-cell text-center">{item.quantity}</td>
                            <td className="table-cell text-right text-slate-600">
                              {currency(item.unitPrice)}
                            </td>
                            <td className="table-cell text-right font-medium text-slate-800">
                              {currency(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-700">{currency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Descuento</span>
                      <span className="text-green-600">-{currency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                    <span className="text-slate-800">Total</span>
                    <span className="text-slate-800">{currency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">{t('orders.notes')}</h4>
                    <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions */}
                {getNextStatusActions(selectedOrder.status).length > 0 && (
                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
                    {getNextStatusActions(selectedOrder.status).map((action) => (
                      <Button
                        key={action.status}
                        variant={action.status === 'cancelled' ? 'destructive' : 'default'}
                        onClick={() => handleStatusChange(selectedOrder.id, action.status)}
                        className="gap-2"
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'es' ? 'Confirmar eliminacion' : 'Confirm deletion'}</DialogTitle>
            <DialogDescription>
              {language === 'es'
                ? `Esta seguro de eliminar el pedido ${orderToDelete?.orderNumber}? Esta accion no se puede deshacer.`
                : `Are you sure you want to delete order ${orderToDelete?.orderNumber}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
