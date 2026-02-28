import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  Grid3X3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useProductsStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

export function Products() {
  const { t, currency, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const { getProductsByTenant, addProduct, updateProduct, deleteProduct, loadProducts } = useProductsStore();

  useEffect(() => {
    if (currentTenant) loadProducts(currentTenant.id);
  }, [currentTenant, loadProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    unit: 'unidad',
    image: '',
    isActive: true,
  });

  const products = useMemo(() => {
    if (!currentTenant) return [];
    let filtered = getProductsByTenant(currentTenant.id);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [currentTenant, getProductsByTenant, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    if (!currentTenant) return [];
    const allProducts = getProductsByTenant(currentTenant.id);
    return [...new Set(allProducts.map((p) => p.category))];
  }, [currentTenant, getProductsByTenant]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      unit: 'unidad',
      image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=300&fit=crop',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      unit: product.unit,
      image: product.image,
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!currentTenant) return;

    const productData = {
      tenantId: currentTenant.id,
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
      unit: formData.unit,
      image: formData.image,
      isActive: formData.isActive,
      tags: [],
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: t('products.outOfStock'), variant: 'error' as const };
    }
    if (product.minStock && product.stock <= product.minStock) {
      return { label: t('products.lowStock'), variant: 'warning' as const };
    }
    return { label: `${product.stock} ${product.unit}`, variant: 'success' as const };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('products.title')}</h1>
          <p className="text-slate-500 mt-1">
            {products.length} {language === 'es' ? 'productos' : 'products'}
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('products.newProduct')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('products.search')}
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t('products.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <Card
                key={product.id}
                className={cn(
                  'overflow-hidden hover:shadow-md transition-shadow',
                  !product.isActive && 'opacity-60'
                )}
              >
                <div className="aspect-square relative bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="neutral">{t('products.inactive')}</Badge>
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="error" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t('products.outOfStock')}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-slate-500">{product.sku}</p>
                    <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      {currency(product.price)}
                    </span>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral">{product.category}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(product)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteDialog(true);
                        }}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header">{t('products.image')}</th>
                    <th className="table-header">{t('products.name')}</th>
                    <th className="table-header">{t('products.sku')}</th>
                    <th className="table-header">{t('products.category')}</th>
                    <th className="table-header text-right">{t('products.price')}</th>
                    <th className="table-header text-center">{t('products.stock')}</th>
                    <th className="table-header text-center">{t('products.status')}</th>
                    <th className="table-header text-center">{t('orders.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr
                        key={product.id}
                        className={cn(
                          'border-b border-slate-100 hover:bg-slate-50 transition-colors',
                          !product.isActive && 'opacity-60'
                        )}
                      >
                        <td className="table-cell">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="table-cell">
                          <p className="font-medium text-slate-800">{product.name}</p>
                        </td>
                        <td className="table-cell text-slate-600">{product.sku}</td>
                        <td className="table-cell">
                          <Badge variant="neutral">{product.category}</Badge>
                        </td>
                        <td className="table-cell text-right font-semibold text-slate-800">
                          {currency(product.price)}
                        </td>
                        <td className="table-cell text-center">
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        </td>
                        <td className="table-cell text-center">
                          <Badge variant={product.isActive ? 'success' : 'neutral'}>
                            {product.isActive ? t('products.active') : t('products.inactive')}
                          </Badge>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(product)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setProductToDelete(product);
                                setShowDeleteDialog(true);
                              }}
                              className="h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">{t('common.noData')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct
                ? language === 'es'
                  ? 'Editar Producto'
                  : 'Edit Product'
                : t('products.newProduct')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('products.name')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Coca-Cola 2.5L"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('products.sku')}</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="BEB-CC-25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('products.description')}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'es' ? 'Descripcion del producto...' : 'Product description...'}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('products.price')}</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="8500"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('products.stock')}</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('products.category')}</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Bebidas"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('products.unit')}</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="paquete">Paquete</SelectItem>
                    <SelectItem value="caja">Caja</SelectItem>
                    <SelectItem value="bulto">Bulto</SelectItem>
                    <SelectItem value="kg">Kilogramo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('products.image')} (URL)</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{t('products.active')}</p>
                <p className="text-sm text-slate-500">
                  {language === 'es'
                    ? 'El producto estara disponible para pedidos'
                    : 'Product will be available for orders'}
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
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
              ? `Esta seguro de eliminar "${productToDelete?.name}"? Esta accion no se puede deshacer.`
              : `Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
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
