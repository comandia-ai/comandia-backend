# Hito 4: Order Management System - Workflow Design (v2)

## Overview
Conversational AI-powered order management via WhatsApp.
GPT-4 handles natural conversation, product lookup, order creation, and delivery info collection.

## Conversation Flow Example

```
Customer: "Hola, quiero hacer un pedido"
AI: "Hola! Con gusto te ayudo. Tenemos Granizados Dulces, Acidos, Especiales y Adicionales. Que te gustaria pedir?"

Customer: "Quiero 2 maracuya de 16oz y 1 lulada de 12oz"
AI: "Perfecto! Tu pedido:
     - 2x Granizado de Maracuya 16oz ($10,500 c/u) = $21,000
     - 1x Lulada 12oz ($7,500 c/u) = $7,500
     Subtotal: $28,500
     Deseas agregar algo mas o procedemos con el envio?"

Customer: "No, eso es todo"
AI: "Listo! A que direccion hacemos el envio?"

Customer: "Calle 45 #23-10, Apto 301"
AI: "Numero de contacto para el repartidor?"

Customer: "3001234567"
AI: "Metodo de pago? (Efectivo / Transferencia / Tarjeta)"

Customer: "Efectivo"
AI: "Pedido confirmado!
     Pedido #MB-20260220-001
     - 2x Granizado de Maracuya 16oz = $21,000
     - 1x Lulada 12oz = $7,500
     Total: $28,500
     Envio: Calle 45 #23-10, Apto 301
     Contacto: 3001234567
     Pago: Efectivo
     Gracias por tu compra!"
```

## Workflow Architecture

```
[WhatsApp Webhook]
    |
[Extract Message]
    |
[Find Customer] (existing)
    |
[Customer Exists?] (existing)
    |--- No ---> [Create Customer] (existing)
    |--- Yes --->|
    |            |
    |<-----------|
    |
[Get Conversation Context]  <-- NEW: get recent messages + active order draft
    |
[GPT-4 Conversational AI]  <-- NEW: single AI brain
    |
[Process AI Action]  <-- NEW: parse AI response for actions
    |
[Route by Action]
    |--- "search_products"  --> [Search Products DB] --> [Send Reply]
    |--- "create_order"     --> [Create Order + Items] --> [Send Reply]
    |--- "collect_delivery" --> [Send Reply] (ask for address/phone/payment)
    |--- "confirm_order"    --> [Finalize Order] --> [Send Reply]
    |--- "general"          --> [Send Reply] (greeting, info, etc.)
    |
[Send WhatsApp Reply via Twilio]  <-- NEW: send response back
    |
[Save Messages] (save inbound + outbound)
```

## Conversation State Management

Use `whatsapp_conversations.metadata` to track order state:

```json
{
  "state": "idle|ordering|collecting_address|collecting_phone|collecting_payment|confirming",
  "draft_order": {
    "items": [
      {"product_id": "uuid", "name": "Maracuya 16oz", "quantity": 2, "price": 10500}
    ],
    "subtotal": 21000,
    "delivery_address": null,
    "contact_phone": null,
    "payment_method": null
  }
}
```

States:
- `idle` - No active order, waiting for customer
- `ordering` - Customer is selecting products
- `collecting_address` - Waiting for delivery address
- `collecting_phone` - Waiting for contact phone
- `collecting_payment` - Waiting for payment method
- `confirming` - Order ready, waiting for confirmation

## New Nodes Required

### 1. Get Conversation Context (Code Node)
- Find or create active conversation for this customer
- Get last 10 messages for context
- Get current conversation state/metadata
- Get draft order if exists

### 2. GPT-4 Conversational AI (OpenAI Node)
System prompt with:
- Business info (Mango Biche, Colombian granizado)
- Full product catalog (all 112 products with prices)
- Current conversation state
- Instructions for each state transition

User message: recent conversation + new message

Output: JSON with `response_text` + `action` + `data`

### 3. Process AI Action (Code Node)
Parse AI response:
```json
{
  "response_text": "message to send to customer",
  "action": "search_products|create_order|collect_delivery|confirm_order|general",
  "data": {
    "products": [...],
    "delivery_address": "...",
    "contact_phone": "...",
    "payment_method": "..."
  },
  "new_state": "ordering|collecting_address|etc."
}
```

### 4. Search Products DB (Code Node)
- Fuzzy search products by name/tags
- Return matched products with prices
- Handle "no match found" cases

### 5. Create Order (Code Node)
- Generate order_number: MB-YYYYMMDD-XXX
- Insert into orders table
- Insert items into order_items table
- Calculate totals

### 6. Send WhatsApp Reply via Twilio (HTTP Request Node)
- Twilio API: POST to Messages endpoint
- Send AI response text back to customer
- URL: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

### 7. Save Messages (Code Node)
- Save inbound message (customer)
- Save outbound message (AI response)
- Update conversation metadata with new state

## GPT-4 System Prompt

```
You are the AI order assistant for MANGO BICHE, a Colombian granizado (frozen drink) business.
You communicate in Spanish, are friendly and professional.

PRODUCT CATALOG:
[Full product list will be injected here from DB]

CONVERSATION STATE: {{ state }}
DRAFT ORDER: {{ draft_order }}

RULES:
1. When customer wants to order, help them choose products from the catalog
2. Match product names flexibly (e.g., "maracuya" matches "Granizado de Maracuya")
3. Always confirm products and prices before proceeding
4. After products confirmed, collect delivery info in this order:
   a. Delivery address
   b. Contact phone number
   c. Payment method (Efectivo/Transferencia/Tarjeta)
5. After all info collected, show final order summary and confirm
6. For "lo de siempre" or repeat orders, look up last order
7. If product not found, suggest similar products
8. If message unclear, ask for clarification politely

RESPOND WITH JSON ONLY:
{
  "response_text": "your message to the customer in Spanish",
  "action": "search_products|create_order|collect_delivery|confirm_order|general",
  "data": {},
  "new_state": "idle|ordering|collecting_address|collecting_phone|collecting_payment|confirming"
}
```

## Supabase Queries

### Find Products (fuzzy match)
```sql
SELECT id, name, sku, price, unit, tags
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
INSERT INTO orders (tenant_id, customer_id, order_number, status, subtotal, total, source, delivery_address, delivery_phone, payment_method)
VALUES ('TENANT_ID', 'CUSTOMER_ID', 'ORDER_NUMBER', 'pending', SUBTOTAL, TOTAL, 'whatsapp', 'ADDRESS', 'PHONE', 'METHOD')
RETURNING id, order_number
```

### Create Order Items
```sql
INSERT INTO order_items (order_id, product_id, tenant_id, product_name, product_sku, unit_price, quantity, subtotal)
VALUES ('ORDER_ID', 'PRODUCT_ID', 'TENANT_ID', 'NAME', 'SKU', PRICE, QTY, SUBTOTAL)
```

### Get Last Order (for repeat orders)
```sql
SELECT o.*, oi.product_name, oi.quantity, oi.unit_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.customer_id = 'CUSTOMER_ID'
AND o.tenant_id = 'TENANT_ID'
ORDER BY o.created_at DESC
LIMIT 1
```

### Update Conversation State
```sql
UPDATE whatsapp_conversations
SET metadata = '{"state": "ordering", "draft_order": {...}}'
WHERE id = 'CONVERSATION_ID'
```

## DB Schema Changes Needed

### Add columns to orders table:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
```

### Add metadata column to whatsapp_conversations:
```sql
ALTER TABLE whatsapp_conversations ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
```

## Send Reply via Twilio

```
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

Body (form-urlencoded):
  From=whatsapp:+14155238886
  To=whatsapp:+{customer_phone}
  Body={ai_response_text}

Auth: AccountSid:AuthToken
```

## Implementation Order

1. DB schema changes (add columns)
2. Get Conversation Context node
3. GPT-4 Conversational AI node
4. Process AI Action node
5. Search Products DB node
6. Create Order node
7. Send WhatsApp Reply node
8. Save Messages node
9. Connect all nodes
10. Test complete flow
