export interface Tenant {
  id: string;
  name: string;
  whatsappNumber: string;
  logo: string;
  businessType: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
  createdAt: Date;
  isActive: boolean;
  settings: TenantSettings;
}

export interface TenantSettings {
  businessHours: {
    start: string;
    end: string;
    days: number[];
  };
  welcomeMessage: string;
  orderConfirmationTemplate: string;
  upsellEnabled: boolean;
  autoConfirmOrders: boolean;
  notificationsEnabled: boolean;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer' | 'operator';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock?: number;
  category: string;
  subcategory?: string;
  unit: string;
  image: string;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  businessName?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  zone: string;
  nit?: string;
  segment: 'frequent' | 'occasional' | 'new' | 'inactive';
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  preferredDeliveryTime?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderSource = 'whatsapp' | 'manual' | 'recurring';

export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  source: OrderSource;
  deliveryAddress: string;
  deliveryZone: string;
  deliveryDate: Date;
  deliveryTime: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'document';
  sender: 'customer' | 'bot' | 'agent';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  metadata?: {
    extractedOrder?: Partial<Order>;
    suggestedProducts?: Product[];
    intent?: string;
  };
}

export interface Conversation {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  messages: ChatMessage[];
  status: 'active' | 'pending_order' | 'order_confirmed' | 'closed';
  lastMessageAt: Date;
  createdAt: Date;
  orderId?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  ordersToday: number;
  salesToday: number;
  pendingOrders: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  topCustomers: { name: string; orders: number; spent: number }[];
  salesByDay: { date: string; sales: number; orders: number }[];
  salesByCategory: { category: string; sales: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
  ordersBySource: { source: OrderSource; count: number }[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type Language = 'es' | 'en';

export interface AppState {
  language: Language;
  currentTenant: Tenant | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
}
