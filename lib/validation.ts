import { z } from 'zod'

export const registerSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, 'Nombre completo debe tener al menos 3 caracteres')
    .max(255, 'Nombre completo muy largo'),
  nombreNegocio: z
    .string()
    .min(3, 'Nombre del negocio debe tener al menos 3 caracteres')
    .max(255, 'Nombre del negocio muy largo'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres'),
  telefono: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(20, 'Teléfono inválido'),
  ubicacion: z
    .string()
    .min(3, 'Ubicación debe tener al menos 3 caracteres')
    .max(255, 'Ubicación muy larga'),
})

export type RegisterForm = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type LoginForm = z.infer<typeof loginSchema>

export const productSchema = z.object({
  nombre: z
    .string()
    .min(3, 'Nombre debe tener al menos 3 caracteres')
    .max(255, 'Nombre muy largo'),
  categoria: z
    .string()
    .min(1, 'Categoría requerida'),
  precio: z
    .number()
    .positive('Precio debe ser positivo')
    .finite('Precio inválido'),
  stock: z
    .number()
    .int('Stock debe ser un número entero')
    .nonnegative('Stock no puede ser negativo'),
  descripcion: z
    .string()
    .max(1000, 'Descripción muy larga')
    .optional()
    .default(''),
})

export type ProductForm = z.infer<typeof productSchema>

export const productCategories = [
  'Alimentos',
  'Textiles',
  'Electrónica',
  'Herramientas',
  'Bebidas',
  'Cosméticos',
  'Hogar',
  'Otro',
] as const

export type ProductCategory = typeof productCategories[number]
