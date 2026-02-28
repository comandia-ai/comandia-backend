# COMANDIA Backend

## WhatsApp B2B SaaS para Mayoristas / WhatsApp B2B SaaS for Wholesalers

Sistema multi-tenant que permite a mayoristas recibir pedidos de tenderos vía WhatsApp con procesamiento de lenguaje natural.

Multi-tenant system that allows wholesalers to receive orders from retailers via WhatsApp with natural language processing.

---

## Tech Stack

- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (public bucket for PDF catalogs)
- **WhatsApp**: Twilio API (Sandbox for dev, WhatsApp Business for production)
- **AI/NLP**: OpenAI GPT-4o-mini (via n8n OpenAI node)
- **Automation**: n8n Cloud (Starter plan)
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Zustand + Recharts

---

## Project Structure

```
/comandia
├── /src                          # React frontend (dashboard)
│   ├── /components               # Reusable UI components (shadcn/ui)
│   ├── /data                     # Mock data for demo
│   ├── /hooks                    # Zustand stores & custom hooks
│   ├── /lib                      # Utilities & i18n
│   ├── /pages                    # Page components
│   └── /types                    # TypeScript type definitions
├── /supabase
│   └── /migrations
│       ├── 001_initial_schema.sql   # Database schema (9 tables + RLS)
│       └── 002_insert_products.sql  # Product seed data
├── /n8n
│   └── /workflows
│       ├── hito4_workflow.json          # Active workflow (in .gitignore)
│       └── hito4_order_management_design.md  # Workflow design doc
├── /docs
│   ├── operations_guide.md       # Multi-client operations guide
│   ├── milestones.md             # Project milestones & budget
│   ├── tenant_creation_flow.md   # Tenant creation flow
│   └── README_BACKEND.md         # This file
└── /public                       # Static assets
```

---

## Database Schema

### Core Tables (9 tables)

| Table | Description | Key Fields |
|-------|-------------|------------|
| `tenants` | Mayoristas (Wholesalers) | name, whatsapp_number, is_active |
| `users` | Platform users | tenant_id, role, is_super_admin |
| `customers` | Tenderos (Retailers) | tenant_id, phone, customer_type |
| `product_categories` | Categories per tenant | tenant_id, name |
| `products` | Product catalog per tenant | tenant_id, sku, price, stock |
| `orders` | Orders from customers | tenant_id, status, payment_method |
| `order_items` | Individual items in orders | order_id, product_id, quantity |
| `whatsapp_conversations` | Chat sessions + state | tenant_id, metadata (JSONB) |
| `whatsapp_messages` | Individual messages | conversation_id, direction, content |

### Multi-Tenant Architecture

- All tables include `tenant_id` with Row Level Security (RLS) policies
- 19 RLS policies ensuring complete data isolation
- Helper functions: `get_user_tenant_id()`, `is_super_admin()`
- Automatic `updated_at` triggers on 7 tables
- Customer stats auto-update trigger on order insert/update

---

## WhatsApp Order Flow

```
1. Customer sends WhatsApp message
2. Twilio receives → forwards to n8n webhook
3. n8n: Get Conversation Context (Supabase: customer, conversation, products)
4. n8n: Build Prompt (system prompt with business info + product catalog)
5. n8n: OpenAI GPT-4o-mini (conversational AI)
6. n8n: Parse Response (extract JSON action)
7. n8n: Process Action (create order in Supabase if needed)
8. n8n: Send WhatsApp Reply (via Twilio API, with optional PDF catalog)
9. n8n: Save Message (save inbound + outbound messages to Supabase)
```

### Conversation States

```
idle → ordering → collecting_address → collecting_phone → collecting_payment → confirming → idle
```

### AI Actions

| Action | Description |
|--------|-------------|
| `none` | Normal response, no database operation |
| `create_order` | Create order + order_items in Supabase |
| `confirm_order` | Confirm existing order, update status |
| `send_catalog` | Send PDF catalog via WhatsApp (MediaUrl) |

---

## Getting Started

### 1. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run migration: `supabase/migrations/001_initial_schema.sql`
3. Run seed data: `supabase/migrations/002_insert_products.sql`
4. Add `metadata JSONB DEFAULT '{}'` column to `whatsapp_conversations` table

### 2. Set Up n8n

1. Create account at [n8n.io](https://n8n.io)
2. Import workflow from `n8n/workflows/hito4_workflow.json`
3. Configure credentials (Supabase service_role key, Twilio SID/Auth, OpenAI API key)
4. Activate and **Publish** the workflow

### 3. Set Up Twilio

1. Create account at [twilio.com](https://www.twilio.com)
2. Enable WhatsApp Sandbox
3. Set webhook URL to n8n webhook URL
4. Test with "join [code]" from WhatsApp

### 4. Run Frontend (Development)

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Environment Variables

```env
# Supabase
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx          # Backend/n8n only!

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# OpenAI (configured in n8n credential store)
OPENAI_API_KEY=xxx
```

---

## API Endpoints (Supabase Auto-Generated)

```
Base URL: https://[project-ref].supabase.co

# REST API (RLS automatically filters by tenant_id)
GET    /rest/v1/products?tenant_id=eq.[UUID]
POST   /rest/v1/orders
PATCH  /rest/v1/orders?id=eq.[UUID]
DELETE /rest/v1/products?id=eq.[UUID]
```

---

## Milestones / Hitos

- [x] **Hito 1** ($600): Multi-tenant architecture, database schema, RLS policies
- [x] **Hito 2** ($500): Order data model, CRUD operations, order flow
- [x] **Hito 3** ($350): WhatsApp integration, Twilio, message handling
- [x] **Hito 4** ($300): Dashboard with KPIs, charts, analytics, filters
- [x] **Hito 5** ($150): First client onboarding (Mango Biche), PDF catalog, payment info
- [x] **Hito 6** ($100): Documentation, QA, operations guide

**Total: USD $2,000**

---

## Documentation

- [Operations Guide](operations_guide.md) - How to add tenants, configure WhatsApp, backups, deactivation
- [Tenant Creation Flow](tenant_creation_flow.md) - Detailed tenant creation process
- [Milestones](milestones.md) - Project scope and budget breakdown

---

## Contact

- Project: COMANDIA
- Client: WritingXpert (Davide)
- Developer: Chadwick

---

## License

Proprietary - All rights reserved
