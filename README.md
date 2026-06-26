# MercadoSeguro - MVP

MercadoSeguro es una plataforma de formalización digital para comerciantes mayoristas en Perú. El objetivo principal es permitir que los comerciantes informales se registren oficialmente, gestionen sus productos y ganen visibilidad en un catálogo transparente, accesible y seguro.

## Propuesta de Valor

**Problema**: Muchos comerciantes mayoristas en Perú operan sin formalización, lo que crea barreras de confianza y limita su acceso a mercados formales.

**Solución**: MercadoSeguro proporciona un registro digital simple, un dashboard intuitivo para gestionar productos y un catálogo público que permite a los compradores descubrir comerciantes verificados.

## Características del MVP

### Para Comerciantes
- ✓ Registro e inicio de sesión seguro vía Supabase Auth
- ✓ Seguimiento del estado de formalización (Pendiente, Aprobado, Rechazado)
- ✓ Gestión de hasta 10 productos (plan gratuito)
- ✓ Dashboard simple y funcional
- ✓ Visibilidad en el catálogo público cuando es aprobado

### Para Compradores
- ✓ Catálogo centralizado de comerciantes verificados
- ✓ Búsqueda por nombre de producto
- ✓ Filtrado por categoría
- ✓ Información de ubicación y comerciante
- ✓ Acceso público sin autenticación

### Modelo Freemium
- **Plan Gratuito**: Hasta 10 productos, acceso al catálogo, seguimiento de formalización
- **Plan Premium**: Próximamente (productos ilimitados, verificación especial, visibilidad mejorada)

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Validación**: Zod
- **Notificaciones**: react-hot-toast
- **Hosting**: Vercel
- **Base de Datos**: Supabase PostgreSQL

## Instalación Local

### Requisitos Previos
- Node.js 18+ y pnpm (o npm/yarn)
- Cuenta de Supabase

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/mercado-seguro.git
   cd mercado-seguro
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<tu_supabase_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu_supabase_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<tu_supabase_service_role_key>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   Puedes obtener estas variables del dashboard de Supabase:
   - **URL**: Settings → API → Project URL
   - **Anon Key**: Settings → API → Project API Keys (anon public)
   - **Service Role Key**: Settings → API → Project API Keys (service_role)

4. **Ejecutar migraciones de base de datos**
   - Abre el Supabase SQL Editor
   - Copia el contenido de `scripts/seed.sql`
   - Ejecuta la migración

5. **Iniciar el servidor de desarrollo**
   ```bash
   pnpm dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## Estructura del Proyecto

```
mercado-seguro/
├── app/
│   ├── (auth)/                  # Rutas de autenticación
│   │   ├── register/
│   │   ├── login/
│   │   └── actions.ts           # Server actions de auth
│   ├── dashboard/               # Dashboard protegido del comerciante
│   │   ├── page.tsx
│   │   ├── productos/
│   │   │   ├── nuevo/
│   │   │   └── [id]/editar/
│   │   └── layout.tsx
│   ├── catalogo/                # Catálogo público
│   ├── inicio/                  # Página de inicio
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página raíz (redirige a inicio)
│   └── globals.css              # Estilos globales con diseño
├── components/
│   ├── dashboard/               # Componentes del dashboard
│   │   ├── DashboardHeader.tsx
│   │   ├── FormalizationStatusCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   └── DeleteProductButton.tsx
│   ├── catalog/                 # Componentes del catálogo
│   └── ui/                      # Componentes shadcn/ui
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Cliente Supabase (lado cliente)
│   │   ├── server.ts            # Cliente Supabase (lado servidor)
│   │   └── proxy.ts             # Manejo de sesiones
│   ├── db.ts                    # Funciones de base de datos
│   ├── validation.ts            # Esquemas Zod
│   └── utils.ts                 # Utilidades (cn)
├── middleware.ts                # Middleware de autenticación
├── scripts/
│   └── seed.sql                 # Migraciones y datos de prueba
└── package.json
```

## Modelos de Datos

### Comerciantes
```sql
- id UUID PRIMARY KEY
- user_id UUID (FK → auth.users)
- nombre_completo VARCHAR(255)
- nombre_negocio VARCHAR(255)
- email VARCHAR(255)
- telefono VARCHAR(20)
- ubicacion VARCHAR(255)
- estado ENUM('Pendiente', 'Aprobado', 'Rechazado')
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### Solicitudes (Formalización)
```sql
- id UUID PRIMARY KEY
- comerciante_id UUID (FK → comerciantes)
- tipo VARCHAR(50) = 'Formalización'
- estado ENUM('Pendiente', 'Aprobada', 'Rechazada')
- observacion TEXT (opcional)
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

### Productos
```sql
- id UUID PRIMARY KEY
- comerciante_id UUID (FK → comerciantes)
- nombre VARCHAR(255)
- categoria VARCHAR(100)
- precio DECIMAL(10, 2)
- stock INTEGER
- descripcion TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP
```

## Flujo de Usuario

### Registro de Comerciante
1. Usuario abre la landing page (`/inicio`)
2. Hace clic en "Registrar Comerciante"
3. Completa el formulario de registro
4. Se crea automáticamente:
   - Cuenta en Supabase Auth
   - Registro de comerciante en estado `Pendiente`
   - Solicitud de formalización automática
5. Se redirige a `/login`

### Inicio de Sesión
1. Usuario inicia sesión en `/login`
2. Se verifica las credenciales vía Supabase Auth
3. Se redirige a `/dashboard`

### Dashboard
1. Muestra el estado de formalización
2. Lista productos del comerciante
3. Permite agregar/editar/eliminar productos (máx 10)
4. Botón para explorar el catálogo público

### Catálogo Público
1. Accessible sin autenticación en `/catalogo`
2. Muestra solo productos de comerciantes aprobados
3. Búsqueda por nombre de producto
4. Filtrado por categoría
5. Información del comerciante (nombre, ubicación)

## Seguridad

### Row Level Security (RLS)
- Los comerciantes pueden ver/editar solo sus propios datos
- El público puede ver solo comerciantes y productos aprobados
- Cada query está protegida por políticas RLS en Supabase

### Autenticación
- Supabase Auth maneja el registro y login
- Las sesiones se persisten vía cookies
- El middleware protege rutas según el estado de autenticación

### Validación
- Validación en cliente con Zod
- Validación en servidor en todas las operaciones
- Queries parameterizadas para evitar SQL injection

## Despliegue en Vercel

### Requisitos
- Proyecto conectado a GitHub
- Variables de entorno configuradas en Vercel

### Pasos

1. **Conectar a GitHub**
   - Crea un repositorio en GitHub
   - Conecta tu proyecto a Vercel

2. **Configurar variables de entorno**
   En el dashboard de Vercel:
   - Settings → Environment Variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Desplegar**
   - Haz push a `main` o `master`
   - Vercel desplegará automáticamente

### URL de Producción
```
https://tu-dominio.vercel.app
```

## Datos de Prueba

El archivo `scripts/seed.sql` incluye:
- 3 comerciantes de ejemplo (mix de estados Pendiente, Aprobado, Rechazado)
- 20+ productos de muestra en diferentes categorías
- Solicitudes de formalización preconfiguradas

Para cargarlos:
1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `scripts/seed.sql`
3. Ejecuta la migración

**Credenciales de Prueba**:
- Email: `merchant1@example.com`
- Password: `password123`

## Decisiones Técnicas

| Decisión | Razón | Beneficio MVP |
|----------|-------|---------------|
| **Supabase** | PostgreSQL + Auth integrado, RLS nativo, free tier generoso | Focaliza el learning en el problema de negocio, no en infraestructura |
| **Next.js 16** | SSR, API routes integrados, deployment simple en Vercel | Páginas públicas cargan rápido, fácil para explicar en examen |
| **Zod** | Validación ligera y type-safe | Código limpio y mantenible |
| **RLS en BD** | Seguridad en nivel de BD, no en app | Imposible acceder a datos ajenos, pasa auditoría académica |
| **No Payments** | Fuera de scope, freemium mostrado como "Próximamente" | Valida el core value: formalización + visibilidad |

## Métricas de Éxito MVP

- ✓ Comerciante puede registrarse → Ver estado formalización
- ✓ Comerciante puede publicar ≤10 productos
- ✓ Público puede buscar productos en catálogo
- ✓ RLS protege datos de cada comerciante
- ✓ App es responsive (móvil + desktop)
- ✓ Código es claro y documentado para examen

## Roadmap (Post-MVP)

1. **Plan Premium**: Productos ilimitados, verificación especial, análisis
2. **Admin Panel**: Gestionar estados de formalización
3. **Notificaciones**: Email cuando solicitud es aprobada
4. **Análisis**: Dashboard para comerciantes con estadísticas
5. **API Pública**: Para integraciones de terceros
6. **Mobile App**: Aplicación nativa iOS/Android

## Soporte & Contacto

Para problemas académicos o técnicos:
- Revisa la documentación en `ARCHITECTURE.md`
- Consulta los logs en el dashboard de Supabase
- Verifica las variables de entorno `.env.local`

## Licencia

MIT - Libre para uso educativo y comercial

---

**MercadoSeguro © 2024**

Formalizando el comercio mayorista en Perú 🇵🇪
