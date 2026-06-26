# MercadoSeguro - Arquitectura Técnica

## Visión General

MercadoSeguro es un MVP construido bajo principios de **Lean Startup** y **SOLID Design**, con enfoque en simplicidad, claridad de código y alineación directa con el problema de negocio.

### Hipótesis Principal
> Si los comerciantes mayoristas informales pueden registrarse digitalmente de forma simple y aparecer en un catálogo público, la formalización aumentará y la dependencia del comercio informal disminuirá.

## Arquitectura de Alto Nivel

```
┌─────────────────┐
│   Landing Page  │
│  (Public)       │
└────────┬────────┘
         │
    ┌────┴──────────┬──────────────┐
    │               │              │
┌───▼──┐      ┌──────▼──┐   ┌────▼──┐
│Login │      │Register │   │Catalog│
└───┬──┘      └────┬────┘   └────┬──┘
    │              │             │
    └──────┬───────┘             │
           │                     │
       Supabase Auth             │
           ↓                     │
    ┌──────────────┐            │
    │ auth.users   │            │
    └──────┬───────┘            │
           │                     │
    ┌──────▼──────────────────────┴──┐
    │    Row Level Security (RLS)    │
    └──────┬──────────────────────────┘
           │
    ┌──────┴────────────┐
    │ PostgreSQL Tables │
    ├────────────────────┤
    │ comerciantes       │
    │ solicitudes        │
    │ productos          │
    └────────────────────┘
```

## Componentes Clave

### 1. Autenticación (Supabase Auth)

**Por qué Supabase Auth y no custom**:
- Gestiona hashing de contraseñas automáticamente (bcrypt)
- Manejo de sesiones via JWT + cookies
- Integración nativa con RLS
- Menos código, menos bugs, más seguridad

**Flujo**:
```
Register Form → signUp() → Supabase Auth
                              ↓
                          ✓ User creado en auth.users
                          ✓ Comerciante creado en tabla
                          ✓ Solicitud creada por trigger
                          ↓
                       Redirect a /login
```

### 2. Row Level Security (RLS)

**Concepto**: La BD misma, no la aplicación, es quien decide qué datos puede ver/modificar cada usuario.

**Políticas por tabla**:

#### comerciantes
- `SELECT`: Merchants ven su propio perfil, públicos ven solo aprobados
- `UPDATE`: Merchants solo actualizan su propio perfil (no estado)
- Trigger automático que inserta solicitud

#### solicitudes
- `SELECT`: Merchants ven sus propias solicitudes
- Gestión via service role (no directamente por users)

#### productos
- `SELECT`: Merchants ven sus productos, públicos ven solo de aprobados
- `INSERT/UPDATE/DELETE`: Solo merchant propietario

**Ventajas**:
- Imposible olvidar validaciones de acceso
- Protección contra bugs de lógica en la app
- Auditable y transparente
- Cumple requisitos académicos de seguridad

### 3. Datos & Persistencia

**Base de datos**: PostgreSQL vía Supabase

**Tablas Principales**:
```sql
comerciantes
├─ id UUID PRIMARY KEY
├─ user_id UUID → FK auth.users
├─ nombre_completo VARCHAR
├─ nombre_negocio VARCHAR
├─ email VARCHAR (UNIQUE)
├─ telefono VARCHAR
├─ ubicacion VARCHAR
├─ estado ENUM (Pendiente|Aprobado|Rechazado)
└─ timestamps

solicitudes
├─ id UUID PRIMARY KEY
├─ comerciante_id UUID → FK comerciantes
├─ tipo VARCHAR = 'Formalización'
├─ estado ENUM (Pendiente|Aprobada|Rechazada)
├─ observacion TEXT
└─ timestamps
└─ UNIQUE(comerciante_id, tipo)

productos
├─ id UUID PRIMARY KEY
├─ comerciante_id UUID → FK comerciantes
├─ nombre VARCHAR
├─ categoria VARCHAR
├─ precio DECIMAL(10,2)
├─ stock INTEGER
├─ descripcion TEXT
└─ timestamps
```

**Índices**:
- `comerciantes.email`: Para login rápido
- `comerciantes.estado`: Para filtrar catálogo
- `solicitudes.comerciante_id`: Para lookups de solicitud
- `productos.comerciante_id`: Para lista de productos del merchant
- `productos.categoria`: Para filtros de catálogo

**Trigger Automático**:
Cuando se inserta un `comerciante`, automáticamente se crea una `solicitud` con estado `Pendiente`.

```sql
create_solicitud_on_comerciante_insert()
  → INSERT INTO solicitudes (comerciante_id, tipo='Formalización', estado='Pendiente')
```

### 4. Flujo de Autenticación

```
1. User visita /register
   ↓
2. Completa formulario + valida con Zod
   ↓
3. signUp(email, password, metadata)
   ├─ Supabase Auth: crea user en auth.users
   ├─ App: inserta comerciante (user_id linked)
   └─ Trigger: auto-inserta solicitud Pendiente
   ↓
4. Redirige a /login
   ↓
5. User inicia sesión
   ├─ signIn(email, password) via Supabase Auth
   ├─ JWT token generado
   └─ Cookie establecida
   ↓
6. middleware.ts verifica JWT
   ├─ ✓ Valid: continuar
   └─ ✗ Invalid: redirigir a /login
   ↓
7. User en /dashboard
   ├─ SSR: getUser() via createClient(server)
   ├─ getMerchantByUserId(user.id)
   └─ SSR: fetch productos, solicitud
```

### 5. Productos: CRUD Protegido

**Create**:
```
POST /dashboard/productos/nuevo
  ↓
ProductForm → Server Action: createProduct()
  ├─ Valida con Zod (cliente + servidor)
  ├─ Verifica límite de 10 productos
  ├─ INSERT en tabla productos
  │  └─ RLS automáticamente limita a merchant autenticado
  └─ toast.success() + redirect
```

**Read**:
```
/dashboard
  ↓
SSR: getMerchantProducts(merchantId)
  ├─ SELECT FROM productos WHERE comerciante_id = $1
  │  └─ RLS asegura que solo merchant autenticado acceda
  └─ Render ProductList con editar/eliminar buttons
```

**Update**:
```
/dashboard/productos/[id]/editar
  ↓
SSR: getProduct(id)
  ├─ Valida que pertenece al merchant actual (RLS)
  ├─ Pre-llena formulario
  └─ ProductForm → updateProduct()
     ├─ UPDATE productos SET ...
     │  └─ RLS + WHERE comerciante_id = merchant actual
     └─ redirect(/dashboard)
```

**Delete**:
```
DeleteProductButton (client)
  ├─ Click → Confirmar
  └─ Server Action: deleteProduct(id)
     ├─ DELETE FROM productos WHERE id = $1
     │  └─ RLS previene delete de otros merchants
     └─ router.refresh()
```

**Límite de 10 Productos**:
- Check en cliente: `canAddMore = products.length < 10`
- Validación en servidor: si count >= 10, rechazar INSERT
- UX: Botón "+ Nuevo Producto" deshabilitado
- Premium message: "Upgrade a Plan Premium para ilimitados"

### 6. Catálogo Público

**Diseño**:
- Accessible sin autenticación
- Muestra solo productos de comerciantes con estado='Aprobado'
- Búsqueda por nombre (real-time con debounce)
- Filtro por categoría
- Grid responsive

**Implementación**:
```
/catalogo
  ├─ SSR: getPublicCatalogProducts()
  │  └─ SELECT productos WHERE comerciante_id IN
  │     (SELECT id FROM comerciantes WHERE estado='Aprobado')
  │  └─ RLS: Public policy auto-limita a aprobados
  ├─ Client-side: ProductGrid + SearchBar + CategoryFilter
  └─ Debounce 300ms en búsqueda para no sobrecargar
```

### 7. Validación en Capas

**Capa 1: Cliente (Zod)**
```typescript
// Validación inmediata en el form
const schema = z.object({
  nombre: z.string().min(3),
  precio: z.number().positive(),
  // ...
})
```

**Capa 2: Servidor (Zod + Business Logic)**
```typescript
// Server Action valida nuevamente
const validated = schema.parse(input)
// Luego: verificar límites, permisos, RLS
```

**Capa 3: Base de Datos (RLS + Constraints)**
```sql
-- RLS policies bloquean acceso no autorizado
-- Check constraints validan datos
-- Foreign keys mantienen integridad
```

### 8. Error Handling

**Strategy**: "Fail Safe" - si algo falla, el usuario se entera pero sus datos permanecen intactos.

```typescript
try {
  await createProduct(formData)
  toast.success('Producto creado')
  router.push('/dashboard')
} catch (error) {
  toast.error(error.message)
  // Stay on page, form data preserved
}
```

## Decisiones de Diseño

| Aspecto | Opción Elegida | Alternativas | Por Qué |
|--------|-----------------|--------------|--------|
| **Framework** | Next.js 16 | Remix, SvelteKit | SSR nativo, API routes, fácil deploying |
| **DB** | PostgreSQL/Supabase | MongoDB, Firebase | Relaciones complejas, RLS nativo, transacciones |
| **Auth** | Supabase Auth | Auth0, custom | Integrado con RLS, bcrypt automático |
| **ORM** | SQL directo | Prisma, Drizzle | Queries simples, RLS visibles y explícitas |
| **Validación** | Zod | Joi, Valibot | Lightweight, integrado con TypeScript |
| **Styling** | TailwindCSS | Styled-components | Utility-first, bundle pequeño, consistente |
| **Hosting** | Vercel | Heroku, Railway | Auto-deploying desde GitHub, Next.js nativo |

## Escalabilidad Post-MVP

### Qué es Fácil de Escalar
- **Productos**: Agregar campos a tabla (alter table)
- **Categorías**: Mover a tabla separada con FK
- **Users**: Multi-role (admin, moderator, etc.)
- **Analytics**: Agregar tabla de eventos, logs
- **Payments**: Stripe integration, nuevas tablas

### Qué No Necesita Cambios
- **Architecture**: El diseño de RLS y SSR es sólido
- **Code structure**: Componentes, actions, libs son modular
- **Database**: PostgreSQL puede crecer a millones de registros

### Optimizaciones Necesarias Después
1. **Caching**: Redis para catálogo (read-heavy)
2. **Search**: Full-text search en Postgres o Algolia
3. **Images**: CDN para fotos de productos
4. **Monitoring**: Sentry para errores, PostHog para analytics
5. **Admin**: Panel para gestionar solicitudes de formalización

## Seguridad

### Amenazas y Mitigación

| Amenaza | Mitigación |
|---------|-----------|
| **SQL Injection** | Parametrized queries via Supabase SDK |
| **Cross-site Scripting (XSS)** | React sanitiza automáticamente, Zod valida |
| **Access Control** | RLS en cada tabla, middleware para rutas |
| **Data Leakage** | RLS imposibilita ver datos ajenos |
| **CSRF** | Next.js Middleware + SameSite cookies |
| **Man-in-the-Middle** | HTTPS enforced en Vercel |
| **Weak Passwords** | Zod min 8 chars, bcrypt via Supabase Auth |

## Performance

### Optimizaciones Implementadas
- **SSR**: Datos precargados en servidor
- **Streaming**: Páginas complejas cargan incremental
- **Image Optimization**: Next/image para productos (futura)
- **Code Splitting**: Dynamic imports para modales (futura)
- **Database Indexes**: En email, estado, categoría
- **Debounced Search**: No llamadas a BD en cada keystroke

### Core Web Vitals Target
- **LCP**: < 2.5s (SSR helps)
- **FID/INP**: < 100ms (lightweight JS)
- **CLS**: < 0.1 (fixed layouts)

## Testing (Para MVP, Básico)

```typescript
// Manual smoke tests para examen
1. Register → Login → Dashboard → Add Product → View in Catalog
2. Login con email/pass inválido → Error toast
3. Try acceder /dashboard sin login → Redirige a /login
4. Editar producto de otro merchant → RLS rechaza (verifica en DB logs)
5. Catalog filters → Productos filtrados correctamente
```

(Automated tests estarían en versión post-MVP con Jest + React Testing Library)

## Deployment

### Environment Variables Necesarias

**Producción (Vercel)**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://mercado-seguro.vercel.app
```

**Desarrollo (.env.local)**:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 (si es local)
... (o Supabase project remoto)
```

### Workflow de Despliegue

```
1. Dev: push a rama feature
2. GitHub: CI checks (ESLint, type check)
3. Vercel: Auto-deploy preview
4. Review en preview URL
5. PR merge a main
6. Vercel: Auto-deploy a producción
```

## Documentación del Código

### Comentarios: Cuándo y Dónde

**✗ NO comentar**: código obvio
```typescript
// MAL:
const name = user.name // Obtener el nombre
```

**✓ SÍ comentar**: lógica compleja, decisiones no evidentes
```typescript
// BIEN:
// RLS policy aquí valida que solo el merchant propietario pueda actualizar
// No necesitas validación adicional en la app
const { error } = await supabase.from('productos').update(...)
```

### Estructura de Archivos: Intención Clara

```
app/
├── (auth)/          ← Rutas públicas de autenticación
├── dashboard/       ← Rutas protegidas de merchant
├── catalogo/        ← Ruta pública de catálogo
└── inicio/          ← Landing page pública

components/
├── dashboard/       ← Usados solo en /dashboard
├── catalog/         ← Usados solo en /catalogo (futura)
└── ui/              ← Reusables en toda la app

lib/
├── supabase/        ← Setup y configuración
├── db.ts            ← Queries mapeadas a modelos
└── validation.ts    ← Esquemas Zod
```

## Lecciones Aprendidas (MVP)

1. **RLS es poderosa**: Confiar en RLS en lugar de lógica en app
2. **Menos es más**: 3 tablas suficientes para MVP, no overengineer
3. **Supabase Auth**: Vale la pena no inventar autenticación custom
4. **Server Components**: Simplifica SSR data fetching
5. **TypeScript**: Invaluable para un MVP que debe ser claro
6. **Zod**: Validación simple sin overhead

---

**Última actualización**: Junio 2024
