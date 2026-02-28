import { useEffect, useState } from 'react';
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
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useDashboardStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function Analytics() {
  const { t, currency, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const { stats, loading, loadStats } = useDashboardStore();
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    if (currentTenant) {
      loadStats(currentTenant.id);
    }
  }, [currentTenant, loadStats]);

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
      title: t('orders.title'),
      value: stats.totalOrders.toString(),
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
      title: t('dashboard.avgOrderValue'),
      value: currency(stats.averageOrderValue),
      change: -2.3,
      icon: Package,
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

  const sourceTranslations: Record<string, string> = {
    whatsapp: 'WhatsApp',
    manual: t('source.manual'),
    recurring: t('source.recurring'),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('analytics.title')}</h1>
          <p className="text-slate-500 mt-1">
            {currentTenant.name} - {language === 'es' ? 'Resumen de rendimiento' : 'Performance summary'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{language === 'es' ? 'Ultimos 7 dias' : 'Last 7 days'}</SelectItem>
              <SelectItem value="30d">{language === 'es' ? 'Ultimos 30 dias' : 'Last 30 days'}</SelectItem>
              <SelectItem value="90d">{language === 'es' ? 'Ultimos 90 dias' : 'Last 90 days'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        </div>
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
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    card.change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
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

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="sales">{t('analytics.salesByDate')}</TabsTrigger>
          <TabsTrigger value="products">{t('analytics.topProducts')}</TabsTrigger>
          <TabsTrigger value="customers">{t('analytics.topCustomers')}</TabsTrigger>
          <TabsTrigger value="orders">{t('analytics.ordersByStatus')}</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Sales Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('analytics.salesByDate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesByDay}>
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                      <YAxis
                        yAxisId="left"
                        stroke="#94A3B8"
                        fontSize={12}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value, name) => [
                          name === 'sales' ? currency(value as number) : value,
                          name === 'sales'
                            ? language === 'es'
                              ? 'Ventas'
                              : 'Sales'
                            : language === 'es'
                            ? 'Pedidos'
                            : 'Orders',
                        ]}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fill="url(#salesGradient)"
                        name={language === 'es' ? 'Ventas' : 'Sales'}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#ordersGradient)"
                        name={language === 'es' ? 'Pedidos' : 'Orders'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.salesByCategory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="sales"
                        nameKey="category"
                      >
                        {stats.salesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [currency(value as number), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {stats.salesByCategory.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-slate-600">{item.category}</span>
                      </div>
                      <span className="font-medium text-slate-800">{currency(item.sales)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders by Source */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.ordersBySource')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.ordersBySource} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                      <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="source"
                        stroke="#94A3B8"
                        fontSize={12}
                        tickFormatter={(value) => sourceTranslations[value] || value}
                      />
                      <Tooltip
                        formatter={(value) => [value, '']}
                      />
                      <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.ordersByStatus')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="status"
                        label={({ name, percent }) =>
                          `${statusTranslations[name as string] || name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.topProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={12}
                      tickFormatter={(value) => (value.length > 12 ? `${value.slice(0, 12)}...` : value)}
                    />
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
                      }}
                      formatter={(value, name) => [
                        name === 'revenue' ? currency(value as number) : value,
                        name === 'revenue'
                          ? language === 'es'
                            ? 'Ingresos'
                            : 'Revenue'
                          : language === 'es'
                          ? 'Cantidad'
                          : 'Quantity',
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                      name={language === 'es' ? 'Ingresos' : 'Revenue'}
                    />
                    <Bar
                      dataKey="quantity"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name={language === 'es' ? 'Cantidad' : 'Quantity'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.topCustomers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="table-header">#</th>
                      <th className="table-header">{t('customers.name')}</th>
                      <th className="table-header text-center">{t('customers.orders')}</th>
                      <th className="table-header text-right">{t('customers.spent')}</th>
                      <th className="table-header text-right">
                        {language === 'es' ? 'Promedio' : 'Average'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b border-slate-100 last:border-0">
                        <td className="table-cell">
                          <Badge
                            variant={index < 3 ? 'default' : 'neutral'}
                            className={cn(
                              index === 0 && 'bg-yellow-500',
                              index === 1 && 'bg-slate-400',
                              index === 2 && 'bg-orange-400'
                            )}
                          >
                            {index + 1}
                          </Badge>
                        </td>
                        <td className="table-cell font-medium text-slate-800">{customer.name}</td>
                        <td className="table-cell text-center">
                          <Badge variant="neutral">{customer.orders}</Badge>
                        </td>
                        <td className="table-cell text-right font-semibold text-slate-800">
                          {currency(customer.spent)}
                        </td>
                        <td className="table-cell text-right text-slate-600">
                          {currency(customer.spent / customer.orders)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.ordersByStatus')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.ordersByStatus.map((item, index) => (
                    <div key={item.status} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {statusTranslations[item.status] || item.status}
                          </span>
                          <span className="text-sm text-slate-500">{item.count}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.count / stats.totalOrders) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('analytics.ordersBySource')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.ordersBySource.map((item, index) => (
                    <div key={item.source} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {sourceTranslations[item.source] || item.source}
                          </span>
                          <span className="text-sm text-slate-500">{item.count}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.count / stats.totalOrders) * 100}%`,
                              backgroundColor: COLORS[(index + 3) % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
