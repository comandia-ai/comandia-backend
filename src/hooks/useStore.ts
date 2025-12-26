import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Tenant, User, Product, Customer, Order, Conversation, ChatMessage, OrderStatus } from '@/types';
import { tenants, users, products as mockProducts, customers as mockCustomers, orders as mockOrders, conversations as mockConversations, chatMessages as mockChatMessages } from '@/data/mockData';
import { generateId } from '@/lib/utils';

// App Store
interface AppState {
  language: Language;
  currentTenant: Tenant | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  setLanguage: (language: Language) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setCurrentUser: (user: User | null) => void;
  login: (tenantId: string, email: string) => boolean;
  logout: () => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'es',
      currentTenant: null,
      currentUser: null,
      isAuthenticated: false,
      sidebarCollapsed: false,
      setLanguage: (language) => set({ language }),
      setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
      setCurrentUser: (user) => set({ currentUser: user }),
      login: (tenantId, email) => {
        const tenant = tenants.find(t => t.id === tenantId);
        const user = users.find(u => u.tenantId === tenantId && u.email === email);
        if (tenant && user) {
          set({ currentTenant: tenant, currentUser: user, isAuthenticated: true });
          return true;
        }
        // For demo, allow any login with matching tenant
        if (tenant) {
          const demoUser: User = {
            id: generateId(),
            tenantId: tenant.id,
            email: email,
            name: email.split('@')[0],
            role: 'admin',
            createdAt: new Date(),
          };
          set({ currentTenant: tenant, currentUser: demoUser, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ currentTenant: null, currentUser: null, isAuthenticated: false }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        currentTenant: state.currentTenant,
        currentUser: state.currentUser,
      }),
    }
  )
);

// Products Store
interface ProductsState {
  products: Product[];
  getProductsByTenant: (tenantId: string) => Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: mockProducts,
  getProductsByTenant: (tenantId) => get().products.filter(p => p.tenantId === tenantId),
  addProduct: (product) => set((state) => ({
    products: [...state.products, {
      ...product,
      id: `prod-${generateId()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    )
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
}));

// Customers Store
interface CustomersState {
  customers: Customer[];
  getCustomersByTenant: (tenantId: string) => Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent' | 'averageOrderValue'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: mockCustomers,
  getCustomersByTenant: (tenantId) => get().customers.filter(c => c.tenantId === tenantId),
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, {
      ...customer,
      id: `cust-${generateId()}`,
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  })),
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
    )
  })),
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
}));

// Orders Store
interface OrdersState {
  orders: Order[];
  getOrdersByTenant: (tenantId: string) => Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: mockOrders,
  getOrdersByTenant: (tenantId) => get().orders.filter(o => o.tenantId === tenantId),
  addOrder: (order) => {
    const orderNumber = `PED-${new Date().getFullYear()}-${String(get().orders.length + 1).padStart(3, '0')}`;
    set((state) => ({
      orders: [...state.orders, {
        ...order,
        id: `ord-${generateId()}`,
        orderNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]
    }));
  },
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o =>
      o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o
    )
  })),
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => {
      if (o.id !== id) return o;
      const updates: Partial<Order> = { status, updatedAt: new Date() };
      if (status === 'confirmed') updates.confirmedAt = new Date();
      if (status === 'delivered') updates.deliveredAt = new Date();
      return { ...o, ...updates };
    })
  })),
  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter(o => o.id !== id)
  })),
}));

// Conversations Store
interface ConversationsState {
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  getConversationsByTenant: (tenantId: string) => Conversation[];
  getMessagesByConversation: (conversationId: string) => ChatMessage[];
  setActiveConversation: (id: string | null) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: mockConversations,
  messages: mockChatMessages,
  activeConversationId: null,
  getConversationsByTenant: (tenantId) => get().conversations.filter(c => c.tenantId === tenantId),
  getMessagesByConversation: (conversationId) => get().messages.filter(m => m.conversationId === conversationId),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: `msg-${generateId()}`,
      timestamp: new Date(),
      status: 'sent',
    }],
    conversations: state.conversations.map(c =>
      c.id === message.conversationId
        ? { ...c, lastMessageAt: new Date() }
        : c
    ),
  })),
}));

// Tenants Store (for demo purposes)
interface TenantsState {
  tenants: Tenant[];
  getTenants: () => Tenant[];
}

export const useTenantsStore = create<TenantsState>(() => ({
  tenants: tenants,
  getTenants: () => tenants,
}));
