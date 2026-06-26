'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { productSchema, productCategories } from '@/lib/validation'
import { createProduct, updateProduct } from '@/lib/db'

interface ProductFormProps {
  merchantId: string
  product?: {
    id: string
    nombre: string
    categoria: string
    precio: number
    stock: number
    descripcion: string
  }
  isEditing?: boolean
}

export function ProductForm({
  merchantId,
  product,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    categoria: product?.categoria || '',
    precio: product?.precio || 0,
    stock: product?.stock || 0,
    descripcion: product?.descripcion || '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate
      productSchema.parse({
        nombre: formData.nombre,
        categoria: formData.categoria,
        precio: formData.precio,
        stock: formData.stock,
        descripcion: formData.descripcion,
      })

      if (isEditing && product) {
        await updateProduct(product.id, formData)
        toast.success('Producto actualizado')
      } else {
        await createProduct(merchantId, formData)
        toast.success('Producto creado')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error al guardar producto')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
            Nombre del Producto
          </label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Arroz integral 5kg"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-foreground mb-2">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecciona una categoría</option>
            {productCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-foreground mb-2">
              Precio (S/)
            </label>
            <Input
              id="precio"
              name="precio"
              type="number"
              placeholder="0.00"
              value={formData.precio}
              onChange={handleChange}
              disabled={isLoading}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">
              Stock
            </label>
            <Input
              id="stock"
              name="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
              disabled={isLoading}
              step="1"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-foreground mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Describe tu producto aquí..."
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isLoading}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isLoading
            ? isEditing
              ? 'Actualizando...'
              : 'Creando...'
            : isEditing
              ? 'Actualizar Producto'
              : 'Crear Producto'}
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  )
}
