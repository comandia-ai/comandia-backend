import { useEffect, useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  MessageCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useOrdersStore, useDashboardStore } from '@/hooks/useStore';
import { cn, getStatusColor } from '@/lib/utils';
import { Link } from 'react-router-dom';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function Dashboard() {
  const { t, currency } = useLanguage();
  const { currentTenant, currentUser } = useAppStore();
  const { orders, loadOrders } = useOrdersStore();
  const { stats, loading, loadStats } = useDashboardStore();

  useEffect(() => {
    if (currentTenant) {
      loadStats(currentTenant.id);
      loadOrders(currentTenant.id);
    }
  }, [currentTenant, loadStats, loadOrders]);

  const recentOrders = useMemo(() => {
    if (!currentTenant) return [];
    return orders
      .filter(o => o.tenantId === currentTenant.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [currentTenant, orders]);

  if (!currentTenant) return null;

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: t('dashboard.totalSales'),
      value: currency(stats.totalSales),
      change: 12.5,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.ordersToday'),
      value: stats.ordersToday.toString(),
      change: 8.2,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.activeCustomers'),
      value: stats.activeCustomers.toString(),
      change: 4.1,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.pendingOrders'),
      value: stats.pendingOrders.toString(),
      change: -2.3,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const statusTranslations: Record<string, string> = {
    pending: t('status.pending'),
    confirmed: t('status.confirmed'),
    preparing: t('status.preparing'),
    shipped: t('status.shipped'),
    delivered: t('status.delivered'),
    cancelled: t('status.cancelled'),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Message */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {t('dashboard.welcome')}, {currentUser?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">
            {currentTenant.name} - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/whatsapp">
          <Button variant="whatsapp" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp Demo
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn('p-3 rounded-xl', card.bgColor)}>
                  <card.icon className={cn('w-6 h-6', card.color)} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  card.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {card.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <p className="text-sm text-slate-500 mt-1">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.salesOverview')}</CardTitle>
              <p className="text-sm text-slate-500 mt-1">{t('dashboard.last7Days')}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesByDay}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [currency(value as number), 'Ventas']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.ordersByStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                  >
                    {stats.ordersByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      statusTranslations[name as string] || name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {stats.ordersByStatus.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-slate-600">
                      {statusTranslations[item.status] || item.status}
                    </span>
                  </div>
                  <span className="font-medium text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.recentOrders')}</CardTitle>
            <Link to="/orders">
              <Button variant="ghost" size="sm" className="gap-1">
                {t('common.view')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {order.source === 'whatsapp' ? (
                        <MessageCircle className="w-5 h-5 text-whatsapp" />
                      ) : (
                        <Package className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{currency(order.total)}</p>
                    <Badge className={cn('mt-1', getStatusColor(order.status))}>
                      {statusTranslations[order.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.topProducts')}</CardTitle>
            <Link to="/products">
              <Button variant="ghost" size="sm" className="gap-1">
                {t('common.view')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#94A3B8"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={12}
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => [currency(value as number), 'Ingresos']}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('dashboard.topCustomers')}</CardTitle>
          <Link to="/customers">
            <Button variant="ghost" size="sm" className="gap-1">
              {t('common.view')} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="table-header">{t('customers.name')}</th>
                  <th className="table-header text-center">{t('customers.orders')}</th>
                  <th className="table-header text-right">{t('customers.spent')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-800">{customer.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <Badge variant="neutral">{customer.orders} pedidos</Badge>
                    </td>
                    <td className="table-cell text-right font-semibold text-slate-800">
                      {currency(customer.spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
