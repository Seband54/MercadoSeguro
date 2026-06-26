# MercadoSeguro - Quick Start Guide

# ⚠️ PROBLEMA ENCONTRADO: Email Verification Bloqueando Auth

## El Problema
**Supabase Auth tiene email verification habilitada por defecto**. Esto significa:
- Los usuarios que se registren recibirán un link en email para confirmar
- Sin confirmar, no pueden iniciar sesión
- En desarrollo local/MVP, esto no es ideal

## Solución: Desabilitar Email Verification (5 minutos)

### Paso 1: Abre Supabase Dashboard
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto "mercado-seguro"

### Paso 2: Ve a Configuración de Auth
1. En el menú izquierdo, haz clic en **Authentication**
2. Luego haz clic en **Providers**
3. Encuentra **Email** en la lista

### Paso 3: Desabilita Email Confirmation
1. Busca el toggle **"Enable email confirmations"**
2. **Apagalo** (el toggle debe estar en OFF/gris)
3. Haz clic en **"Save"**

### Listo! Ahora funciona:
- Los usuarios pueden registrarse en `/register`
- Inmediatamente se crean: cuenta Auth + comerciante + solicitud
- Pueden loginearse en `/login` sin verificar email

---

## Verificación: ¿Funciona Ahora?

### Test 1: Crear Cuenta
1. Ve a http://localhost:3000/register
2. Rellena el formulario con datos de prueba
3. Haz clic en "Registrarse"
4. Debes ser redirigido a `/dashboard` o `/login`

### Test 2: Acceder Dashboard
1. Ve a http://localhost:3000/login
2. Inicia sesión con la cuenta que acabas de crear
3. Debes ver el dashboard con tu estado de formalización (Pendiente)

### Test 3: Ver Catálogo
1. Ve a http://localhost:3000/catalogo
2. Debes ver "No hay productos disponibles" (correcto, sin datos aún)

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
