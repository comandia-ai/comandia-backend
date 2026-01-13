# COMANDIA - Flujo de Creación de Tenant (Tenant Creation Flow)

## Resumen / Overview

Este documento describe el proceso completo para crear un nuevo tenant (mayorista/wholesaler) en la plataforma COMANDIA.

This document describes the complete process for creating a new tenant (wholesaler) on the COMANDIA platform.

---

## Arquitectura Multi-Tenant / Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     COMANDIA Platform                        │
├─────────────────────────────────────────────────────────────┤
│  Super Admin Dashboard                                       │
│  ├── Manage All Tenants                                     │
│  ├── Create New Tenants                                     │
│  └── View Global Analytics                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Tenant A   │  │  Tenant B   │  │  Tenant C   │        │
│  │ (Mayorista) │  │ (Mayorista) │  │ (Mayorista) │        │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤        │
│  │ - Products  │  │ - Products  │  │ - Products  │        │
│  │ - Customers │  │ - Customers │  │ - Customers │        │
│  │ - Orders    │  │ - Orders    │  │ - Orders    │        │
│  │ - WhatsApp  │  │ - WhatsApp  │  │ - WhatsApp  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ALL DATA ISOLATED BY tenant_id (RLS Enforced)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Creación / Creation Flow

### Paso 1: Super Admin Inicia Creación
**Step 1: Super Admin Initiates Creation**

El Super Admin accede al panel de administración y selecciona "Crear Nuevo Tenant".

```sql
-- Información requerida / Required information:
-- 1. Nombre del negocio (business name)
-- 2. Número de WhatsApp
-- 3. País y ciudad
-- 4. Email del administrador del tenant
```

### Paso 2: Crear Registro de Tenant
**Step 2: Create Tenant Record**

```sql
-- Insertar nuevo tenant / Insert new tenant
INSERT INTO tenants (
    name,
    business_name,
    whatsapp_number,
    country,
    city,
    timezone,
    currency
) VALUES (
    'Distribuidora ABC',
    'Distribuidora ABC S.A.S',
    '+573001234567',
    'Colombia',
    'Bogotá',
    'America/Bogota',
    'COP'
) RETURNING id;

-- Resultado: tenant_id = 'uuid-del-nuevo-tenant'
```

### Paso 3: Crear Usuario Administrador del Tenant
**Step 3: Create Tenant Admin User**

```sql
-- Primero, el admin se registra en Supabase Auth
-- First, admin registers via Supabase Auth

-- Luego, crear registro de usuario / Then create user record
INSERT INTO users (
    tenant_id,
    email,
    full_name,
    phone,
    role,
    is_super_admin
) VALUES (
    'uuid-del-nuevo-tenant',
    'admin@distribuidora-abc.com',
    'Juan Pérez',
    '+573001234567',
    'admin',
    false
);
```

### Paso 4: Configurar WhatsApp (Posterior)
**Step 4: Configure WhatsApp (Later)**

```sql
-- Actualizar configuración de WhatsApp
-- Update WhatsApp configuration
UPDATE tenants
SET
    whatsapp_provider = '360dialog',
    whatsapp_api_key = 'encrypted_api_key_here',
    settings = jsonb_set(
        settings,
        '{whatsapp}',
        '{"webhook_verified": true, "business_id": "xxx"}'
    )
WHERE id = 'uuid-del-nuevo-tenant';
```

---

## Verificación de Aislamiento de Datos
## Data Isolation Verification

### Row Level Security (RLS) garantiza:
**RLS guarantees:**

1. **Usuarios solo ven datos de su tenant**
   Users can only see data from their tenant

2. **Queries automáticamente filtradas**
   Queries are automatically filtered

3. **Super Admins pueden ver todo**
   Super Admins can see everything

### Ejemplo de Query Filtrada / Filtered Query Example:

```sql
-- Cuando un usuario del Tenant A hace:
-- When a user from Tenant A executes:
SELECT * FROM products;

-- El RLS automáticamente lo convierte en:
-- RLS automatically converts it to:
SELECT * FROM products WHERE tenant_id = 'tenant-a-id';
```

---

## Diagrama de Secuencia / Sequence Diagram

```
Super Admin          Supabase Auth         Database
     │                    │                    │
     │ 1. Create Tenant   │                    │
     │─────────────────────────────────────────>│
     │                    │      tenant_id     │
     │<─────────────────────────────────────────│
     │                    │                    │
     │ 2. Invite Admin    │                    │
     │───────────────────>│                    │
     │                    │                    │
     │       (Admin receives email)            │
     │                    │                    │
Tenant Admin             │                    │
     │ 3. Sign Up         │                    │
     │───────────────────>│                    │
     │                    │ 4. Create user    │
     │                    │───────────────────>│
     │                    │                    │
     │ 5. Login           │                    │
     │───────────────────>│                    │
     │                    │ 6. Get tenant_id  │
     │                    │<───────────────────│
     │                    │                    │
     │ 7. Dashboard       │  (RLS applied)    │
     │─────────────────────────────────────────>│
     │   (Only sees their tenant data)         │
```

---

## Roles de Usuario / User Roles

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| `super_admin` | Todo | Acceso total a todos los tenants |
| `admin` | CRUD Tenant | Gestión completa de su tenant |
| `operator` | CRUD Orders/Customers | Operaciones diarias |
| `viewer` | Solo lectura | Ver información sin modificar |

---

## Checklist de Onboarding de Tenant
## Tenant Onboarding Checklist

- [ ] Crear registro de tenant en BD
- [ ] Crear usuario admin del tenant
- [ ] Configurar número de WhatsApp
- [ ] Verificar webhook de WhatsApp
- [ ] Importar catálogo de productos (opcional)
- [ ] Importar lista de clientes (opcional)
- [ ] Configurar zonas de entrega
- [ ] Personalizar horarios de negocio
- [ ] Probar flujo de pedido via WhatsApp

---

## Código de Ejemplo: Función de Creación
## Example Code: Creation Function

```typescript
// En el backend / In the backend
async function createTenant(data: CreateTenantInput): Promise<Tenant> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // 1. Create tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      name: data.name,
      business_name: data.businessName,
      whatsapp_number: data.whatsappNumber,
      country: data.country,
      city: data.city,
    })
    .select()
    .single();

  if (tenantError) throw tenantError;

  // 2. Invite admin user via Supabase Auth
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    data.adminEmail,
    {
      data: {
        tenant_id: tenant.id,
        role: 'admin',
        full_name: data.adminName,
      },
    }
  );

  if (inviteError) throw inviteError;

  return tenant;
}
```

---

## Consideraciones de Seguridad / Security Considerations

1. **API Keys de WhatsApp**: Siempre encriptadas en la base de datos
   WhatsApp API Keys: Always encrypted in database

2. **tenant_id nunca expuesto**: El frontend no debería manipular tenant_id
   tenant_id never exposed: Frontend should not manipulate tenant_id

3. **RLS siempre activo**: Nunca deshabilitar en producción
   RLS always active: Never disable in production

4. **Service Role Key**: Solo en backend, nunca en frontend
   Service Role Key: Backend only, never in frontend

---

## Soporte / Support

Para preguntas sobre la creación de tenants, contactar al equipo de desarrollo.

For questions about tenant creation, contact the development team.
