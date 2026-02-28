import { Language } from '@/types';

type TranslationKey = keyof typeof translations.es;

export const translations = {
  es: {
    // Navigation
    'nav.dashboard': 'Panel Principal',
    'nav.orders': 'Pedidos',
    'nav.products': 'Productos',
    'nav.customers': 'Clientes',
    'nav.whatsapp': 'WhatsApp',
    'nav.analytics': 'Analiticas',
    'nav.settings': 'Configuracion',
    'nav.logout': 'Cerrar Sesion',

    // Auth
    'auth.login': 'Iniciar Sesion',
    'auth.email': 'Correo Electronico',
    'auth.password': 'Contrasena',
    'auth.selectTenant': 'Seleccionar Empresa',
    'auth.welcome': 'Bienvenido',
    'auth.loginSubtitle': 'Ingresa a tu cuenta para continuar',

    // Dashboard
    'dashboard.title': 'Panel Principal',
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.totalSales': 'Ventas Totales',
    'dashboard.ordersToday': 'Pedidos Hoy',
    'dashboard.activeCustomers': 'Clientes Activos',
    'dashboard.pendingOrders': 'Pedidos Pendientes',
    'dashboard.avgOrderValue': 'Valor Promedio',
    'dashboard.recentOrders': 'Pedidos Recientes',
    'dashboard.topProducts': 'Productos Mas Vendidos',
    'dashboard.topCustomers': 'Mejores Clientes',
    'dashboard.salesOverview': 'Resumen de Ventas',
    'dashboard.last7Days': 'Ultimos 7 dias',

    // Orders
    'orders.title': 'Gestion de Pedidos',
    'orders.newOrder': 'Nuevo Pedido',
    'orders.orderNumber': 'Numero de Pedido',
    'orders.customer': 'Cliente',
    'orders.date': 'Fecha',
    'orders.status': 'Estado',
    'orders.total': 'Total',
    'orders.source': 'Origen',
    'orders.actions': 'Acciones',
    'orders.details': 'Detalles',
    'orders.items': 'Articulos',
    'orders.delivery': 'Entrega',
    'orders.notes': 'Notas',
    'orders.confirm': 'Confirmar',
    'orders.cancel': 'Cancelar',
    'orders.prepare': 'Preparar',
    'orders.ship': 'Enviar',
    'orders.deliver': 'Entregar',
    'orders.filter': 'Filtrar',
    'orders.search': 'Buscar pedidos...',
    'orders.export': 'Exportar',
    'orders.all': 'Todos',

    // Order Status
    'status.pending': 'Pendiente',
    'status.confirmed': 'Confirmado',
    'status.preparing': 'Preparando',
    'status.shipped': 'Enviado',
    'status.delivered': 'Entregado',
    'status.cancelled': 'Cancelado',

    // Order Source
    'source.whatsapp': 'WhatsApp',
    'source.manual': 'Manual',
    'source.recurring': 'Recurrente',

    // Products
    'products.title': 'Catalogo de Productos',
    'products.newProduct': 'Nuevo Producto',
    'products.name': 'Nombre',
    'products.sku': 'SKU',
    'products.price': 'Precio',
    'products.stock': 'Inventario',
    'products.category': 'Categoria',
    'products.status': 'Estado',
    'products.active': 'Activo',
    'products.inactive': 'Inactivo',
    'products.edit': 'Editar',
    'products.delete': 'Eliminar',
    'products.search': 'Buscar productos...',
    'products.lowStock': 'Stock Bajo',
    'products.outOfStock': 'Agotado',
    'products.unit': 'Unidad',
    'products.description': 'Descripcion',
    'products.image': 'Imagen',

    // Customers
    'customers.title': 'Gestion de Clientes',
    'customers.newCustomer': 'Nuevo Cliente',
    'customers.name': 'Nombre',
    'customers.business': 'Negocio',
    'customers.phone': 'Telefono',
    'customers.address': 'Direccion',
    'customers.zone': 'Zona',
    'customers.segment': 'Segmento',
    'customers.orders': 'Pedidos',
    'customers.spent': 'Total Gastado',
    'customers.lastOrder': 'Ultimo Pedido',
    'customers.search': 'Buscar clientes...',
    'customers.frequent': 'Frecuente',
    'customers.occasional': 'Ocasional',
    'customers.new': 'Nuevo',
    'customers.inactive': 'Inactivo',

    // WhatsApp
    'whatsapp.title': 'WhatsApp',
    'whatsapp.subtitle': 'Conversaciones con clientes',
    'whatsapp.selectConversation': 'Selecciona una conversacion',
    'whatsapp.typeMessage': 'Escribe un mensaje...',
    'whatsapp.send': 'Enviar',
    'whatsapp.activeChats': 'Chats Activos',
    'whatsapp.orderPending': 'Pedido Pendiente',
    'whatsapp.orderConfirmed': 'Pedido Confirmado',
    'whatsapp.typing': 'Escribiendo...',

    // Analytics
    'analytics.title': 'Analiticas y Reportes',
    'analytics.salesByDate': 'Ventas por Fecha',
    'analytics.salesByProduct': 'Ventas por Producto',
    'analytics.salesByCategory': 'Ventas por Categoria',
    'analytics.topProducts': 'Productos Mas Vendidos',
    'analytics.topCustomers': 'Clientes Frecuentes',
    'analytics.ordersByStatus': 'Pedidos por Estado',
    'analytics.ordersBySource': 'Pedidos por Origen',
    'analytics.dateRange': 'Rango de Fechas',
    'analytics.revenue': 'Ingresos',
    'analytics.orders': 'Pedidos',
    'analytics.quantity': 'Cantidad',

    // Settings
    'settings.title': 'Configuracion',
    'settings.general': 'General',
    'settings.whatsapp': 'WhatsApp',
    'settings.notifications': 'Notificaciones',
    'settings.businessHours': 'Horario de Atencion',
    'settings.messages': 'Mensajes',
    'settings.upsell': 'Ventas Cruzadas',
    'settings.save': 'Guardar Cambios',
    'settings.businessName': 'Nombre del Negocio',
    'settings.phone': 'Telefono WhatsApp',
    'settings.address': 'Direccion',
    'settings.timezone': 'Zona Horaria',
    'settings.currency': 'Moneda',
    'settings.welcomeMessage': 'Mensaje de Bienvenida',
    'settings.confirmationTemplate': 'Plantilla de Confirmacion',
    'settings.autoConfirm': 'Auto-confirmar Pedidos',
    'settings.enableNotifications': 'Habilitar Notificaciones',
    'settings.enableUpsell': 'Habilitar Sugerencias',

    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.view': 'Ver',
    'common.close': 'Cerrar',
    'common.confirm': 'Confirmar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.loading': 'Cargando...',
    'common.noData': 'No hay datos disponibles',
    'common.success': 'Operacion exitosa',
    'common.error': 'Ha ocurrido un error',
    'common.required': 'Campo requerido',
    'common.optional': 'Opcional',
    'common.yes': 'Si',
    'common.no': 'No',
    'common.all': 'Todos',
    'common.today': 'Hoy',
    'common.yesterday': 'Ayer',
    'common.thisWeek': 'Esta Semana',
    'common.thisMonth': 'Este Mes',
    'common.language': 'Idioma',
    'common.spanish': 'Espanol',
    'common.english': 'Ingles',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.orders': 'Orders',
    'nav.products': 'Products',
    'nav.customers': 'Customers',
    'nav.whatsapp': 'WhatsApp',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Auth
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.selectTenant': 'Select Company',
    'auth.welcome': 'Welcome',
    'auth.loginSubtitle': 'Sign in to your account to continue',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.totalSales': 'Total Sales',
    'dashboard.ordersToday': 'Orders Today',
    'dashboard.activeCustomers': 'Active Customers',
    'dashboard.pendingOrders': 'Pending Orders',
    'dashboard.avgOrderValue': 'Avg Order Value',
    'dashboard.recentOrders': 'Recent Orders',
    'dashboard.topProducts': 'Top Products',
    'dashboard.topCustomers': 'Top Customers',
    'dashboard.salesOverview': 'Sales Overview',
    'dashboard.last7Days': 'Last 7 days',

    // Orders
    'orders.title': 'Order Management',
    'orders.newOrder': 'New Order',
    'orders.orderNumber': 'Order Number',
    'orders.customer': 'Customer',
    'orders.date': 'Date',
    'orders.status': 'Status',
    'orders.total': 'Total',
    'orders.source': 'Source',
    'orders.actions': 'Actions',
    'orders.details': 'Details',
    'orders.items': 'Items',
    'orders.delivery': 'Delivery',
    'orders.notes': 'Notes',
    'orders.confirm': 'Confirm',
    'orders.cancel': 'Cancel',
    'orders.prepare': 'Prepare',
    'orders.ship': 'Ship',
    'orders.deliver': 'Deliver',
    'orders.filter': 'Filter',
    'orders.search': 'Search orders...',
    'orders.export': 'Export',
    'orders.all': 'All',

    // Order Status
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.preparing': 'Preparing',
    'status.shipped': 'Shipped',
    'status.delivered': 'Delivered',
    'status.cancelled': 'Cancelled',

    // Order Source
    'source.whatsapp': 'WhatsApp',
    'source.manual': 'Manual',
    'source.recurring': 'Recurring',

    // Products
    'products.title': 'Product Catalog',
    'products.newProduct': 'New Product',
    'products.name': 'Name',
    'products.sku': 'SKU',
    'products.price': 'Price',
    'products.stock': 'Stock',
    'products.category': 'Category',
    'products.status': 'Status',
    'products.active': 'Active',
    'products.inactive': 'Inactive',
    'products.edit': 'Edit',
    'products.delete': 'Delete',
    'products.search': 'Search products...',
    'products.lowStock': 'Low Stock',
    'products.outOfStock': 'Out of Stock',
    'products.unit': 'Unit',
    'products.description': 'Description',
    'products.image': 'Image',

    // Customers
    'customers.title': 'Customer Management',
    'customers.newCustomer': 'New Customer',
    'customers.name': 'Name',
    'customers.business': 'Business',
    'customers.phone': 'Phone',
    'customers.address': 'Address',
    'customers.zone': 'Zone',
    'customers.segment': 'Segment',
    'customers.orders': 'Orders',
    'customers.spent': 'Total Spent',
    'customers.lastOrder': 'Last Order',
    'customers.search': 'Search customers...',
    'customers.frequent': 'Frequent',
    'customers.occasional': 'Occasional',
    'customers.new': 'New',
    'customers.inactive': 'Inactive',

    // WhatsApp
    'whatsapp.title': 'WhatsApp',
    'whatsapp.subtitle': 'Customer Conversations',
    'whatsapp.selectConversation': 'Select a conversation',
    'whatsapp.typeMessage': 'Type a message...',
    'whatsapp.send': 'Send',
    'whatsapp.activeChats': 'Active Chats',
    'whatsapp.orderPending': 'Order Pending',
    'whatsapp.orderConfirmed': 'Order Confirmed',
    'whatsapp.typing': 'Typing...',

    // Analytics
    'analytics.title': 'Analytics & Reports',
    'analytics.salesByDate': 'Sales by Date',
    'analytics.salesByProduct': 'Sales by Product',
    'analytics.salesByCategory': 'Sales by Category',
    'analytics.topProducts': 'Top Products',
    'analytics.topCustomers': 'Top Customers',
    'analytics.ordersByStatus': 'Orders by Status',
    'analytics.ordersBySource': 'Orders by Source',
    'analytics.dateRange': 'Date Range',
    'analytics.revenue': 'Revenue',
    'analytics.orders': 'Orders',
    'analytics.quantity': 'Quantity',

    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.whatsapp': 'WhatsApp',
    'settings.notifications': 'Notifications',
    'settings.businessHours': 'Business Hours',
    'settings.messages': 'Messages',
    'settings.upsell': 'Cross-selling',
    'settings.save': 'Save Changes',
    'settings.businessName': 'Business Name',
    'settings.phone': 'WhatsApp Phone',
    'settings.address': 'Address',
    'settings.timezone': 'Timezone',
    'settings.currency': 'Currency',
    'settings.welcomeMessage': 'Welcome Message',
    'settings.confirmationTemplate': 'Confirmation Template',
    'settings.autoConfirm': 'Auto-confirm Orders',
    'settings.enableNotifications': 'Enable Notifications',
    'settings.enableUpsell': 'Enable Suggestions',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.view': 'View',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.success': 'Operation successful',
    'common.error': 'An error occurred',
    'common.required': 'Required field',
    'common.optional': 'Optional',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.all': 'All',
    'common.today': 'Today',
    'common.yesterday': 'Yesterday',
    'common.thisWeek': 'This Week',
    'common.thisMonth': 'This Month',
    'common.language': 'Language',
    'common.spanish': 'Spanish',
    'common.english': 'English',
  },
};

export const t = (key: TranslationKey, language: Language = 'es'): string => {
  return translations[language][key] || key;
};

export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date, language: Language = 'es'): string => {
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: Date, language: Language = 'es'): string => {
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatRelativeTime = (date: Date, language: Language = 'es'): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (language === 'es') {
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} dias`;
    return formatDate(date, language);
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(date, language);
  }
};
