# Hito 4: Order Management System - Workflow Design

## Overview
WhatsApp message → AI extracts products/quantities → Create order in Supabase → Send confirmation

## Workflow Flow

```
[WhatsApp Webhook]
    ↓
[Extract Message] (existing)
    ↓
[Find Customer] (existing)
    ↓
[AI Classify Intent] (existing)
    ↓
[Route by Intent]
    ├── intent: "order" → [AI Extract Products]
    │                          ↓
    │                     [Lookup Products in DB]
    │                          ↓
    │                     [Create Order]
    │                          ↓
    │                     [Create Order Items]
    │                          ↓
    │                     [Generate Order Confirmation]
    │                          ↓
    │                     [Save Message]
    │
    ├── intent: "repeat_order" → [Get Last Order]
    │                                ↓
    │                           [Create Repeat Order]
    │                                ↓
    │                           [Generate Confirmation]
    │                                ↓
    │                           [Save Message]
    │
    └── intent: "greeting" → [Generate Greeting] → [Save Message]
```

## New Nodes Required

### 1. AI Extract Products (Code Node)
- Input: customer message text
- AI Prompt: Extract product names and quantities from message
- Output: JSON array of {product_name, quantity}

### 2. Lookup Products in DB (Code Node)
- Input: extracted product names
- Query products table by name (fuzzy match)
- Output: matched products with prices

### 3. Create Order (Code Node)
- Generate order_number using tenant prefix + date + sequence
- Insert into orders table
- Output: order_id

### 4. Create Order Items (Code Node)
- Insert each product as order_item
- Calculate subtotals
- Update order total

### 5. Generate Order Confirmation (Code Node)
- Create WhatsApp message with order summary
- Include: products, quantities, prices, total

## AI Prompt: Extract Products

```
You are an order assistant for a Colombian wholesaler.
Extract products and quantities from the customer message.

Available products will be provided.

Customer message: {{ $json.text }}

Return JSON format:
{
  "products": [
    {"name": "product name", "quantity": 5, "unit": "cajas"},
    {"name": "product name", "quantity": 3, "unit": "paquetes"}
  ],
  "delivery_notes": "any delivery instructions",
  "is_complete": true
}

If the message is unclear, set is_complete to false and include a "clarification" field.
```

## AI Prompt: Order Confirmation

```
Generate a WhatsApp order confirmation in Spanish for:

Customer: {{ customer_name }}
Order #: {{ order_number }}
Products:
{{ product_list }}
Total: {{ total }} COP

Be friendly and professional. Include delivery instructions if applicable.
```

## Supabase Queries

### Find Products (fuzzy match)
```sql
SELECT id, name, sku, price, unit, stock
FROM products
WHERE tenant_id = 'TENANT_ID'
AND is_active = true
AND (
  name ILIKE '%search_term%'
  OR tags @> ARRAY['search_term']
)
```

### Create Order
```sql
INSERT INTO orders (tenant_id, customer_id, order_number, status, subtotal, total, source)
VALUES ('TENANT_ID', 'CUSTOMER_ID', 'ORDER_NUMBER', 'pending', SUBTOTAL, TOTAL, 'whatsapp')
RETURNING id, order_number
```

### Create Order Items
```sql
INSERT INTO order_items (order_id, product_id, tenant_id, product_name, product_sku, unit_price, quantity, subtotal)
VALUES ('ORDER_ID', 'PRODUCT_ID', 'TENANT_ID', 'NAME', 'SKU', PRICE, QTY, SUBTOTAL)
```

### Get Last Order (for "Lo de Siempre")
```sql
SELECT o.*, oi.product_name, oi.quantity, oi.unit_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.customer_id = 'CUSTOMER_ID'
AND o.tenant_id = 'TENANT_ID'
ORDER BY o.created_at DESC
LIMIT 1
```

## "Lo de Siempre" Flow
1. Customer sends "lo de siempre" or similar
2. AI classifies as "repeat_order"
3. System fetches last order for this customer
4. Creates new order with same items
5. Sends confirmation with order details

## Error Handling
- Product not found → Ask customer to clarify
- Insufficient stock → Notify customer
- No previous order (for repeat) → Ask what they want to order
- Unclear message → Ask for clarification
