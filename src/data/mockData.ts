import { Tenant, User, Product, Customer, Order, Conversation, ChatMessage } from '@/types';

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

// Tenants (Mayoristas)
export const tenants: Tenant[] = [
  {
    id: 'tenant-001',
    name: 'Distribuidora El Progreso',
    whatsappNumber: '+57 300 123 4567',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
    businessType: 'Distribuidor de Bebidas',
    address: 'Calle 45 #23-67',
    city: 'Bogota',
    country: 'Colombia',
    timezone: 'America/Bogota',
    currency: 'COP',
    createdAt: daysAgo(180),
    isActive: true,
    settings: {
      businessHours: { start: '06:00', end: '18:00', days: [1, 2, 3, 4, 5, 6] },
      welcomeMessage: 'Bienvenido a Distribuidora El Progreso. Como puedo ayudarte hoy?',
      orderConfirmationTemplate: 'Gracias por tu pedido #{orderNumber}. Total: ${total}',
      upsellEnabled: true,
      autoConfirmOrders: false,
      notificationsEnabled: true,
    },
  },
  {
    id: 'tenant-002',
    name: 'Mayorista San Jose',
    whatsappNumber: '+57 311 987 6543',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100&h=100&fit=crop',
    businessType: 'Abarrotes y Granos',
    address: 'Carrera 12 #56-89',
    city: 'Medellin',
    country: 'Colombia',
    timezone: 'America/Bogota',
    currency: 'COP',
    createdAt: daysAgo(120),
    isActive: true,
    settings: {
      businessHours: { start: '05:00', end: '17:00', days: [1, 2, 3, 4, 5, 6] },
      welcomeMessage: 'Hola! Soy el asistente de Mayorista San Jose.',
      orderConfirmationTemplate: 'Pedido confirmado #{orderNumber}',
      upsellEnabled: true,
      autoConfirmOrders: true,
      notificationsEnabled: true,
    },
  },
  {
    id: 'tenant-003',
    name: 'Distribuciones La Estrella',
    whatsappNumber: '+52 55 1234 5678',
    logo: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?w=100&h=100&fit=crop',
    businessType: 'Productos de Consumo',
    address: 'Av. Insurgentes Sur 1234',
    city: 'Ciudad de Mexico',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    currency: 'MXN',
    createdAt: daysAgo(90),
    isActive: true,
    settings: {
      businessHours: { start: '07:00', end: '19:00', days: [1, 2, 3, 4, 5, 6] },
      welcomeMessage: 'Bienvenido a Distribuciones La Estrella!',
      orderConfirmationTemplate: 'Pedido #{orderNumber} recibido. Total: ${total}',
      upsellEnabled: false,
      autoConfirmOrders: false,
      notificationsEnabled: true,
    },
  },
];

// Users
export const users: User[] = [
  {
    id: 'user-001',
    tenantId: 'tenant-001',
    email: 'admin@elprogreso.com',
    name: 'Carlos Rodriguez',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    createdAt: daysAgo(180),
    lastLogin: hoursAgo(1),
  },
  {
    id: 'user-002',
    tenantId: 'tenant-001',
    email: 'ventas@elprogreso.com',
    name: 'Maria Garcia',
    role: 'operator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    createdAt: daysAgo(150),
    lastLogin: hoursAgo(3),
  },
  {
    id: 'user-003',
    tenantId: 'tenant-002',
    email: 'admin@sanjose.com',
    name: 'Pedro Martinez',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: daysAgo(120),
    lastLogin: hoursAgo(2),
  },
];

// Products for tenant-001
export const products: Product[] = [
  // Bebidas - Tenant 001
  {
    id: 'prod-001',
    tenantId: 'tenant-001',
    name: 'Coca-Cola 2.5L',
    sku: 'BEB-CC-25',
    description: 'Coca-Cola botella familiar 2.5 litros',
    price: 8500,
    costPrice: 6800,
    stock: 150,
    minStock: 50,
    category: 'Bebidas',
    subcategory: 'Gaseosas',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['gaseosa', 'coca-cola', 'familiar'],
    createdAt: daysAgo(180),
    updatedAt: daysAgo(5),
  },
  {
    id: 'prod-002',
    tenantId: 'tenant-001',
    name: 'Pepsi 2L',
    sku: 'BEB-PP-20',
    description: 'Pepsi botella 2 litros',
    price: 7200,
    costPrice: 5800,
    stock: 120,
    minStock: 40,
    category: 'Bebidas',
    subcategory: 'Gaseosas',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['gaseosa', 'pepsi'],
    createdAt: daysAgo(180),
    updatedAt: daysAgo(3),
  },
  {
    id: 'prod-003',
    tenantId: 'tenant-001',
    name: 'Cerveza Aguila x6',
    sku: 'BEB-AG-6P',
    description: 'Six pack Cerveza Aguila 330ml',
    price: 18000,
    costPrice: 14500,
    stock: 80,
    minStock: 30,
    category: 'Bebidas',
    subcategory: 'Cervezas',
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['cerveza', 'aguila', 'sixpack'],
    createdAt: daysAgo(180),
    updatedAt: daysAgo(1),
  },
  {
    id: 'prod-004',
    tenantId: 'tenant-001',
    name: 'Agua Cristal 5L',
    sku: 'BEB-AC-5L',
    description: 'Botellon de agua Cristal 5 litros',
    price: 6500,
    costPrice: 4800,
    stock: 200,
    minStock: 80,
    category: 'Bebidas',
    subcategory: 'Agua',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['agua', 'cristal', 'botellon'],
    createdAt: daysAgo(180),
    updatedAt: daysAgo(2),
  },
  {
    id: 'prod-005',
    tenantId: 'tenant-001',
    name: 'Jugo Hit Naranja 1L',
    sku: 'BEB-HN-1L',
    description: 'Jugo Hit sabor naranja 1 litro',
    price: 4200,
    costPrice: 3200,
    stock: 90,
    minStock: 35,
    category: 'Bebidas',
    subcategory: 'Jugos',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['jugo', 'naranja', 'hit'],
    createdAt: daysAgo(150),
    updatedAt: daysAgo(4),
  },
  {
    id: 'prod-006',
    tenantId: 'tenant-001',
    name: 'Red Bull 250ml',
    sku: 'BEB-RB-25',
    description: 'Bebida energizante Red Bull 250ml',
    price: 7500,
    costPrice: 5800,
    stock: 60,
    minStock: 25,
    category: 'Bebidas',
    subcategory: 'Energizantes',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['energizante', 'redbull'],
    createdAt: daysAgo(120),
    updatedAt: daysAgo(6),
  },
  {
    id: 'prod-007',
    tenantId: 'tenant-001',
    name: 'Gatorade Naranja 500ml',
    sku: 'BEB-GT-50',
    description: 'Bebida hidratante Gatorade naranja 500ml',
    price: 4800,
    costPrice: 3600,
    stock: 100,
    minStock: 40,
    category: 'Bebidas',
    subcategory: 'Hidratantes',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['hidratante', 'gatorade'],
    createdAt: daysAgo(100),
    updatedAt: daysAgo(2),
  },
  {
    id: 'prod-008',
    tenantId: 'tenant-001',
    name: 'Sprite 1.5L',
    sku: 'BEB-SP-15',
    description: 'Gaseosa Sprite 1.5 litros',
    price: 5500,
    costPrice: 4200,
    stock: 110,
    minStock: 45,
    category: 'Bebidas',
    subcategory: 'Gaseosas',
    unit: 'unidad',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['gaseosa', 'sprite', 'limon'],
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1),
  },
  // Abarrotes - Tenant 002
  {
    id: 'prod-009',
    tenantId: 'tenant-002',
    name: 'Arroz Diana 5kg',
    sku: 'ABR-AD-5K',
    description: 'Arroz Diana bulto de 5 kilos',
    price: 22000,
    costPrice: 18000,
    stock: 75,
    minStock: 30,
    category: 'Granos',
    subcategory: 'Arroz',
    unit: 'bulto',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['arroz', 'diana', 'bulto'],
    createdAt: daysAgo(120),
    updatedAt: daysAgo(3),
  },
  {
    id: 'prod-010',
    tenantId: 'tenant-002',
    name: 'Frijol Rojo 1kg',
    sku: 'ABR-FR-1K',
    description: 'Frijol rojo paquete 1 kilo',
    price: 8500,
    costPrice: 6800,
    stock: 120,
    minStock: 50,
    category: 'Granos',
    subcategory: 'Frijoles',
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['frijol', 'rojo', 'granos'],
    createdAt: daysAgo(120),
    updatedAt: daysAgo(5),
  },
  {
    id: 'prod-011',
    tenantId: 'tenant-002',
    name: 'Aceite Girasol 3L',
    sku: 'ABR-AG-3L',
    description: 'Aceite de girasol garrafa 3 litros',
    price: 32000,
    costPrice: 26000,
    stock: 45,
    minStock: 20,
    category: 'Aceites',
    subcategory: 'Vegetal',
    unit: 'garrafa',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['aceite', 'girasol', 'cocina'],
    createdAt: daysAgo(100),
    updatedAt: daysAgo(2),
  },
  {
    id: 'prod-012',
    tenantId: 'tenant-002',
    name: 'Azucar Manuelita 2.5kg',
    sku: 'ABR-AZ-25',
    description: 'Azucar blanca Manuelita 2.5 kilos',
    price: 9800,
    costPrice: 7800,
    stock: 90,
    minStock: 40,
    category: 'Endulzantes',
    subcategory: 'Azucar',
    unit: 'paquete',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop',
    isActive: true,
    tags: ['azucar', 'manuelita', 'blanca'],
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1),
  },
];

// Customers
export const customers: Customer[] = [
  {
    id: 'cust-001',
    tenantId: 'tenant-001',
    name: 'Jose Hernandez',
    businessName: 'Tienda Don Jose',
    phone: '+57 310 555 1234',
    email: 'donjose@email.com',
    address: 'Calle 72 #15-32',
    city: 'Bogota',
    zone: 'Norte',
    nit: '123456789-0',
    segment: 'frequent',
    lastOrderDate: daysAgo(1),
    totalOrders: 45,
    totalSpent: 4250000,
    averageOrderValue: 94444,
    preferredDeliveryTime: '8:00 AM - 10:00 AM',
    notes: 'Cliente preferencial. Siempre paga de contado.',
    createdAt: daysAgo(180),
    updatedAt: daysAgo(1),
  },
  {
    id: 'cust-002',
    tenantId: 'tenant-001',
    name: 'Ana Martinez',
    businessName: 'Minimarket La Esquina',
    phone: '+57 315 444 5678',
    email: 'laesquina@email.com',
    address: 'Carrera 45 #23-11',
    city: 'Bogota',
    zone: 'Centro',
    nit: '987654321-0',
    segment: 'frequent',
    lastOrderDate: daysAgo(2),
    totalOrders: 38,
    totalSpent: 3120000,
    averageOrderValue: 82105,
    preferredDeliveryTime: '10:00 AM - 12:00 PM',
    notes: 'Preferencia por productos Coca-Cola.',
    createdAt: daysAgo(150),
    updatedAt: daysAgo(2),
  },
  {
    id: 'cust-003',
    tenantId: 'tenant-001',
    name: 'Roberto Gomez',
    businessName: 'Supermercado El Ahorro',
    phone: '+57 320 333 9012',
    email: 'elahorro@email.com',
    address: 'Avenida 68 #45-67',
    city: 'Bogota',
    zone: 'Occidente',
    nit: '456789123-0',
    segment: 'frequent',
    lastOrderDate: daysAgo(3),
    totalOrders: 52,
    totalSpent: 6780000,
    averageOrderValue: 130384,
    preferredDeliveryTime: '6:00 AM - 8:00 AM',
    notes: 'Pedidos grandes. Necesita factura.',
    createdAt: daysAgo(200),
    updatedAt: daysAgo(3),
  },
  {
    id: 'cust-004',
    tenantId: 'tenant-001',
    name: 'Carmen Lopez',
    businessName: 'Tienda Carmencita',
    phone: '+57 318 222 3456',
    address: 'Calle 100 #8-20',
    city: 'Bogota',
    zone: 'Norte',
    segment: 'occasional',
    lastOrderDate: daysAgo(15),
    totalOrders: 12,
    totalSpent: 890000,
    averageOrderValue: 74166,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(15),
  },
  {
    id: 'cust-005',
    tenantId: 'tenant-001',
    name: 'Luis Perez',
    businessName: 'Cigarreria El Portal',
    phone: '+57 312 111 7890',
    address: 'Carrera 7 #34-56',
    city: 'Bogota',
    zone: 'Centro',
    segment: 'new',
    lastOrderDate: daysAgo(5),
    totalOrders: 3,
    totalSpent: 185000,
    averageOrderValue: 61666,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(5),
  },
  {
    id: 'cust-006',
    tenantId: 'tenant-001',
    name: 'Patricia Ruiz',
    businessName: 'Mercado Familiar',
    phone: '+57 317 999 4567',
    address: 'Calle 50 #30-15',
    city: 'Bogota',
    zone: 'Sur',
    segment: 'occasional',
    lastOrderDate: daysAgo(20),
    totalOrders: 8,
    totalSpent: 520000,
    averageOrderValue: 65000,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(20),
  },
  {
    id: 'cust-007',
    tenantId: 'tenant-002',
    name: 'Miguel Sanchez',
    businessName: 'Granero Don Miguel',
    phone: '+57 314 888 2345',
    address: 'Carrera 80 #45-22',
    city: 'Medellin',
    zone: 'Laureles',
    segment: 'frequent',
    lastOrderDate: daysAgo(1),
    totalOrders: 35,
    totalSpent: 5200000,
    averageOrderValue: 148571,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(1),
  },
  {
    id: 'cust-008',
    tenantId: 'tenant-002',
    name: 'Sandra Vargas',
    businessName: 'Tienda La Esperanza',
    phone: '+57 311 777 6789',
    address: 'Calle 33 #65-10',
    city: 'Medellin',
    zone: 'Poblado',
    segment: 'frequent',
    lastOrderDate: daysAgo(2),
    totalOrders: 28,
    totalSpent: 3850000,
    averageOrderValue: 137500,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(2),
  },
];

// Orders
export const orders: Order[] = [
  {
    id: 'ord-001',
    tenantId: 'tenant-001',
    customerId: 'cust-001',
    customerName: 'Jose Hernandez',
    customerPhone: '+57 310 555 1234',
    orderNumber: 'PED-2024-001',
    items: [
      { id: 'item-001', productId: 'prod-001', productName: 'Coca-Cola 2.5L', productSku: 'BEB-CC-25', quantity: 24, unitPrice: 8500, subtotal: 204000 },
      { id: 'item-002', productId: 'prod-003', productName: 'Cerveza Aguila x6', productSku: 'BEB-AG-6P', quantity: 10, unitPrice: 18000, subtotal: 180000 },
      { id: 'item-003', productId: 'prod-004', productName: 'Agua Cristal 5L', productSku: 'BEB-AC-5L', quantity: 12, unitPrice: 6500, subtotal: 78000 },
    ],
    status: 'delivered',
    subtotal: 462000,
    tax: 0,
    discount: 23100,
    total: 438900,
    source: 'whatsapp',
    deliveryAddress: 'Calle 72 #15-32, Bogota',
    deliveryZone: 'Norte',
    deliveryDate: daysAgo(1),
    deliveryTime: '8:00 AM - 10:00 AM',
    notes: 'Dejar en la bodega trasera',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    confirmedAt: daysAgo(1),
    deliveredAt: daysAgo(1),
  },
  {
    id: 'ord-002',
    tenantId: 'tenant-001',
    customerId: 'cust-002',
    customerName: 'Ana Martinez',
    customerPhone: '+57 315 444 5678',
    orderNumber: 'PED-2024-002',
    items: [
      { id: 'item-004', productId: 'prod-002', productName: 'Pepsi 2L', productSku: 'BEB-PP-20', quantity: 15, unitPrice: 7200, subtotal: 108000 },
      { id: 'item-005', productId: 'prod-005', productName: 'Jugo Hit Naranja 1L', productSku: 'BEB-HN-1L', quantity: 20, unitPrice: 4200, subtotal: 84000 },
    ],
    status: 'preparing',
    subtotal: 192000,
    tax: 0,
    discount: 0,
    total: 192000,
    source: 'whatsapp',
    deliveryAddress: 'Carrera 45 #23-11, Bogota',
    deliveryZone: 'Centro',
    deliveryDate: new Date(),
    deliveryTime: '10:00 AM - 12:00 PM',
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(1),
    confirmedAt: hoursAgo(2),
  },
  {
    id: 'ord-003',
    tenantId: 'tenant-001',
    customerId: 'cust-003',
    customerName: 'Roberto Gomez',
    customerPhone: '+57 320 333 9012',
    orderNumber: 'PED-2024-003',
    items: [
      { id: 'item-006', productId: 'prod-001', productName: 'Coca-Cola 2.5L', productSku: 'BEB-CC-25', quantity: 48, unitPrice: 8500, subtotal: 408000 },
      { id: 'item-007', productId: 'prod-006', productName: 'Red Bull 250ml', productSku: 'BEB-RB-25', quantity: 24, unitPrice: 7500, subtotal: 180000 },
      { id: 'item-008', productId: 'prod-007', productName: 'Gatorade Naranja 500ml', productSku: 'BEB-GT-50', quantity: 30, unitPrice: 4800, subtotal: 144000 },
    ],
    status: 'confirmed',
    subtotal: 732000,
    tax: 0,
    discount: 36600,
    total: 695400,
    source: 'whatsapp',
    deliveryAddress: 'Avenida 68 #45-67, Bogota',
    deliveryZone: 'Occidente',
    deliveryDate: new Date(),
    deliveryTime: '6:00 AM - 8:00 AM',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(4),
    confirmedAt: hoursAgo(4),
  },
  {
    id: 'ord-004',
    tenantId: 'tenant-001',
    customerId: 'cust-005',
    customerName: 'Luis Perez',
    customerPhone: '+57 312 111 7890',
    orderNumber: 'PED-2024-004',
    items: [
      { id: 'item-009', productId: 'prod-003', productName: 'Cerveza Aguila x6', productSku: 'BEB-AG-6P', quantity: 5, unitPrice: 18000, subtotal: 90000 },
      { id: 'item-010', productId: 'prod-008', productName: 'Sprite 1.5L', productSku: 'BEB-SP-15', quantity: 10, unitPrice: 5500, subtotal: 55000 },
    ],
    status: 'pending',
    subtotal: 145000,
    tax: 0,
    discount: 0,
    total: 145000,
    source: 'whatsapp',
    deliveryAddress: 'Carrera 7 #34-56, Bogota',
    deliveryZone: 'Centro',
    deliveryDate: new Date(),
    deliveryTime: '2:00 PM - 4:00 PM',
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
  },
  {
    id: 'ord-005',
    tenantId: 'tenant-001',
    customerId: 'cust-001',
    customerName: 'Jose Hernandez',
    customerPhone: '+57 310 555 1234',
    orderNumber: 'PED-2024-005',
    items: [
      { id: 'item-011', productId: 'prod-001', productName: 'Coca-Cola 2.5L', productSku: 'BEB-CC-25', quantity: 24, unitPrice: 8500, subtotal: 204000 },
    ],
    status: 'delivered',
    subtotal: 204000,
    tax: 0,
    discount: 10200,
    total: 193800,
    source: 'whatsapp',
    deliveryAddress: 'Calle 72 #15-32, Bogota',
    deliveryZone: 'Norte',
    deliveryDate: daysAgo(3),
    deliveryTime: '8:00 AM - 10:00 AM',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    confirmedAt: daysAgo(3),
    deliveredAt: daysAgo(3),
  },
  {
    id: 'ord-006',
    tenantId: 'tenant-001',
    customerId: 'cust-002',
    customerName: 'Ana Martinez',
    customerPhone: '+57 315 444 5678',
    orderNumber: 'PED-2024-006',
    items: [
      { id: 'item-012', productId: 'prod-004', productName: 'Agua Cristal 5L', productSku: 'BEB-AC-5L', quantity: 20, unitPrice: 6500, subtotal: 130000 },
      { id: 'item-013', productId: 'prod-002', productName: 'Pepsi 2L', productSku: 'BEB-PP-20', quantity: 12, unitPrice: 7200, subtotal: 86400 },
    ],
    status: 'delivered',
    subtotal: 216400,
    tax: 0,
    discount: 0,
    total: 216400,
    source: 'manual',
    deliveryAddress: 'Carrera 45 #23-11, Bogota',
    deliveryZone: 'Centro',
    deliveryDate: daysAgo(5),
    deliveryTime: '10:00 AM - 12:00 PM',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    confirmedAt: daysAgo(5),
    deliveredAt: daysAgo(5),
  },
  {
    id: 'ord-007',
    tenantId: 'tenant-001',
    customerId: 'cust-003',
    customerName: 'Roberto Gomez',
    customerPhone: '+57 320 333 9012',
    orderNumber: 'PED-2024-007',
    items: [
      { id: 'item-014', productId: 'prod-001', productName: 'Coca-Cola 2.5L', productSku: 'BEB-CC-25', quantity: 36, unitPrice: 8500, subtotal: 306000 },
      { id: 'item-015', productId: 'prod-003', productName: 'Cerveza Aguila x6', productSku: 'BEB-AG-6P', quantity: 15, unitPrice: 18000, subtotal: 270000 },
    ],
    status: 'cancelled',
    subtotal: 576000,
    tax: 0,
    discount: 28800,
    total: 547200,
    source: 'whatsapp',
    deliveryAddress: 'Avenida 68 #45-67, Bogota',
    deliveryZone: 'Occidente',
    deliveryDate: daysAgo(7),
    deliveryTime: '6:00 AM - 8:00 AM',
    notes: 'Cancelado por cliente - cambio de proveedor temporal',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  // Tenant 002 orders
  {
    id: 'ord-008',
    tenantId: 'tenant-002',
    customerId: 'cust-007',
    customerName: 'Miguel Sanchez',
    customerPhone: '+57 314 888 2345',
    orderNumber: 'MSJ-2024-001',
    items: [
      { id: 'item-016', productId: 'prod-009', productName: 'Arroz Diana 5kg', productSku: 'ABR-AD-5K', quantity: 10, unitPrice: 22000, subtotal: 220000 },
      { id: 'item-017', productId: 'prod-010', productName: 'Frijol Rojo 1kg', productSku: 'ABR-FR-1K', quantity: 15, unitPrice: 8500, subtotal: 127500 },
      { id: 'item-018', productId: 'prod-011', productName: 'Aceite Girasol 3L', productSku: 'ABR-AG-3L', quantity: 5, unitPrice: 32000, subtotal: 160000 },
    ],
    status: 'delivered',
    subtotal: 507500,
    tax: 0,
    discount: 25375,
    total: 482125,
    source: 'whatsapp',
    deliveryAddress: 'Carrera 80 #45-22, Medellin',
    deliveryZone: 'Laureles',
    deliveryDate: daysAgo(1),
    deliveryTime: '7:00 AM - 9:00 AM',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    confirmedAt: daysAgo(1),
    deliveredAt: daysAgo(1),
  },
];

// Conversations (WhatsApp simulation)
export const conversations: Conversation[] = [
  {
    id: 'conv-001',
    tenantId: 'tenant-001',
    customerId: 'cust-001',
    customerName: 'Jose Hernandez',
    customerPhone: '+57 310 555 1234',
    status: 'order_confirmed',
    lastMessageAt: hoursAgo(2),
    createdAt: hoursAgo(3),
    orderId: 'ord-001',
    messages: [],
  },
  {
    id: 'conv-002',
    tenantId: 'tenant-001',
    customerId: 'cust-005',
    customerName: 'Luis Perez',
    customerPhone: '+57 312 111 7890',
    status: 'pending_order',
    lastMessageAt: hoursAgo(1),
    createdAt: hoursAgo(2),
    messages: [],
  },
];

// Chat messages for demo
export const chatMessages: ChatMessage[] = [
  // Conversation 1 - Complete order flow
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    content: 'Buenos dias, necesito hacer un pedido',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(3),
    status: 'read',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    content: 'Buenos dias Don Jose! Con gusto le ayudo con su pedido. Que productos necesita hoy?',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(3),
    status: 'read',
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    content: 'Mandame lo de siempre, las cocas y las cervezas',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(3),
    status: 'read',
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    content: 'Perfecto! Basado en su pedido habitual, le confirmo:\n\n- 24x Coca-Cola 2.5L ($8,500 c/u) = $204,000\n- 10x Cerveza Aguila x6 ($18,000 c/u) = $180,000\n\nSubtotal: $384,000\n\nDesea agregar algo mas? Tenemos promocion en Agua Cristal 5L hoy.',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(3),
    status: 'read',
    metadata: {
      intent: 'order_recognition',
      suggestedProducts: products.filter(p => p.id === 'prod-004'),
    },
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    content: 'Si, agregale 12 aguas de esas',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(2.5),
    status: 'read',
  },
  {
    id: 'msg-006',
    conversationId: 'conv-001',
    content: 'Excelente! He agregado:\n\n- 12x Agua Cristal 5L ($6,500 c/u) = $78,000\n\nResumen de su pedido:\n- 24x Coca-Cola 2.5L = $204,000\n- 10x Cerveza Aguila x6 = $180,000\n- 12x Agua Cristal 5L = $78,000\n\nSubtotal: $462,000\nDescuento (5%): -$23,100\nTotal: $438,900\n\nDireccion de entrega: Calle 72 #15-32\nHorario: 8:00 AM - 10:00 AM\n\nConfirma este pedido?',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(2.5),
    status: 'read',
  },
  {
    id: 'msg-007',
    conversationId: 'conv-001',
    content: 'Si, confirmado. Que llegue temprano por favor',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(2),
    status: 'read',
  },
  {
    id: 'msg-008',
    conversationId: 'conv-001',
    content: 'Pedido confirmado! Numero de pedido: PED-2024-001\n\nTotal: $438,900\nEntrega: Hoy entre 8:00 AM - 10:00 AM\nNota: Entrega temprana solicitada\n\nGracias por su preferencia Don Jose! Le notificaremos cuando el pedido este en camino.',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(2),
    status: 'read',
  },
  // Conversation 2 - Natural language order in progress
  {
    id: 'msg-009',
    conversationId: 'conv-002',
    content: 'Hola buenas',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(2),
    status: 'read',
  },
  {
    id: 'msg-010',
    conversationId: 'conv-002',
    content: 'Hola! Bienvenido a Distribuidora El Progreso. Soy su asistente virtual. Como puedo ayudarle hoy?',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(2),
    status: 'read',
  },
  {
    id: 'msg-011',
    conversationId: 'conv-002',
    content: 'necesito 5 sixpack de aguila y unas gaseosas sprite',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(1.5),
    status: 'read',
  },
  {
    id: 'msg-012',
    conversationId: 'conv-002',
    content: 'Entendido! Le confirmo los productos:\n\n- 5x Cerveza Aguila x6 ($18,000 c/u) = $90,000\n- Sprite 1.5L - Cuantas unidades necesita?\n\nTambien tenemos Sprite en presentacion de 2L si le interesa.',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(1.5),
    status: 'read',
    metadata: {
      intent: 'clarification_needed',
    },
  },
  {
    id: 'msg-013',
    conversationId: 'conv-002',
    content: 'ponle 10 de las de litro y medio',
    type: 'text',
    sender: 'customer',
    timestamp: hoursAgo(1),
    status: 'read',
  },
  {
    id: 'msg-014',
    conversationId: 'conv-002',
    content: 'Perfecto! Su pedido actualizado:\n\n- 5x Cerveza Aguila x6 = $90,000\n- 10x Sprite 1.5L ($5,500 c/u) = $55,000\n\nTotal: $145,000\n\nPor favor confirme su direccion de entrega y horario preferido para completar el pedido.',
    type: 'text',
    sender: 'bot',
    timestamp: hoursAgo(1),
    status: 'delivered',
  },
];

// Helper function to get data by tenant
export const getProductsByTenant = (tenantId: string) =>
  products.filter(p => p.tenantId === tenantId);

export const getCustomersByTenant = (tenantId: string) =>
  customers.filter(c => c.tenantId === tenantId);

export const getOrdersByTenant = (tenantId: string) =>
  orders.filter(o => o.tenantId === tenantId);

export const getConversationsByTenant = (tenantId: string) =>
  conversations.filter(c => c.tenantId === tenantId);

export const getMessagesByConversation = (conversationId: string) =>
  chatMessages.filter(m => m.conversationId === conversationId);

// Dashboard stats generator
export const generateDashboardStats = (tenantId: string): {
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
  ordersByStatus: { status: string; count: number }[];
  ordersBySource: { source: string; count: number }[];
} => {
  const tenantOrders = getOrdersByTenant(tenantId);
  const tenantCustomers = getCustomersByTenant(tenantId);
  const tenantProducts = getProductsByTenant(tenantId);

  const deliveredOrders = tenantOrders.filter(o => o.status === 'delivered');
  const totalSales = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = tenantOrders.length;
  const activeCustomers = tenantCustomers.filter(c => c.segment !== 'inactive').length;
  const averageOrderValue = totalOrders > 0 ? totalSales / deliveredOrders.length : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = tenantOrders.filter(o => new Date(o.createdAt) >= today).length;
  const salesToday = tenantOrders
    .filter(o => new Date(o.createdAt) >= today && o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = tenantOrders.filter(o => o.status === 'pending').length;

  // Top products
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  tenantOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top customers
  const topCustomers = tenantCustomers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(c => ({ name: c.name, orders: c.totalOrders, spent: c.totalSpent }));

  // Sales by day (last 7 days)
  const salesByDay = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayOrders = tenantOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= date && orderDate < nextDate;
    });

    salesByDay.push({
      date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      sales: dayOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Sales by category
  const categorySales: Record<string, number> = {};
  tenantOrders.forEach(order => {
    order.items.forEach(item => {
      const product = tenantProducts.find(p => p.id === item.productId);
      const category = product?.category || 'Otros';
      categorySales[category] = (categorySales[category] || 0) + item.subtotal;
    });
  });
  const salesByCategory = Object.entries(categorySales).map(([category, sales]) => ({
    category,
    sales,
  }));

  // Orders by status
  const statusCounts: Record<string, number> = {};
  tenantOrders.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });
  const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  // Orders by source
  const sourceCounts: Record<string, number> = {};
  tenantOrders.forEach(order => {
    sourceCounts[order.source] = (sourceCounts[order.source] || 0) + 1;
  });
  const ordersBySource = Object.entries(sourceCounts).map(([source, count]) => ({
    source,
    count,
  }));

  return {
    totalSales,
    totalOrders,
    activeCustomers,
    averageOrderValue,
    ordersToday,
    salesToday,
    pendingOrders,
    topProducts,
    topCustomers,
    salesByDay,
    salesByCategory,
    ordersByStatus,
    ordersBySource,
  };
};
