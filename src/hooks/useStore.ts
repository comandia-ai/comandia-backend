import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Tenant, User, Product, Customer, Order, Conversation, ChatMessage, OrderStatus, DashboardStats } from '@/types';
import {
  fetchTenants,
  fetchUsers,
  fetchProducts,
  createProduct,
  updateProductDb,
  deleteProductDb,
  fetchCustomers,
  createCustomer,
  updateCustomerDb,
  deleteCustomerDb,
  fetchOrders,
  updateOrderStatusDb,
  deleteOrderDb,
  fetchConversations,
  generateDashboardStatsFromDb,
} from '@/lib/supabase';
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
  login: (tenantId: string, email: string) => Promise<boolean>;
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
      login: async (tenantId, email) => {
        try {
          const allTenants = await fetchTenants();
          const tenant = allTenants.find(t => t.id === tenantId);
          if (!tenant) return false;

          const users = await fetchUsers(tenantId);
          const user = users.find(u => u.email === email);

          if (user) {
            set({ currentTenant: tenant, currentUser: user, isAuthenticated: true });
            return true;
          }

          // For demo: allow any email with matching tenant
          const demoUser: User = {
            id: generateId(),
            tenantId: tenant.id,
            email,
            name: email.split('@')[0],
            role: 'admin',
            createdAt: new Date(),
          };
          set({ currentTenant: tenant, currentUser: demoUser, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
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
  loading: boolean;
  loadedTenantId: string | null;
  loadProducts: (tenantId: string) => Promise<void>;
  getProductsByTenant: (tenantId: string) => Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  loadedTenantId: null,
  loadProducts: async (tenantId) => {
    if (get().loadedTenantId === tenantId && get().products.length > 0) return;
    set({ loading: true });
    try {
      const products = await fetchProducts(tenantId);
      set({ products, loadedTenantId: tenantId, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  getProductsByTenant: (tenantId) => get().products.filter(p => p.tenantId === tenantId),
  addProduct: async (product) => {
    try {
      const created = await createProduct(product.tenantId, product);
      if (created) {
        set((state) => ({ products: [...state.products, created] }));
      }
    } catch (e) {
      console.error('Failed to add product:', e);
    }
  },
  updateProduct: async (id, updates) => {
    try {
      await updateProductDb(id, updates);
      set((state) => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
      }));
    } catch (e) {
      console.error('Failed to update product:', e);
    }
  },
  deleteProduct: async (id) => {
    try {
      await deleteProductDb(id);
      set((state) => ({ products: state.products.filter(p => p.id !== id) }));
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  },
}));

// Customers Store
interface CustomersState {
  customers: Customer[];
  loading: boolean;
  loadedTenantId: string | null;
  loadCustomers: (tenantId: string) => Promise<void>;
  getCustomersByTenant: (tenantId: string) => Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent' | 'averageOrderValue'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  loading: false,
  loadedTenantId: null,
  loadCustomers: async (tenantId) => {
    if (get().loadedTenantId === tenantId && get().customers.length > 0) return;
    set({ loading: true });
    try {
      const customers = await fetchCustomers(tenantId);
      set({ customers, loadedTenantId: tenantId, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  getCustomersByTenant: (tenantId) => get().customers.filter(c => c.tenantId === tenantId),
  addCustomer: async (customer) => {
    try {
      const created = await createCustomer(customer.tenantId, customer);
      if (created) {
        set((state) => ({ customers: [...state.customers, created] }));
      }
    } catch (e) {
      console.error('Failed to add customer:', e);
    }
  },
  updateCustomer: async (id, updates) => {
    try {
      await updateCustomerDb(id, updates);
      set((state) => ({
        customers: state.customers.map(c =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
        ),
      }));
    } catch (e) {
      console.error('Failed to update customer:', e);
    }
  },
  deleteCustomer: async (id) => {
    try {
      await deleteCustomerDb(id);
      set((state) => ({ customers: state.customers.filter(c => c.id !== id) }));
    } catch (e) {
      console.error('Failed to delete customer:', e);
    }
  },
}));

// Orders Store
interface OrdersState {
  orders: Order[];
  loading: boolean;
  loadedTenantId: string | null;
  loadOrders: (tenantId: string) => Promise<void>;
  getOrdersByTenant: (tenantId: string) => Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,
  loadedTenantId: null,
  loadOrders: async (tenantId) => {
    if (get().loadedTenantId === tenantId && get().orders.length > 0) return;
    set({ loading: true });
    try {
      const orders = await fetchOrders(tenantId);
      set({ orders, loadedTenantId: tenantId, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  getOrdersByTenant: (tenantId) => get().orders.filter(o => o.tenantId === tenantId),
  updateOrderStatus: async (id, status) => {
    try {
      await updateOrderStatusDb(id, status);
      set((state) => ({
        orders: state.orders.map(o => {
          if (o.id !== id) return o;
          const updates: Partial<Order> = { status, updatedAt: new Date() };
          if (status === 'confirmed') updates.confirmedAt = new Date();
          if (status === 'delivered') updates.deliveredAt = new Date();
          return { ...o, ...updates };
        }),
      }));
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  },
  deleteOrder: async (id) => {
    try {
      await deleteOrderDb(id);
      set((state) => ({ orders: state.orders.filter(o => o.id !== id) }));
    } catch (e) {
      console.error('Failed to delete order:', e);
    }
  },
}));

// Conversations Store
interface ConversationsState {
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  loading: boolean;
  loadedTenantId: string | null;
  loadConversations: (tenantId: string) => Promise<void>;
  getConversationsByTenant: (tenantId: string) => Conversation[];
  getMessagesByConversation: (conversationId: string) => ChatMessage[];
  setActiveConversation: (id: string | null) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,
  loading: false,
  loadedTenantId: null,
  loadConversations: async (tenantId) => {
    if (get().loadedTenantId === tenantId && get().conversations.length > 0) return;
    set({ loading: true });
    try {
      const result = await fetchConversations(tenantId);
      set({
        conversations: result.conversations,
        messages: result.messages,
        loadedTenantId: tenantId,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
  getConversationsByTenant: (tenantId) => get().conversations.filter(c => c.tenantId === tenantId),
  getMessagesByConversation: (conversationId) => get().messages.filter(m => m.conversationId === conversationId),
  setActiveConversation: (id) => set({ activeConversationId: id }),
}));

// Dashboard Stats Store
interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  loadedTenantId: string | null;
  loadStats: (tenantId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  loadedTenantId: null,
  loadStats: async (tenantId) => {
    set({ loading: true });
    try {
      const stats = await generateDashboardStatsFromDb(tenantId);
      set({ stats, loadedTenantId: tenantId, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));

// Tenants Store
interface TenantsState {
  tenants: Tenant[];
  loading: boolean;
  loaded: boolean;
  loadTenants: () => Promise<void>;
}

export const useTenantsStore = create<TenantsState>((set, get) => ({
  tenants: [],
  loading: false,
  loaded: false,
  loadTenants: async () => {
    if (get().loaded) return;
    set({ loading: true });
    try {
      const tenants = await fetchTenants();
      set({ tenants, loaded: true, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
