# COMANDIA Backend

## WhatsApp B2B SaaS para Mayoristas / WhatsApp B2B SaaS for Wholesalers

Sistema multi-tenant que permite a mayoristas recibir pedidos de tenderos vía WhatsApp con procesamiento de lenguaje natural.

Multi-tenant system that allows wholesalers to receive orders from retailers via WhatsApp with natural language processing.

---

## Tech Stack

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **WhatsApp**: 360dialog / Meta Cloud API
- **Automation**: n8n (webhooks, AI processing)

---

## Project Structure

```
/comandia-backend
├── /supabase
│   ├── /migrations
│   │   └── 001_initial_schema.sql    # Database schema
│   └── /seed
│       └── seed_data.sql             # Demo data
├── /docs
│   ├── tenant_creation_flow.md       # How to create tenants
│   └── database_schema.md            # Schema documentation
├── /n8n
│   └── /workflows                    # n8n workflow exports
└── README.md
```

---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `tenants` | Mayoristas (Wholesalers) |
| `users` | Platform users (Super Admin + Tenant users) |
| `customers` | Tenderos (Retailers) |
| `product_categories` | Product categories per tenant |
| `products` | Product catalog per tenant |
| `orders` | Orders from customers |
| `order_items` | Individual items in orders |
| `whatsapp_conversations` | WhatsApp chat sessions |
| `whatsapp_messages` | Individual messages |

### Multi-Tenant Architecture

All tables include `tenant_id` with Row Level Security (RLS) policies ensuring complete data isolation.

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/COMANDIA/comandia-backend.git
cd comandia-backend
```

### 2. Set Up Supabase

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`

### 3. Create Super Admin

```sql
-- First create your auth user via Supabase Dashboard or API
-- Then insert into users table:

INSERT INTO users (
    id,              -- Use the auth.users.id from Supabase Auth
    tenant_id,       -- NULL for super admin
    email,
    full_name,
    role,
    is_super_admin
) VALUES (
    'your-auth-user-id',
    NULL,
    'admin@comandia.com',
    'Super Admin',
    'super_admin',
    true
);
```

---

## API Endpoints (Supabase)

Supabase provides auto-generated REST and GraphQL APIs:

```
Base URL: https://[project-ref].supabase.co

# REST API
GET    /rest/v1/products
POST   /rest/v1/orders
PATCH  /rest/v1/orders?id=eq.xxx
DELETE /rest/v1/products?id=eq.xxx

# RLS automatically filters by tenant_id
```

---

## Environment Variables

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx  # Backend only!

WHATSAPP_PROVIDER=360dialog
WHATSAPP_API_KEY=xxx
WHATSAPP_WEBHOOK_SECRET=xxx
```

---

## Milestones / Hitos

- [x] **Hito 1**: Database schema, multi-tenant setup, documentation
- [ ] **Hito 2**: n8n integration, WhatsApp webhooks
- [ ] **Hito 3**: AI order processing, NLP
- [ ] **Hito 4**: Dashboard frontend
- [ ] **Hito 5**: Analytics & reporting
- [ ] **Hito 6**: Testing & deployment

---

## Contact

- Project: COMANDIA
- Client: WritingXpert
- Developer: Chadwick

---

## License

Proprietary - All rights reserved
