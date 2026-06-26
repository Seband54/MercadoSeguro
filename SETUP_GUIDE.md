# MercadoSeguro - Quick Setup Guide

## Resumen Ejecutivo

MercadoSeguro MVP está completamente funcional y listo para demostración académica. Incluye:
- ✓ Autenticación segura vía Supabase Auth
- ✓ Dashboard para comerciantes con gestión de productos
- ✓ Catálogo público con búsqueda y filtros
- ✓ Sistema de formalización integrado
- ✓ Row Level Security (RLS) para protección de datos
- ✓ Diseño responsive y minimalista

## Setup en 5 Pasos

### 1. Variables de Entorno

Copia `.env.local.example` → `.env.local`:
```bash
cp .env.local.example .env.local
```

Completa con tus credenciales de Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Instalar Dependencias

```bash
pnpm install
# O: npm install / yarn install
```

### 3. Cargar Esquema y Datos

1. Abre Supabase SQL Editor
2. Copia el contenido de `scripts/seed.sql`
3. Ejecuta la migración
4. Verifica:
   ```sql
   SELECT COUNT(*) FROM comerciantes;  -- Debería mostrar 3
   SELECT COUNT(*) FROM productos;     -- Debería mostrar 12
   ```

### 4. Iniciar Dev Server

```bash
pnpm dev
# Abre: http://localhost:3000
```

### 5. Probar Flujo Completo

#### Opción A: Registrar Nuevo Comerciante
1. Click "Registrar Comerciante"
2. Completa el formulario
3. Inicia sesión con las nuevas credenciales
4. Agrega 1-2 productos de prueba
5. Explora el catálogo público

#### Opción B: Login con Datos de Prueba
1. Click "Inicia Sesión"
2. Email: `juan@distribuidora.com` (cambia según datos que cargues)
3. Password: `password123` (debes establecer este en auth.users)

**Nota**: Los datos de prueba en `seed.sql` necesitan que:
1. Crees usuarios en Supabase Auth via `/register`
2. O ejecutes: `UPDATE comerciantes SET user_id = '<actual-uuid>' WHERE email = '...'`

## Flujos de Prueba Recomendados (Para Examen)

### Test 1: Registro y Formalización
```
1. Ir a /registro
2. Registrar nuevo comerciante
3. Ver estado "Pendiente" en dashboard
4. Agregar 3-5 productos
5. Ir a /catalogo → NO aparecen (porque estado=Pendiente)
```
**Expectativa**: Comerciante NO visible en catálogo hasta aprobación

### Test 2: Dashboard Seguridad
```
1. Login como Comerciante A
2. Ir a /dashboard → Ve sus productos
3. Abrir DevTools → Network
4. Intentar acceder a GET /api/productos?comerciante_id=<OTRO>
5. Ver que RLS rechaza la consulta
```
**Expectativa**: RLS protege datos entre merchants

### Test 3: Catálogo Búsqueda
```
1. Ir a /catalogo (SIN login)
2. Escribir nombre de producto
3. Ver filtrados en tiempo real
4. Seleccionar categoría
5. Ver solo esa categoría
```
**Expectativa**: Búsqueda y filtros funcionan correctamente

### Test 4: Límite de 10 Productos
```
1. Login como merchant
2. Agregar 10 productos
3. Intentar agregar #11
4. Ver botón "+ Nuevo Producto" deshabilitado
5. Ver message "Plan Premium para ilimitados"
```
**Expectativa**: Límite de freemium enforced

### Test 5: Product Management
```
1. Agregar producto con nombre "Test"
2. Click "Editar"
3. Cambiar precio a 999.99
4. Guardar
5. Ver cambio en la tabla
6. Click "Eliminar"
7. Confirmar eliminación
```
**Expectativa**: CRUD completo funciona

## Estructura del Proyecto (Guía Rápida)

```
MercadoSeguro/
├── app/
│   ├── (auth)/           ← /register, /login (públicas)
│   ├── dashboard/        ← /dashboard (protegida)
│   ├── catalogo/         ← /catalogo (pública)
│   ├── inicio/           ← / (landing)
│   └── layout.tsx        ← Root layout + tema
├── components/
│   ├── dashboard/        ← ProductForm, ProductList, etc.
│   └── ui/               ← shadcn/ui: Button, Input, etc.
├── lib/
│   ├── supabase/         ← Configuración Supabase
│   ├── db.ts             ← Queries a BD
│   └── validation.ts     ← Esquemas Zod
├── middleware.ts         ← Protección de rutas
├── README.md             ← Documentación completa
├── ARCHITECTURE.md       ← Decisiones técnicas
└── scripts/seed.sql      ← Datos de prueba
```

## Troubleshooting Rápido

### Error: "Module not found: Input"
**Solución**: Ya está creado en `components/ui/input.tsx`

### Error: "NEXT_PUBLIC_SUPABASE_URL not found"
**Solución**: 
1. Verifica `.env.local` está en la raíz
2. Reinicia el dev server (`Ctrl+C` y `pnpm dev`)

### Productos NO aparecen en catálogo
**Causas posibles**:
1. Comerciante tiene estado != 'Aprobado'
   - Solución: `UPDATE comerciantes SET estado='Aprobado' WHERE email='...'`
2. No hay productos agregados
   - Solución: Agregar desde /dashboard

### Login falla
**Causas posibles**:
1. Email/password incorrecto
   - Solución: Registrar nuevo usuario
2. user_id en comerciantes es NULL
   - Solución: Verificar que `comerciantes.user_id` apunte a `auth.users.id`

### RLS bloquea insert de producto
**Esperado si**:
- Intentas INSERT directamente sin autenticación
- Intentas crear producto de otro comerciante

**Solución**: Usar la app via /dashboard, que maneja auth correctamente

## Deployment a Vercel

### Prerequisitos
- GitHub repo conectado
- Supabase project en producción

### 1. Push a GitHub
```bash
git add .
git commit -m "MVP MercadoSeguro"
git push origin main
```

### 2. Conectar a Vercel
1. Ir a vercel.com
2. Importar proyecto desde GitHub
3. Seleccionar rama `main`
4. Click "Deploy"

### 3. Configurar Env Vars en Vercel
1. Project Settings → Environment Variables
2. Agregar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` = URL de Vercel
3. Click "Deploy" nuevamente

### 4. Verificar en Producción
```
https://tu-proyecto.vercel.app
```

## Puntos Clave Para Explicar en Examen

1. **Por qué Supabase Auth**: Autenticación segura sin custom logic, bcrypt automático
2. **RLS es core**: La BD misma rechaza accesos no autorizados, no la app
3. **Lean MVP**: Solo 3 tablas, solo lo necesario para validar hipótesis
4. **Formalización > Productos**: El objetivo es formalizar, productos es el medio
5. **Design Pattern**: Server Components para SSR, Server Actions para mutaciones
6. **Trigger Automático**: solicitud se crea automáticamente al registrar

## Timeline Sugerido para Presentación

```
0:00 - 0:30  → Landing page + explicar problema
0:30 - 1:00  → Registro + explicar flujo de autenticación
1:00 - 1:30  → Dashboard + gestión de productos
1:30 - 2:00  → Catálogo público + búsqueda/filtros
2:00 - 2:15  → Explicar RLS y seguridad
2:15 - 2:30  → Preguntas
```

## Checklist Final (Antes de Examen)

- [ ] `.env.local` configurado con credenciales reales
- [ ] `pnpm install` ejecutado
- [ ] `scripts/seed.sql` cargado en Supabase
- [ ] Dev server corriendo sin errores (`pnpm dev`)
- [ ] Landing page (`/`) accesible
- [ ] Registro (`/register`) funciona
- [ ] Login (`/login`) funciona
- [ ] Dashboard (`/dashboard`) accesible tras login
- [ ] Catálogo (`/catalogo`) accessible sin login
- [ ] README.md + ARCHITECTURE.md completos
- [ ] GitHub repo sincronizado (si aplica)
- [ ] Vercel deployment funcionando (si aplica)

## Contacto & Soporte

Si encuentras problemas:
1. Revisa ARCHITECTURE.md para contexto técnico
2. Verifica console browser (F12) para errores
3. Revisa Supabase logs: Dashboard → Logs
4. Verifica variables de entorno: `.env.local`

---

**MercadoSeguro MVP - Junio 2024**
Listo para demostración académica.
