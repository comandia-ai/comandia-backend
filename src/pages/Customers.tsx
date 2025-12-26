import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Phone,
  MapPin,
  ShoppingCart,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useCustomersStore, useOrdersStore } from '@/hooks/useStore';
import { cn, getInitials, getStatusColor } from '@/lib/utils';
import { Customer } from '@/types';

export function Customers() {
  const { t, currency, date, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const { getCustomersByTenant, addCustomer, updateCustomer, deleteCustomer } = useCustomersStore();
  const { getOrdersByTenant } = useOrdersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zone: '',
    nit: '',
    segment: 'new' as 'frequent' | 'occasional' | 'new' | 'inactive',
    preferredDeliveryTime: '',
    notes: '',
  });

  const customers = useMemo(() => {
    if (!currentTenant) return [];
    let filtered = getCustomersByTenant(currentTenant.id);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.businessName?.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.zone.toLowerCase().includes(query)
      );
    }

    if (segmentFilter !== 'all') {
      filtered = filtered.filter((c) => c.segment === segmentFilter);
    }

    return filtered.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [currentTenant, getCustomersByTenant, searchQuery, segmentFilter]);

  const customerOrders = useMemo(() => {
    if (!currentTenant || !selectedCustomer) return [];
    return getOrdersByTenant(currentTenant.id)
      .filter((o) => o.customerId === selectedCustomer.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [currentTenant, selectedCustomer, getOrdersByTenant]);

  const segmentTranslations: Record<string, string> = {
    frequent: t('customers.frequent'),
    occasional: t('customers.occasional'),
    new: t('customers.new'),
    inactive: t('customers.inactive'),
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      businessName: '',
      phone: '',
      email: '',
      address: '',
      city: currentTenant?.city || '',
      zone: '',
      nit: '',
      segment: 'new',
      preferredDeliveryTime: '',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      businessName: customer.businessName || '',
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      city: customer.city,
      zone: customer.zone,
      nit: customer.nit || '',
      segment: customer.segment,
      preferredDeliveryTime: customer.preferredDeliveryTime || '',
      notes: customer.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!currentTenant) return;

    const customerData = {
      tenantId: currentTenant.id,
      name: formData.name,
      businessName: formData.businessName || undefined,
      phone: formData.phone,
      email: formData.email || undefined,
      address: formData.address,
      city: formData.city,
      zone: formData.zone,
      nit: formData.nit || undefined,
      segment: formData.segment,
      preferredDeliveryTime: formData.preferredDeliveryTime || undefined,
      notes: formData.notes || undefined,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
      setShowDeleteDialog(false);
      if (selectedCustomer?.id === customerToDelete.id) {
        setSelectedCustomer(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('customers.title')}</h1>
          <p className="text-slate-500 mt-1">
            {customers.length} {language === 'es' ? 'clientes' : 'customers'}
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('customers.newCustomer')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('customers.search')}
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t('customers.segment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="frequent">{t('customers.frequent')}</SelectItem>
                <SelectItem value="occasional">{t('customers.occasional')}</SelectItem>
                <SelectItem value="new">{t('customers.new')}</SelectItem>
                <SelectItem value="inactive">{t('customers.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className={cn(
                      'p-4 cursor-pointer hover:bg-slate-50 transition-colors',
                      selectedCustomer?.id === customer.id && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                            {customer.businessName && (
                              <p className="text-sm text-slate-500">{customer.businessName}</p>
                            )}
                          </div>
                          <Badge className={getStatusColor(customer.segment)}>
                            {segmentTranslations[customer.segment]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {customer.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {customer.zone}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {customer.totalOrders} {language === 'es' ? 'pedidos' : 'orders'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{currency(customer.totalSpent)}</p>
                        <p className="text-xs text-slate-500">{t('customers.spent')}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {customers.length === 0 && (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">{t('common.noData')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Detail */}
        <div>
          {selectedCustomer ? (
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-3">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                      {getInitials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {selectedCustomer.name}
                  </h3>
                  {selectedCustomer.businessName && (
                    <p className="text-slate-500">{selectedCustomer.businessName}</p>
                  )}
                  <Badge className={cn('mt-2', getStatusColor(selectedCustomer.segment))}>
                    {segmentTranslations[selectedCustomer.segment]}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-slate-800">
                        {currency(selectedCustomer.totalSpent)}
                      </p>
                      <p className="text-xs text-slate-500">{t('customers.spent')}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-slate-800">
                        {selectedCustomer.totalOrders}
                      </p>
                      <p className="text-xs text-slate-500">{t('customers.orders')}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-slate-600">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-600">{selectedCustomer.address}</p>
                        <p className="text-slate-500">
                          {selectedCustomer.city} - {selectedCustomer.zone}
                        </p>
                      </div>
                    </div>
                    {selectedCustomer.lastOrderDate && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                        <span className="text-slate-600">
                          {language === 'es' ? 'Ultimo pedido: ' : 'Last order: '}
                          {date(selectedCustomer.lastOrderDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {customerOrders.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3">
                        {language === 'es' ? 'Pedidos recientes' : 'Recent orders'}
                      </h4>
                      <div className="space-y-2">
                        {customerOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg"
                          >
                            <span className="font-medium text-slate-700">{order.orderNumber}</span>
                            <span className="text-slate-600">{currency(order.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditModal(selectedCustomer)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setCustomerToDelete(selectedCustomer);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  {language === 'es'
                    ? 'Selecciona un cliente para ver detalles'
                    : 'Select a customer to view details'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer
                ? language === 'es'
                  ? 'Editar Cliente'
                  : 'Edit Customer'
                : t('customers.newCustomer')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('customers.name')} *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Juan Perez"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('customers.business')}</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Tienda Don Juan"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('customers.phone')} *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 310 555 1234"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cliente@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('customers.address')} *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle 123 #45-67"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Bogota"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('customers.zone')} *</Label>
                <Input
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  placeholder="Norte"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIT</Label>
                <Input
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                  placeholder="123456789-0"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('customers.segment')}</Label>
                <Select
                  value={formData.segment}
                  onValueChange={(v) =>
                    setFormData({ ...formData, segment: v as 'frequent' | 'occasional' | 'new' | 'inactive' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t('customers.new')}</SelectItem>
                    <SelectItem value="occasional">{t('customers.occasional')}</SelectItem>
                    <SelectItem value="frequent">{t('customers.frequent')}</SelectItem>
                    <SelectItem value="inactive">{t('customers.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'es' ? 'Horario preferido de entrega' : 'Preferred delivery time'}</Label>
              <Input
                value={formData.preferredDeliveryTime}
                onChange={(e) => setFormData({ ...formData, preferredDeliveryTime: e.target.value })}
                placeholder="8:00 AM - 10:00 AM"
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'es' ? 'Notas' : 'Notes'}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={language === 'es' ? 'Notas adicionales...' : 'Additional notes...'}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Confirmar eliminacion' : 'Confirm deletion'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            {language === 'es'
              ? `Esta seguro de eliminar a "${customerToDelete?.name}"? Esta accion no se puede deshacer.`
              : `Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
          </p>
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
