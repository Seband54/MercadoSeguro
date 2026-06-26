# MercadoSeguro - Quick Start Guide

## Problema: Registro/Login no funcionan

El problema es que **Supabase Auth tiene email verification habilitada por defecto**. Esto impide que los usuarios se registren e inicien sesión inmediatamente.

## Solución: Desabilitar Email Verification

### Paso 1: Ir a Supabase Console

1. Abre tu proyecto en [Supabase Console](https://supabase.com/dashboard)
2. Navega a **Authentication → Providers → Email**

### Paso 2: Desabilitar Email Confirmation

1. En "Confirm email", **apaga el toggle** para desabilitar la verificación de email
2. Guarda los cambios

### Paso 3: Usar la App

Ahora puedes:
- Ir a `/register` y crear una cuenta
- La cuenta se registrará inmediatamente en Supabase Auth
- Se creará automáticamente un comerciante con estado "Pendiente"
- Se creará automáticamente una solicitud de formalización
- Luego puedes ir a `/login` e iniciar sesión

## Test Workflow

### Crear Test Users Manualmente (Alternativa)

Si prefieres no desabilitar la verificación, puedes crear users directamente en Supabase:

1. Ve a Supabase Console → Authentication → Users
2. Haz clic en "Add user"
3. Crea un usuario con email y password
4. El usuario podrá loginearse inmediatamente

### Crear Test Merchants (Base de Datos)

Después de crear un usuario en Auth, crea un comerciante en la base de datos:

```sql
-- Obtén el user_id del usuario que acabas de crear
-- Luego inserta un comerciante

INSERT INTO comerciantes (user_id, nombre_completo, nombre_negocio, email, telefono, ubicacion, estado)
VALUES (
  'USER_ID_HERE', -- Reemplaza con el user_id real
  'Juan García',
  'García Mayorista',
  'juan@example.com',
  '+51987654321',
  'Lima, Perú',
  'Aprobado' -- Usa 'Aprobado' para que aparezca en el catálogo público
);

-- La solicitud se creará automáticamente por el trigger
```

### Crear Test Products

Una vez logineado, el comerciante puede crear productos. O inserta directamente:

```sql
INSERT INTO productos (comerciante_id, nombre, categoria, precio, stock, descripcion)
VALUES (
  'COMERCIANTE_ID_HERE',
  'Arroz Blanco 10kg',
  'Alimentos',
  45.50,
  100,
  'Arroz de primera calidad'
);
```

## Características Principales

### Para Comerciantes (Autenticados)
- **Registro**: Crea cuenta con datos del negocio
- **Dashboard**: Ve estado de formalización (Pendiente/Aprobado/Rechazado)
- **Gestión de Productos**: CRUD de productos (máximo 10)
- **Límite de Plan**: 10 productos en plan gratuito

### Para Público (Sin Autenticación)
- **Catálogo**: Explora productos de comerciantes aprobados
- **Búsqueda**: Encuentra productos por nombre
- **Filtros**: Filtra por categoría
- **Información**: Ve datos del comerciante y ubicación

## Rutas Principales

- `/` → Redirige a `/inicio`
- `/inicio` → Landing page
- `/register` → Registro de nuevo comerciante
- `/login` → Iniciar sesión
- `/dashboard` → Panel del comerciante (protegido)
- `/catalogo` → Catálogo público (accesible)

## Troubleshooting

### "No puedo crear una cuenta"
→ Desabilita email verification en Supabase Auth settings

### "No aparecen productos en el catálogo"
→ Asegúrate de que el comerciante tenga estado "Aprobado"
→ Los productos solo aparecen si el comerciante está aprobado

### "No puedo ver mi dashboard"
→ Asegúrate de estar logineado (hay una sesión en Supabase Auth)
→ El comerciante debe existir en la tabla `comerciantes`

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js Server Actions
- **Auth**: Supabase Auth (email + password)
- **Database**: Supabase PostgreSQL con RLS policies
- **Hosting**: Vercel

## Próximos Pasos (Después de MVP)

- Implementar panel administrativo para cambiar estado de formalización
- Agregar verificación de email real
- Implementar pagos con Stripe para plan Premium
- Agregar analytics y reportes
- Notificaciones en tiempo real
