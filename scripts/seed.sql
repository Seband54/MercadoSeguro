-- MercadoSeguro Seed Data
-- Ejecuta este script en el Supabase SQL Editor para cargar datos de prueba
-- Advertencia: Este script LIMPIA las tablas existentes para evitar conflictos

-- 1. Limpiar datos existentes (opcional, comenta si quieres preservar)
TRUNCATE TABLE productos CASCADE;
TRUNCATE TABLE solicitudes CASCADE;
TRUNCATE TABLE comerciantes CASCADE;

-- 2. Insertar comerciantes de prueba
-- Nota: Los user_id aquí son de ejemplo. En producción, vinvularlos con auth.users reales
INSERT INTO comerciantes (id, user_id, nombre_completo, nombre_negocio, email, telefono, ubicacion, estado, created_at)
VALUES
  (
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'user1-uuid-here', -- Reemplazar con UUID real de auth.users
    'Juan Pérez López',
    'Distribuidora Peruana',
    'juan@distribuidora.com',
    '+51 999 123 456',
    'Lima, Perú',
    'Aprobado',
    NOW() - INTERVAL '30 days'
  ),
  (
    'b2c3d4e5-f6a7-48b9-0c1d-2e3f4a5b6c7d',
    'user2-uuid-here', -- Reemplazar con UUID real de auth.users
    'María García Rodríguez',
    'Comercio García & Cia',
    'maria@comercio-garcia.com',
    '+51 999 234 567',
    'Arequipa, Perú',
    'Pendiente',
    NOW() - INTERVAL '15 days'
  ),
  (
    'c3d4e5f6-a7b8-49ca-1d2e-3f4a5b6c7d8e',
    'user3-uuid-here', -- Reemplazar con UUID real de auth.users
    'Carlos Mendoza Silva',
    'Negocio Mendoza',
    'carlos@negociomendoza.com',
    '+51 999 345 678',
    'Trujillo, Perú',
    'Rechazado',
    NOW() - INTERVAL '5 days'
  );

-- 3. Insertar solicitudes de formalización
INSERT INTO solicitudes (id, comerciante_id, tipo, estado, observacion, created_at)
VALUES
  (
    'd4e5f6a7-b8c9-50db-2e3f-4a5b6c7d8e9f',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Formalización',
    'Aprobada',
    'Documentación completa y verificada',
    NOW() - INTERVAL '25 days'
  ),
  (
    'e5f6a7b8-c9da-51ec-3f4a-5b6c7d8e9f0a',
    'b2c3d4e5-f6a7-48b9-0c1d-2e3f4a5b6c7d',
    'Formalización',
    'Pendiente',
    NULL,
    NOW() - INTERVAL '10 days'
  ),
  (
    'f6a7b8c9-daeb-52fd-4a5b-6c7d8e9f0a1b',
    'c3d4e5f6-a7b8-49ca-1d2e-3f4a5b6c7d8e',
    'Formalización',
    'Rechazada',
    'Documentación incompleta - Contactar para más info',
    NOW() - INTERVAL '2 days'
  );

-- 4. Insertar productos para el comerciante APROBADO
INSERT INTO productos (id, comerciante_id, nombre, categoria, precio, stock, descripcion, created_at)
VALUES
  (
    '01a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Arroz Integral 5kg',
    'Alimentos',
    25.50,
    100,
    'Arroz integral de alta calidad, cultivado en la región de la costa',
    NOW() - INTERVAL '20 days'
  ),
  (
    '02b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Aceite de Oliva Extra Virgen',
    'Alimentos',
    45.00,
    50,
    'Aceite de oliva extra virgen, primera presión en frío',
    NOW() - INTERVAL '18 days'
  ),
  (
    '03c4d5e6-f7a8-49ba-c1d2-e3f4a5b6c7d8',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Harina de Trigo Premium',
    'Alimentos',
    15.75,
    200,
    'Harina de trigo de alta proteína, ideal para panificación',
    NOW() - INTERVAL '16 days'
  ),
  (
    '04d5e6f7-a8b9-50cb-d2e3-f4a5b6c7d8e9',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Azúcar Blanca Refinada',
    'Alimentos',
    12.50,
    150,
    'Azúcar blanca refinada, 100% pura',
    NOW() - INTERVAL '14 days'
  ),
  (
    '05e6f7a8-b9ca-51dc-e3f4-a5b6c7d8e9f0',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Tela de Algodón 100% Natural',
    'Textiles',
    8.50,
    300,
    'Tela de algodón para confecciones, ancho 1.5m',
    NOW() - INTERVAL '12 days'
  ),
  (
    '06f7a8b9-cad0-52ed-f4a5-b6c7d8e9f0a1',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'LED Bulb 10W - Blanco Frío',
    'Electrónica',
    12.00,
    500,
    'Bombilla LED 10W, 6500K luz blanca fría, bajo consumo',
    NOW() - INTERVAL '10 days'
  ),
  (
    '07a8b9ca-daeb-53fe-a5b6-c7d8e9f0a1b2',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Cable HDMI 2.0 - 3 metros',
    'Electrónica',
    18.50,
    75,
    'Cable HDMI versión 2.0, 3 metros, blindado',
    NOW() - INTERVAL '8 days'
  ),
  (
    '08b9cadb-ebf0-540f-b6c7-d8e9f0a1b2c3',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Martillo de Carpintero 2kg',
    'Herramientas',
    35.00,
    25,
    'Martillo de carpintero profesional, cabeza de acero templado',
    NOW() - INTERVAL '6 days'
  ),
  (
    '09cadcec-fcf1-5510-c7d8-e9f0a1b2c3d4',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Juego de Destornilladores 8 pcs',
    'Herramientas',
    28.50,
    40,
    'Set de 8 destornilladores variados, mangos ergonómicos',
    NOW() - INTERVAL '4 days'
  ),
  (
    '0acdbdfd-edg2-5621-d8e9-f0a1b2c3d4e5',
    'a1b2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
    'Jugo Natural de Naranja 1L',
    'Bebidas',
    5.50,
    200,
    'Jugo de naranja 100% natural, recién exprimido, sin conservantes',
    NOW() - INTERVAL '2 days'
  );

-- 5. Insertar productos para el comerciante PENDIENTE (para demostrar que NO aparecen en catálogo)
INSERT INTO productos (id, comerciante_id, nombre, categoria, precio, stock, descripcion, created_at)
VALUES
  (
    '0bcecefe-feh3-5732-e9f0-a1b2c3d4e5f6',
    'b2c3d4e5-f6a7-48b9-0c1d-2e3f4a5b6c7d',
    'Pantalón Jeans Premium',
    'Textiles',
    65.00,
    80,
    'Pantalón jeans premium, 100% algodón',
    NOW() - INTERVAL '10 days'
  ),
  (
    '0cdfdfff-ffi4-5843-f0a1-b2c3d4e5f6g7',
    'b2c3d4e5-f6a7-48b9-0c1d-2e3f4a5b6c7d',
    'Camisa Social Blanca M',
    'Textiles',
    45.00,
    120,
    'Camisa social blanca, talla M, algodón 100%',
    NOW() - INTERVAL '8 days'
  );

-- 6. Verificación
-- Ejecuta estos queries para verificar que todo se cargó correctamente:
-- SELECT COUNT(*) as total_comerciantes FROM comerciantes;
-- SELECT COUNT(*) as total_solicitudes FROM solicitudes;
-- SELECT COUNT(*) as total_productos FROM productos;
-- SELECT * FROM comerciantes WHERE estado='Aprobado';
-- SELECT p.nombre, c.nombre_negocio FROM productos p
--   JOIN comerciantes c ON p.comerciante_id = c.id
--   WHERE c.estado='Aprobado';

-- Notas Importantes:
-- 1. IMPORTANTE: Los valores de user_id son placeholders.
--    Debes reemplazarlos con los UUIDs reales de los usuarios en auth.users.
--
-- 2. Para obtener UUIDs reales de auth.users:
--    - Crea usuarios via /register en la aplicación
--    - O, en SQL: SELECT id, email FROM auth.users;
--
-- 3. Este seed está diseñado para que:
--    - Comerciante APROBADO: Sus productos son visibles en /catalogo
--    - Comerciante PENDIENTE: Sus productos NO son visibles en /catalogo
--    - Comerciante RECHAZADO: Sus productos NO son visibles en /catalogo
--
-- 4. Para reset completo: TRUNCATE TABLE productos, solicitudes, comerciantes CASCADE;
