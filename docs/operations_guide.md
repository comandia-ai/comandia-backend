# COMANDIA - Guía de Operaciones Multi-Cliente
# Operations Guide for Multi-Client Management

---

## Tabla de Contenido / Table of Contents

1. [Cómo Agregar un Nuevo Tenant](#1-cómo-agregar-un-nuevo-tenant)
2. [Cómo Configurar WhatsApp](#2-cómo-configurar-whatsapp)
3. [Procedimientos de Respaldo](#3-procedimientos-de-respaldo)
4. [Cómo Desactivar Clientes](#4-cómo-desactivar-clientes)
5. [Monitoreo y Mantenimiento](#5-monitoreo-y-mantenimiento)

---

## 1. Cómo Agregar un Nuevo Tenant

### Requisitos Previos / Prerequisites

Antes de crear un tenant, necesitas:
- Acceso a **Supabase Dashboard** (SQL Editor)
- Acceso a **n8n** (para configurar el workflow de WhatsApp)
- Los datos del nuevo negocio:
  - Nombre del negocio
  - Número de WhatsApp
  - Ciudad / País
  - Email del administrador
  - Catálogo de productos (PDF o lista)

### Paso 1: Crear el Tenant en la Base de Datos

```sql
-- 1. Insertar el nuevo tenant
INSERT INTO tenants (
    name,
    business_name,
    whatsapp_number,
    country,
    city,
    timezone,
    currency,
    is_active
) VALUES (
    'Nombre del Negocio',           -- Nombre corto
    'Razón Social del Negocio',     -- Razón social completa
    '+573XXXXXXXXX',                -- Número WhatsApp con código de país
    'Colombia',
    'Ciudad',
    'America/Bogota',
    'COP',
    true
) RETURNING id;

-- GUARDAR el id retornado → este es el tenant_id
-- SAVE the returned id → this is the tenant_id
```

### Paso 2: Crear el Usuario Administrador

```sql
-- 2. Crear usuario admin del tenant
INSERT INTO users (
    tenant_id,
    email,
    full_name,
    phone,
    role,
    is_super_admin
) VALUES (
    'TENANT_ID_DEL_PASO_1',         -- UUID del paso anterior
    'admin@negocio.com',
    'Nombre del Administrador',
    '+573XXXXXXXXX',
    'admin',
    false
);
```

### Paso 3: Cargar el Catálogo de Productos

```sql
-- 3. Crear categorías de productos (opcional)
INSERT INTO product_categories (tenant_id, name, description)
VALUES
    ('TENANT_ID', 'Categoría 1', 'Descripción'),
    ('TENANT_ID', 'Categoría 2', 'Descripción');

-- 4. Insertar productos
INSERT INTO products (tenant_id, sku, name, description, unit, price, stock, is_active)
VALUES
    ('TENANT_ID', 'PROD-001', 'Producto 1', 'Descripción', 'unidad', 15000, 100, true),
    ('TENANT_ID', 'PROD-002', 'Producto 2', 'Descripción', 'caja', 25000, 50, true);

-- Verificar productos cargados
SELECT id, sku, name, price, stock FROM products
WHERE tenant_id = 'TENANT_ID' AND is_active = true
ORDER BY name;
```

### Paso 4: Verificar el Tenant

```sql
-- Verificar que todo esté correcto
SELECT t.id, t.name, t.whatsapp_number, t.is_active,
       (SELECT COUNT(*) FROM users WHERE tenant_id = t.id) as total_users,
       (SELECT COUNT(*) FROM products WHERE tenant_id = t.id) as total_products
FROM tenants t
WHERE t.id = 'TENANT_ID';
```

### Ejemplo Real: Mango Biche (Primer Cliente)

```
Tenant ID:    ada3b48e-ddf4-4984-b039-e99caa19cfa3
Nombre:       Mango Biche
Ciudad:       Pasto, Colombia
WhatsApp:     +573146862313
Productos:    Granizados y otros
```

---

## 2. Cómo Configurar WhatsApp

### Arquitectura Actual

```
Cliente (WhatsApp) → Twilio Sandbox → n8n Webhook → AI (GPT-4o-mini) → Twilio → Cliente
```

### Opción A: Twilio Sandbox (Desarrollo/Pruebas)

**Limitaciones:**
- Máximo 72 horas de sesión
- El cliente debe enviar código de unión ("join XXXX")
- Solo 1 número de sandbox

**Configuración:**

1. **Cuenta Twilio:**
   - Crear cuenta en [twilio.com](https://www.twilio.com)
   - Obtener Account SID y Auth Token desde la consola
   - Ir a Messaging > Try it out > Send a WhatsApp message
   - Anotar el número sandbox y código de unión

2. **Configurar Webhook en Twilio:**
   - En Twilio Console > Messaging > Settings > WhatsApp Sandbox
   - En "When a message comes in": poner la URL del webhook de n8n
   - Formato: `https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/WEBHOOK_ID`
   - Método: POST

3. **Configurar n8n Workflow:**
   - En el nodo "Webhook": copiar la URL de producción
   - En el nodo "Find Customer": actualizar `tenantId` con el UUID del tenant
   - En el nodo "Send WhatsApp Reply": actualizar:
     - `twilioSid`: Account SID de Twilio
     - `twilioAuth`: Auth Token de Twilio
     - `twilioFrom`: `whatsapp:+14155238886` (o el número sandbox)
   - En el nodo "Build Prompt": actualizar el prompt del sistema con:
     - Nombre del negocio
     - Catálogo de productos
     - Información de pago
     - Números de contacto

4. **Activar y Publicar:**
   - IMPORTANTE: En n8n, después de guardar, hacer clic en **Publish** (publicar)
   - El workflow debe estar activo (toggle ON)

### Opción B: Twilio WhatsApp Business (Producción)

**Para producción se requiere:**
1. Registro de WhatsApp Business API a través de Twilio
2. Número de teléfono dedicado
3. Verificación del negocio por Meta
4. Plantillas de mensaje aprobadas

**Pasos:**
1. En Twilio Console > Messaging > Senders > WhatsApp Senders
2. Seguir el proceso de registro de negocio
3. Configurar el webhook igual que en Sandbox
4. Actualizar `twilioFrom` con el número de producción

### Estructura del Workflow n8n

```
1. Webhook (recibe mensaje)
   ↓
2. Get Conversation Context (consulta Supabase: cliente, conversación, productos)
   ↓
3. Build Prompt (construye prompt del sistema con contexto)
   ↓
4. Conversational AI - OpenAI (GPT-4o-mini procesa el mensaje)
   ↓
5. Parse Response (extrae JSON de la respuesta AI)
   ↓
6. Process Action (crea pedidos en Supabase si es necesario)
   ↓
7. Send WhatsApp Reply (envía respuesta vía Twilio)
   ↓
8. Save Message (guarda mensajes en Supabase)
```

### Personalización del Bot para Nuevo Tenant

En el nodo **Build Prompt**, modificar estas secciones:

```javascript
// 1. Nombre del negocio
const systemPrompt = `Eres el asistente de pedidos de [NOMBRE_NEGOCIO]...

// 2. Información de pago
INFORMACION DE PAGO PARA TRANSFERENCIAS:
- Nequi: [NUMERO]
- Daviplata: [NUMERO]
- Bancolombia: [NUMERO_CUENTA]
- Titular: [NOMBRE_TITULAR]

// 3. Números de contacto
NUMEROS DE DOMICILIOS: [NUMERO1] - [NUMERO2]

// 4. Redes sociales
INSTAGRAM: @[CUENTA]
`;
```

### Envío de Catálogo PDF

Para habilitar el envío de catálogo PDF por WhatsApp:

1. Comprimir el PDF a menos de 16MB (límite de Twilio)
2. Subir a Supabase Storage (bucket público)
3. Actualizar la URL en el nodo **Send WhatsApp Reply**:
   ```javascript
   const catalogUrl = 'https://[SUPABASE_URL]/storage/v1/object/public/public-assets/[NOMBRE_ARCHIVO].pdf';
   ```

---

## 3. Procedimientos de Respaldo

### 3.1 Respaldo de Base de Datos (Supabase)

#### Respaldo Automático (Incluido en Supabase)
- Supabase Pro plan incluye respaldos automáticos diarios
- Retención: 7 días (Pro), 30 días (Team)
- Acceso: Supabase Dashboard > Settings > Database > Backups

#### Respaldo Manual via SQL

```sql
-- Exportar todos los tenants
SELECT * FROM tenants ORDER BY created_at;

-- Exportar productos de un tenant específico
SELECT * FROM products WHERE tenant_id = 'TENANT_ID' ORDER BY name;

-- Exportar clientes de un tenant
SELECT * FROM customers WHERE tenant_id = 'TENANT_ID' ORDER BY name;

-- Exportar pedidos de un tenant (últimos 30 días)
SELECT o.*, oi.product_name, oi.quantity, oi.unit_price, oi.subtotal
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.tenant_id = 'TENANT_ID'
AND o.created_at >= NOW() - INTERVAL '30 days'
ORDER BY o.created_at DESC;

-- Exportar conversaciones y mensajes
SELECT c.phone, m.direction, m.content, m.created_at
FROM whatsapp_conversations c
JOIN whatsapp_messages m ON m.conversation_id = c.id
WHERE c.tenant_id = 'TENANT_ID'
ORDER BY m.created_at DESC;
```

#### Respaldo Completo via pg_dump

```bash
# Requiere acceso directo a PostgreSQL
# Obtener connection string desde: Supabase > Settings > Database

pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --no-owner \
  --no-privileges \
  -f backup_$(date +%Y%m%d).sql
```

### 3.2 Respaldo de Workflows n8n

1. En n8n, ir al workflow activo
2. Clic en los tres puntos (⋮) > **Download**
3. Guardar el archivo JSON localmente
4. Almacenar en el repositorio Git: `n8n/workflows/`

**IMPORTANTE:** El archivo JSON del workflow contiene credenciales embebidas.
Nunca subir a repositorios públicos. El archivo está en `.gitignore` por seguridad.

### 3.3 Respaldo de Archivos (Supabase Storage)

```bash
# Los archivos en Supabase Storage (catálogos PDF, imágenes) se respaldan
# automáticamente con la base de datos de Supabase.
# Para respaldo manual, descargar desde:
# Supabase Dashboard > Storage > [bucket-name]
```

### 3.4 Calendario de Respaldos Recomendado

| Frecuencia | Qué respaldar | Cómo |
|------------|---------------|------|
| Diario (automático) | Base de datos completa | Supabase automatic backups |
| Semanal | Workflow n8n | Download JSON manual |
| Mensual | Código fuente | Git push al repositorio |
| Por cambio | Workflow n8n | Después de cada modificación |

---

## 4. Cómo Desactivar Clientes

### 4.1 Desactivar un Tenant Completo

Cuando un mayorista (tenant) deja de usar el servicio:

```sql
-- Paso 1: Desactivar el tenant (soft delete)
UPDATE tenants
SET is_active = false,
    updated_at = NOW()
WHERE id = 'TENANT_ID';

-- Paso 2: Desactivar todos los usuarios del tenant
UPDATE users
SET is_active = false,
    updated_at = NOW()
WHERE tenant_id = 'TENANT_ID';

-- Verificar
SELECT id, name, is_active FROM tenants WHERE id = 'TENANT_ID';
SELECT id, email, is_active FROM users WHERE tenant_id = 'TENANT_ID';
```

**NOTA:** No eliminar los datos. La desactivación es reversible.
Los datos del tenant permanecen intactos en la base de datos por si necesitan reactivarse.

### 4.2 Reactivar un Tenant

```sql
-- Reactivar tenant
UPDATE tenants
SET is_active = true,
    updated_at = NOW()
WHERE id = 'TENANT_ID';

-- Reactivar usuarios
UPDATE users
SET is_active = true,
    updated_at = NOW()
WHERE tenant_id = 'TENANT_ID';
```

### 4.3 Desactivar un Cliente (Customer) Individual

Cuando un tendero deja de comprar o se quiere suspender:

```sql
-- Desactivar cliente específico
UPDATE customers
SET is_active = false,
    customer_type = 'inactive',
    updated_at = NOW()
WHERE id = 'CUSTOMER_ID' AND tenant_id = 'TENANT_ID';

-- Verificar
SELECT id, name, phone, is_active, customer_type
FROM customers
WHERE id = 'CUSTOMER_ID';
```

### 4.4 Desactivar el Bot de WhatsApp

Para detener temporalmente el bot de WhatsApp de un tenant:

**Opción 1: Desactivar en n8n**
- Ir al workflow en n8n
- Toggle OFF (desactivar)
- El webhook dejará de responder

**Opción 2: Desactivar en Twilio**
- Remover o cambiar la URL del webhook en Twilio Console
- Esto detiene todos los mensajes entrantes

### 4.5 Eliminación Permanente de Datos

**PRECAUCIÓN:** Esta operación es irreversible.

Solo realizar si el cliente lo solicita explícitamente (cumplimiento de protección de datos):

```sql
-- PASO 1: Eliminar mensajes de WhatsApp
DELETE FROM whatsapp_messages
WHERE tenant_id = 'TENANT_ID';

-- PASO 2: Eliminar conversaciones
DELETE FROM whatsapp_conversations
WHERE tenant_id = 'TENANT_ID';

-- PASO 3: Eliminar items de pedidos
DELETE FROM order_items
WHERE tenant_id = 'TENANT_ID';

-- PASO 4: Eliminar pedidos
DELETE FROM orders
WHERE tenant_id = 'TENANT_ID';

-- PASO 5: Eliminar productos
DELETE FROM products
WHERE tenant_id = 'TENANT_ID';

-- PASO 6: Eliminar categorías
DELETE FROM product_categories
WHERE tenant_id = 'TENANT_ID';

-- PASO 7: Eliminar clientes
DELETE FROM customers
WHERE tenant_id = 'TENANT_ID';

-- PASO 8: Eliminar usuarios
DELETE FROM users
WHERE tenant_id = 'TENANT_ID';

-- PASO 9: Eliminar tenant
DELETE FROM tenants
WHERE id = 'TENANT_ID';

-- ALTERNATIVA: Con CASCADE (más simple pero cuidado)
-- DELETE FROM tenants WHERE id = 'TENANT_ID';
-- (Las FK con ON DELETE CASCADE eliminan los datos dependientes automáticamente)
```

---

## 5. Monitoreo y Mantenimiento

### 5.1 Consultas de Monitoreo

```sql
-- Ver estado de todos los tenants
SELECT id, name, is_active, whatsapp_number,
       (SELECT COUNT(*) FROM orders WHERE tenant_id = t.id) as total_orders,
       (SELECT COUNT(*) FROM customers WHERE tenant_id = t.id) as total_customers,
       (SELECT COUNT(*) FROM products WHERE tenant_id = t.id AND is_active = true) as active_products
FROM tenants t
ORDER BY name;

-- Ver pedidos de hoy por tenant
SELECT t.name as tenant,
       COUNT(o.id) as pedidos_hoy,
       COALESCE(SUM(o.total), 0) as ventas_hoy
FROM tenants t
LEFT JOIN orders o ON o.tenant_id = t.id AND DATE(o.created_at) = CURRENT_DATE
GROUP BY t.id, t.name
ORDER BY ventas_hoy DESC;

-- Ver conversaciones activas
SELECT t.name as tenant,
       c.phone,
       c.status,
       c.last_message_at,
       c.unread_count
FROM whatsapp_conversations c
JOIN tenants t ON t.id = c.tenant_id
WHERE c.status = 'active'
ORDER BY c.last_message_at DESC;

-- Ver errores en mensajes (últimas 24 horas)
SELECT m.conversation_id, m.content, m.error_message, m.created_at
FROM whatsapp_messages m
WHERE m.status = 'failed'
AND m.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY m.created_at DESC;
```

### 5.2 Mantenimiento Regular

| Tarea | Frecuencia | Descripción |
|-------|------------|-------------|
| Verificar Twilio Sandbox | Cada 72 horas | Renovar sesión de sandbox si es necesario |
| Revisar errores en n8n | Diario | Verificar ejecuciones fallidas del workflow |
| Monitorear pedidos | Diario | Verificar que los pedidos se estén procesando |
| Revisar uso de Supabase | Semanal | Verificar límites del plan (filas, storage, API calls) |
| Actualizar prompts | Según necesidad | Ajustar el sistema prompt del bot según feedback |

### 5.3 Problemas Comunes y Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Bot no responde | Twilio Sandbox expirado | Re-enviar código de unión ("join XXXX") |
| Bot no responde | Workflow no publicado | En n8n, hacer clic en **Publish** después de guardar |
| Bot no responde | Workflow desactivado | Activar el toggle del workflow en n8n |
| Pedido no se guarda | Error en Supabase | Verificar credenciales (service_role key) |
| AI repite preguntas | Prompt necesita ajuste | Actualizar instrucciones en Build Prompt |
| PDF no se envía | URL incorrecta o archivo > 16MB | Verificar URL del catálogo y tamaño < 16MB |
| Error 409 Supabase | Conflicto de datos | Verificar UNIQUE constraints en la tabla |

---

## Información Técnica de Referencia

### Stack Tecnológico

| Componente | Tecnología | URL/Acceso |
|-----------|-----------|------------|
| Base de datos | Supabase (PostgreSQL) | dashboard.supabase.com |
| Automatización | n8n Cloud (Starter) | app.n8n.cloud |
| WhatsApp API | Twilio | console.twilio.com |
| AI / NLP | OpenAI GPT-4o-mini | (configurado en n8n) |
| Frontend | React 18 + Vite + TailwindCSS | localhost:5173 (dev) |
| Storage | Supabase Storage | (dentro de Supabase) |

### Estructura de la Base de Datos

```
tenants (Mayoristas)
  ├── users (Usuarios del sistema)
  ├── customers (Tenderos/Clientes)
  ├── product_categories (Categorías)
  ├── products (Productos)
  ├── orders (Pedidos)
  │   └── order_items (Items del pedido)
  ├── whatsapp_conversations (Conversaciones)
  │   └── whatsapp_messages (Mensajes)
```

### Flujo de Estados de Pedido

```
pending → confirmed → preparing → shipped → delivered
    ↓ (en cualquier momento)
  cancelled
```

### Flujo de Estados de Conversación

```
idle → ordering → collecting_address → collecting_phone → collecting_payment → confirming → idle
```

---

*Documento creado: Febrero 2026*
*Última actualización: Febrero 2026*
*Proyecto: COMANDIA MVP - Multi-Tenant WhatsApp B2B SaaS*
