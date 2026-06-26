# Configuración de Supabase Auth para MercadoSeguro

## El Problema: Email Verification Está Habilitada

Por defecto, Supabase Auth requiere que los usuarios confirmen su email antes de poder iniciar sesión. Esto bloquea el flujo de MercadoSeguro en development y MVP.

**Síntomas:**
- El registro aparentemente funciona pero el usuario no puede loginearse
- No se muestra error claro al usuario
- El dashboard se ve inaccesible

**Causa:** 
- Supabase Auth espera un email de confirmación
- En local/MVP, no queremos esperar verificación

---

## Solución Rápida: Desabilitar Email Confirmation

### Opción A: Vía Dashboard (Recomendado - 3 clicks)

1. **Abre Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Inicia sesión si es necesario
   - Selecciona el proyecto "mercado-seguro"

2. **Ve a Configuración de Auth**
   - En el menú izquierdo: `Authentication`
   - Luego: `Providers`
   - Busca: `Email`

3. **Desabilita Email Confirmations**
   - Encuentra el toggle "Confirm email"
   - **Apagalo** (debe estar OFF/deshabilitado)
   - Haz clic en "Save"

### Resultado Esperado
- El toggle debería estar gris/OFF
- Aparecer un mensaje de éxito

---

## Test el Setup

Después de desabilitar email confirmations, prueba el flujo completo:

### Test 1: Registrar Nuevo Comerciante
```
1. Abre: http://localhost:3000/register
2. Rellena con datos de prueba:
   - Nombre Completo: "Juan de Prueba"
   - Nombre Negocio: "Negocio Test"
   - Email: "test.user@mercadoseguro.com"
   - Contraseña: "SecurePass123!"
   - Teléfono: "+51987654321"
   - Ubicación: "Lima, Perú"
3. Haz clic en "Registrarse"
4. Debes ver: 
   ✓ Mensaje de éxito
   ✓ Redirección a /dashboard o /login
   ✓ NO debe pedir verificación de email
```

### Test 2: Iniciar Sesión
```
1. Abre: http://localhost:3000/login
2. Usa las credenciales que creaste:
   - Email: test.user@mercadoseguro.com
   - Contraseña: SecurePass123!
3. Haz clic en "Iniciar Sesión"
4. Debes ver:
   ✓ Redirección a /dashboard
   ✓ Tu nombre en la pantalla
   ✓ Estado: "Pendiente" (formalización)
```

### Test 3: Ver Dashboard del Comerciante
```
En el dashboard debes ver:
✓ Bienvenida personalizada
✓ Estado de formalización: "Pendiente"
✓ 0 / 10 productos
✓ Botón "+ Nuevo Producto"
✓ Tabla vacía de productos
```

### Test 4: Crear Primer Producto
```
1. Haz clic en "+ Nuevo Producto"
2. Rellena:
   - Nombre: "Arroz Blanco 10kg"
   - Categoría: "Alimentos"
   - Precio: "45.50"
   - Stock: "100"
   - Descripción: "Arroz de primera calidad"
3. Haz clic en "Guardar Producto"
4. Debes ver:
   ✓ Mensaje de éxito
   ✓ Redirección al dashboard
   ✓ Contador: 1 / 10 productos
```

### Test 5: Ver Catálogo Público
```
1. Abre: http://localhost:3000/catalogo (sin estar logineado)
2. Debes ver:
   ✓ Lista de productos
   ✓ Búsqueda por nombre
   ✓ Filtro por categoría
   ✓ Nombre del comerciante
   ✓ Ubicación del puesto
```

---

## Alternativa: Crear Usuarios Directamente en Supabase (Si Prefieres)

Si no quieres desabilitar email confirmations, puedes:

1. **Ve a Supabase Console**
   - Authentication → Users

2. **Haz clic en "Add user"**
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Tick "Auto Confirm User"

3. **Obten el user_id**
   - Copia el UUID del usuario

4. **Crea el comerciante en la BD**
   - Ve a SQL Editor
   - Ejecuta:
   ```sql
   INSERT INTO comerciantes (
     user_id, nombre_completo, nombre_negocio, email, 
     telefono, ubicacion, estado
   ) VALUES (
     'USER_UUID_HERE',  -- Reemplaza con el UUID real
     'Juan García',
     'García Mayorista', 
     'test@example.com',
     '+51987654321',
     'Lima, Perú',
     'Aprobado'  -- Usa Aprobado para que aparezca en catálogo
   );
   ```
   - Ejecuta la query

5. **Ahora puedes loginearte**
   - Email: `test@example.com`
   - Password: `TestPass123!`

---

## Troubleshooting

### "No puedo registrarme"
- **Verificar:** ¿Email confirmations está deshabilitado?
- **Solución:** Ve a Authentication → Providers → Email → Desabilita "Confirm email"

### "Me logineé pero el dashboard está vacío"
- **Verificar:** ¿Existe un comerciante en la BD con ese user_id?
- **Solución:** 
  ```sql
  -- Verifica que existe el comerciante
  SELECT * FROM comerciantes WHERE email = 'tu.email@example.com';
  ```

### "El catálogo no muestra productos"
- **Verificar:** ¿El comerciante tiene estado 'Aprobado'?
- **Solución:**
  ```sql
  -- Actualiza el estado
  UPDATE comerciantes SET estado = 'Aprobado' WHERE email = 'tu.email@example.com';
  ```

### "Obtengo error 429 (Rate Limit)"
- **Causa:** Demasiados intentos de signup
- **Solución:** Espera 15 minutos y vuelve a intentar

---

## Estado Actual del MVP

| Componente | Estado | Notas |
|-----------|--------|-------|
| Landing Page | ✅ Funciona | `/inicio` muestra hermoso hero |
| Catálogo Público | ✅ Funciona | `/catalogo` muestra productos aprobados |
| Registro | ⚠️ Bloqueado | Necesita desabilitar email verification |
| Login | ⚠️ Bloqueado | Depende del registro |
| Dashboard | ✅ Protegido | Redirige a login si no hay sesión |
| Productos CRUD | ✅ Funciona | Una vez logineado |
| Database Schema | ✅ Completo | 3 tablas con RLS |

---

## Próximos Pasos Después de Verificar Todo

1. ✅ Crear al menos 2 comerciantes de prueba (1 Aprobado, 1 Pendiente)
2. ✅ Crear 5+ productos para Aprobados
3. ✅ Probar búsqueda y filtros en catálogo
4. ✅ Verificar que solo puedes editar tus propios productos
5. 🚀 Preparar para presentación en examen académico
