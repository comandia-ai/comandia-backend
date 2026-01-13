-- COMANDIA - Initial Database Schema
-- Multi-tenant WhatsApp B2B SaaS for Wholesalers
-- Created: January 2026

-- ============================================
-- 1. TENANTS (Mayoristas/Wholesalers)
-- ============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    whatsapp_number VARCHAR(20) NOT NULL,
    whatsapp_provider VARCHAR(50) DEFAULT '360dialog', -- '360dialog' or 'cloud_api'
    whatsapp_api_key TEXT,
    logo_url TEXT,
    business_type VARCHAR(100), -- 'distribuidor', 'mayorista', 'fabricante'
    country VARCHAR(50) DEFAULT 'Colombia',
    city VARCHAR(100),
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    currency VARCHAR(10) DEFAULT 'COP',
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USERS (Platform Users - Super Admin & Tenant Users)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- 'super_admin', 'admin', 'operator', 'viewer'
    is_super_admin BOOLEAN DEFAULT false,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. CUSTOMERS (Tenderos/Retailers)
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    whatsapp_id VARCHAR(50), -- WhatsApp user ID from API
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    zone VARCHAR(100), -- Delivery zone
    neighborhood VARCHAR(100),
    notes TEXT,
    customer_type VARCHAR(50) DEFAULT 'regular', -- 'new', 'regular', 'vip', 'inactive'
    credit_limit DECIMAL(15, 2) DEFAULT 0,
    current_balance DECIMAL(15, 2) DEFAULT 0,
    last_order_date TIMESTAMPTZ,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0,
    preferences JSONB DEFAULT '{}', -- Stores "lo de siempre" preferences
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, phone)
);

-- Indexes for customers
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_whatsapp_id ON customers(whatsapp_id);

-- ============================================
-- 4. PRODUCT CATEGORIES
-- ============================================
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_product_categories_tenant_id ON product_categories(tenant_id);

-- ============================================
-- 5. PRODUCTS
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT 'unidad', -- 'unidad', 'caja', 'paquete', 'kg', 'litro'
    units_per_package INTEGER DEFAULT 1,
    price DECIMAL(15, 2) NOT NULL,
    cost DECIMAL(15, 2),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0, -- Alert threshold
    max_stock INTEGER,
    image_url TEXT,
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[], -- Array of tags for search
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, sku)
);

-- Indexes for products
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);

-- ============================================
-- 6. ORDERS
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    order_number VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- Status flow: pending → confirmed → preparing → shipped → delivered
    -- Can be: cancelled at any point

    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(15, 2) DEFAULT 0,
    tax DECIMAL(15, 2) DEFAULT 0,
    shipping_cost DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL DEFAULT 0,

    source VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'manual', 'web'
    payment_method VARCHAR(50), -- 'cash', 'transfer', 'credit'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'paid'

    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_zone VARCHAR(100),
    delivery_date DATE,
    delivery_time_slot VARCHAR(50), -- 'morning', 'afternoon', 'evening'
    delivered_at TIMESTAMPTZ,

    notes TEXT,
    internal_notes TEXT,

    -- WhatsApp conversation reference
    whatsapp_conversation_id VARCHAR(100),

    created_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, order_number)
);

-- Indexes for orders
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- ============================================
-- 7. ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    product_name VARCHAR(255) NOT NULL, -- Snapshot at order time
    product_sku VARCHAR(100) NOT NULL,  -- Snapshot at order time
    unit_price DECIMAL(15, 2) NOT NULL, -- Price at order time
    quantity INTEGER NOT NULL DEFAULT 1,
    discount DECIMAL(15, 2) DEFAULT 0,
    subtotal DECIMAL(15, 2) NOT NULL,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_tenant_id ON order_items(tenant_id);

-- ============================================
-- 8. WHATSAPP CONVERSATIONS
-- ============================================
CREATE TABLE whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    whatsapp_id VARCHAR(50) NOT NULL, -- Customer's WhatsApp ID
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'pending_response'
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    unread_count INTEGER DEFAULT 0,
    assigned_to UUID REFERENCES users(id),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_conversations_tenant_id ON whatsapp_conversations(tenant_id);
CREATE INDEX idx_whatsapp_conversations_customer_id ON whatsapp_conversations(customer_id);
CREATE INDEX idx_whatsapp_conversations_whatsapp_id ON whatsapp_conversations(whatsapp_id);

-- ============================================
-- 9. WHATSAPP MESSAGES
-- ============================================
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id) ON DELETE CASCADE,

    message_id VARCHAR(100), -- WhatsApp API message ID
    direction VARCHAR(10) NOT NULL, -- 'inbound', 'outbound'
    message_type VARCHAR(50) NOT NULL, -- 'text', 'image', 'audio', 'document', 'template'

    content TEXT,
    media_url TEXT,
    media_type VARCHAR(50),

    -- AI Processing
    ai_processed BOOLEAN DEFAULT false,
    ai_intent VARCHAR(100), -- 'order', 'question', 'complaint', 'greeting'
    ai_extracted_data JSONB,

    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    error_message TEXT,

    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_tenant_id ON whatsapp_messages(tenant_id);
CREATE INDEX idx_whatsapp_messages_conversation_id ON whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_sent_at ON whatsapp_messages(sent_at);

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id
        FROM users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT is_super_admin
        FROM users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TENANTS policies
CREATE POLICY "Super admins can do everything with tenants"
    ON tenants FOR ALL
    USING (is_super_admin());

CREATE POLICY "Users can view their own tenant"
    ON tenants FOR SELECT
    USING (id = get_user_tenant_id());

-- USERS policies
CREATE POLICY "Super admins can do everything with users"
    ON users FOR ALL
    USING (is_super_admin());

CREATE POLICY "Users can view users in their tenant"
    ON users FOR SELECT
    USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Admins can manage users in their tenant"
    ON users FOR ALL
    USING (
        tenant_id = get_user_tenant_id()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role IN ('admin')
            AND tenant_id = get_user_tenant_id()
        )
    );

-- CUSTOMERS policies
CREATE POLICY "Users can view customers in their tenant"
    ON customers FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can manage customers in their tenant"
    ON customers FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- PRODUCT_CATEGORIES policies
CREATE POLICY "Users can view categories in their tenant"
    ON product_categories FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Admins can manage categories in their tenant"
    ON product_categories FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- PRODUCTS policies
CREATE POLICY "Users can view products in their tenant"
    ON products FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Admins can manage products in their tenant"
    ON products FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- ORDERS policies
CREATE POLICY "Users can view orders in their tenant"
    ON orders FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can manage orders in their tenant"
    ON orders FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- ORDER_ITEMS policies
CREATE POLICY "Users can view order items in their tenant"
    ON order_items FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can manage order items in their tenant"
    ON order_items FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- WHATSAPP_CONVERSATIONS policies
CREATE POLICY "Users can view conversations in their tenant"
    ON whatsapp_conversations FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can manage conversations in their tenant"
    ON whatsapp_conversations FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- WHATSAPP_MESSAGES policies
CREATE POLICY "Users can view messages in their tenant"
    ON whatsapp_messages FOR SELECT
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can manage messages in their tenant"
    ON whatsapp_messages FOR ALL
    USING (tenant_id = get_user_tenant_id() OR is_super_admin());

-- ============================================
-- 11. TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_conversations_updated_at
    BEFORE UPDATE ON whatsapp_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. HELPER FUNCTIONS
-- ============================================

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number(p_tenant_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_count INTEGER;
    v_prefix VARCHAR(10);
BEGIN
    -- Get tenant prefix (first 3 chars of name)
    SELECT UPPER(LEFT(name, 3)) INTO v_prefix FROM tenants WHERE id = p_tenant_id;

    -- Count orders for this tenant today
    SELECT COUNT(*) + 1 INTO v_count
    FROM orders
    WHERE tenant_id = p_tenant_id
    AND DATE(created_at) = CURRENT_DATE;

    RETURN v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(v_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Update customer stats after order
CREATE OR REPLACE FUNCTION update_customer_order_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'delivered' AND OLD.status != 'delivered') THEN
        UPDATE customers
        SET
            total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total,
            last_order_date = NEW.created_at
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_stats
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_customer_order_stats();

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
