import { createClient } from '@supabase/supabase-js';
import type { Tenant, User, Product, Customer, Order, OrderItem, Conversation, ChatMessage, DashboardStats, OrderStatus, OrderSource } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Data Transformers (DB → Frontend Types) ---

const segmentMap: Record<string, Customer['segment']> = {
  'regular': 'occasional',
  'new': 'new',
  'vip': 'frequent',
  'inactive': 'inactive',
};

const segmentToDb: Record<string, string> = {
  'occasional': 'regular',
  'new': 'new',
  'frequent': 'vip',
  'inactive': 'inactive',
};

function toTenant(row: any): Tenant {
  return {
    id: row.id,
    name: row.business_name || row.name,
    whatsappNumber: row.whatsapp_number || '',
    logo: row.logo_url || '',
    businessType: row.business_type || '',
    address: row.address || '',
    city: row.city || '',
    country: row.country || 'Colombia',
    timezone: row.timezone || 'America/Bogota',
    currency: row.currency || 'COP',
    createdAt: new Date(row.created_at),
    isActive: row.is_active,
    settings: {
      businessHours: { start: '08:00', end: '20:00', days: [1, 2, 3, 4, 5, 6] },
      welcomeMessage: 'Bienvenido a ' + (row.business_name || row.name),
      orderConfirmationTemplate: 'Tu pedido {orderNumber} ha sido confirmado.',
      upsellEnabled: true,
      autoConfirmOrders: false,
      notificationsEnabled: true,
      ...(row.settings || {}),
    },
  };
}

function toProduct(row: any, categoryName?: string): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    sku: row.sku,
    description: row.description || '',
    price: Number(row.price),
    costPrice: row.cost ? Number(row.cost) : undefined,
    stock: row.stock ?? 0,
    minStock: row.min_stock ?? 0,
    category: categoryName || '',
    unit: row.unit || 'unidad',
    image: row.image_url || '',
    isActive: row.is_active,
    tags: row.tags || [],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toCustomer(row: any): Customer {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    businessName: row.business_name || undefined,
    phone: row.phone,
    email: row.email || undefined,
    address: row.address || '',
    city: row.city || '',
    zone: row.zone || '',
    segment: segmentMap[row.customer_type] || 'new',
    lastOrderDate: row.last_order_date ? new Date(row.last_order_date) : undefined,
    totalOrders: row.total_orders ?? 0,
    totalSpent: Number(row.total_spent ?? 0),
    averageOrderValue: row.total_orders > 0 ? Number(row.total_spent ?? 0) / row.total_orders : 0,
    notes: row.notes || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toOrder(row: any, items: OrderItem[], customerName: string, customerPhone: string): Order {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    customerId: row.customer_id,
    customerName,
    customerPhone,
    orderNumber: row.order_number,
    items,
    status: row.status as OrderStatus,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total),
    source: (row.source || 'whatsapp') as OrderSource,
    deliveryAddress: row.delivery_address || '',
    deliveryZone: row.delivery_zone || '',
    deliveryDate: new Date(row.delivery_date || row.created_at),
    deliveryTime: row.delivery_time_slot || '',
    notes: row.notes || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    confirmedAt: row.confirmed_at ? new Date(row.confirmed_at) : undefined,
    deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
  };
}

function toOrderItem(row: any): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    productSku: row.product_sku,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price),
    subtotal: Number(row.subtotal),
    notes: row.notes || undefined,
  };
}

function toConversation(row: any, customerName: string, customerPhone: string): Conversation {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    customerId: row.customer_id || '',
    customerName,
    customerPhone,
    messages: [],
    status: row.status === 'active' ? 'active' : 'closed',
    lastMessageAt: new Date(row.last_message_at || row.updated_at),
    createdAt: new Date(row.created_at),
  };
}

function toChatMessage(row: any): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    content: row.content || '',
    type: (row.message_type || 'text') as ChatMessage['type'],
    sender: row.direction === 'inbound' ? 'customer' : 'bot',
    timestamp: new Date(row.sent_at || row.created_at),
    status: (row.status || 'sent') as ChatMessage['status'],
  };
}

// --- API Functions ---

export async function fetchTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return (data || []).map(toTenant);
}

export async function fetchUsers(tenantId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('tenant_id', tenantId);
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id,
    tenantId: row.tenant_id,
    email: row.email,
    name: row.full_name,
    role: row.role === 'super_admin' ? 'admin' : row.role,
    avatar: row.avatar_url,
    createdAt: new Date(row.created_at),
    lastLogin: row.last_login_at ? new Date(row.last_login_at) : undefined,
  }));
}

export async function fetchProducts(tenantId: string): Promise<Product[]> {
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name')
    .eq('tenant_id', tenantId);
  const catMap: Record<string, string> = {};
  (categories || []).forEach((c: any) => { catMap[c.id] = c.name; });

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name');
  if (error) throw error;
  return (data || []).map((row: any) => toProduct(row, catMap[row.category_id] || ''));
}

export async function createProduct(tenantId: string, product: Partial<Product>): Promise<Product | null> {
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name')
    .eq('tenant_id', tenantId)
    .eq('name', product.category || '')
    .limit(1);
  const categoryId = categories?.[0]?.id || null;

  const { data, error } = await supabase
    .from('products')
    .insert({
      tenant_id: tenantId,
      category_id: categoryId,
      sku: product.sku || `SKU-${Date.now()}`,
      name: product.name,
      description: product.description || '',
      unit: product.unit || 'unidad',
      price: product.price,
      cost: product.costPrice,
      stock: product.stock ?? 0,
      min_stock: product.minStock ?? 0,
      image_url: product.image || '',
      is_active: product.isActive ?? true,
      tags: product.tags || [],
    })
    .select()
    .single();
  if (error) throw error;
  return data ? toProduct(data, product.category || '') : null;
}

export async function updateProductDb(id: string, updates: Partial<Product>): Promise<void> {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
  if (updates.minStock !== undefined) dbUpdates.min_stock = updates.minStock;
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
  if (updates.image !== undefined) dbUpdates.image_url = updates.image;
  if (updates.unit !== undefined) dbUpdates.unit = updates.unit;

  const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
  if (error) throw error;
}

export async function deleteProductDb(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchCustomers(tenantId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('name');
  if (error) throw error;
  return (data || []).map(toCustomer);
}

export async function createCustomer(tenantId: string, customer: Partial<Customer>): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .insert({
      tenant_id: tenantId,
      name: customer.name,
      business_name: customer.businessName || null,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address || '',
      city: customer.city || '',
      zone: customer.zone || '',
      customer_type: segmentToDb[customer.segment || 'new'] || 'new',
      notes: customer.notes || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data ? toCustomer(data) : null;
}

export async function updateCustomerDb(id: string, updates: Partial<Customer>): Promise<void> {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.zone !== undefined) dbUpdates.zone = updates.zone;
  if (updates.segment !== undefined) dbUpdates.customer_type = segmentToDb[updates.segment] || 'regular';
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { error } = await supabase.from('customers').update(dbUpdates).eq('id', id);
  if (error) throw error;
}

export async function deleteCustomerDb(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchOrders(tenantId: string): Promise<Order[]> {
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const customerIds = [...new Set((ordersData || []).map((o: any) => o.customer_id))];
  const { data: customersData } = await supabase
    .from('customers')
    .select('id, name, phone')
    .in('id', customerIds);
  const custMap: Record<string, { name: string; phone: string }> = {};
  (customersData || []).forEach((c: any) => { custMap[c.id] = { name: c.name, phone: c.phone }; });

  const orderIds = (ordersData || []).map((o: any) => o.id);
  const { data: itemsData } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds.length > 0 ? orderIds : ['none']);
  const itemsMap: Record<string, OrderItem[]> = {};
  (itemsData || []).forEach((row: any) => {
    if (!itemsMap[row.order_id]) itemsMap[row.order_id] = [];
    itemsMap[row.order_id].push(toOrderItem(row));
  });

  return (ordersData || []).map((row: any) => {
    const cust = custMap[row.customer_id] || { name: 'Desconocido', phone: '' };
    return toOrder(row, itemsMap[row.id] || [], cust.name, cust.phone);
  });
}

export async function updateOrderStatusDb(id: string, status: OrderStatus): Promise<void> {
  const updates: any = { status };
  if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
  if (status === 'delivered') updates.delivered_at = new Date().toISOString();

  const { error } = await supabase.from('orders').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteOrderDb(id: string): Promise<void> {
  await supabase.from('order_items').delete().eq('order_id', id);
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchConversations(tenantId: string): Promise<{ conversations: Conversation[]; messages: ChatMessage[] }> {
  const { data: convData, error } = await supabase
    .from('whatsapp_conversations')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })
    .limit(50);
  if (error) throw error;

  const customerIds = [...new Set((convData || []).filter((c: any) => c.customer_id).map((c: any) => c.customer_id))];
  const { data: customersData } = await supabase
    .from('customers')
    .select('id, name, phone')
    .in('id', customerIds.length > 0 ? customerIds : ['none']);
  const custMap: Record<string, { name: string; phone: string }> = {};
  (customersData || []).forEach((c: any) => { custMap[c.id] = { name: c.name, phone: c.phone }; });

  const convIds = (convData || []).map((c: any) => c.id);
  const { data: msgData } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .in('conversation_id', convIds.length > 0 ? convIds : ['none'])
    .order('created_at', { ascending: true });

  const conversations = (convData || []).map((row: any) => {
    const cust = custMap[row.customer_id] || { name: row.phone, phone: row.phone };
    return toConversation(row, cust.name, cust.phone);
  });

  const messages = (msgData || []).map(toChatMessage);

  return { conversations, messages };
}

export async function generateDashboardStatsFromDb(tenantId: string): Promise<DashboardStats> {
  const [orders, customers, products] = await Promise.all([
    fetchOrders(tenantId),
    fetchCustomers(tenantId),
    fetchProducts(tenantId),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeCustomers = customers.filter(c => c.segment !== 'inactive').length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Top products
  const productRevenue: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productRevenue[item.productName]) {
        productRevenue[item.productName] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productRevenue[item.productName].quantity += item.quantity;
      productRevenue[item.productName].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Top customers
  const customerSpend: Record<string, { name: string; orders: number; spent: number }> = {};
  orders.forEach(o => {
    if (!customerSpend[o.customerName]) {
      customerSpend[o.customerName] = { name: o.customerName, orders: 0, spent: 0 };
    }
    customerSpend[o.customerName].orders += 1;
    customerSpend[o.customerName].spent += o.total;
  });
  const topCustomers = Object.values(customerSpend).sort((a, b) => b.spent - a.spent).slice(0, 5);

  // Sales by day (last 7 days)
  const salesByDay: DashboardStats['salesByDay'] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    const dayOrders = orders.filter(o => new Date(o.createdAt) >= d && new Date(o.createdAt) < nextD);
    salesByDay.push({
      date: d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }),
      sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Sales by category
  const catSales: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.name === item.productName);
      const cat = prod?.category || 'Otros';
      catSales[cat] = (catSales[cat] || 0) + item.subtotal;
    });
  });
  const salesByCategory = Object.entries(catSales).map(([category, sales]) => ({ category, sales }));

  // Orders by status
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as OrderStatus, count,
  }));

  // Orders by source
  const sourceCounts: Record<string, number> = {};
  orders.forEach(o => { sourceCounts[o.source] = (sourceCounts[o.source] || 0) + 1; });
  const ordersBySource = Object.entries(sourceCounts).map(([source, count]) => ({
    source: source as OrderSource, count,
  }));

  return {
    totalSales,
    totalOrders,
    activeCustomers,
    averageOrderValue,
    ordersToday: todayOrders.length,
    salesToday: todayOrders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    topProducts,
    topCustomers,
    salesByDay,
    salesByCategory,
    ordersByStatus,
    ordersBySource,
  };
}
