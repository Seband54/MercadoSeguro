'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Product {
  id: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  descripcion: string
  comerciante_id: string
  comerciantes: {
    nombre_negocio: string
    ubicacion: string
    estado: string
  }
}

export function CatalogContent({
  initialProducts,
  searchTerm,
  selectedCategory,
  productCategories,
}: {
  initialProducts: Product[]
  searchTerm: string
  selectedCategory: string
  productCategories: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('categoria', value)
    } else {
      params.delete('categoria')
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const filteredCount = initialProducts.length

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Buscar por nombre de producto..."
            defaultValue={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          defaultValue={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las categorías</option>
          {productCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results info */}
      <p className="text-sm text-muted-foreground mb-6">
        {filteredCount === 0
          ? 'No hay productos disponibles'
          : `Se encontraron ${filteredCount} producto${filteredCount !== 1 ? 's' : ''}`}
      </p>

      {/* Products Grid */}
      {filteredCount === 0 ? (
        <div className="bg-muted/40 rounded-lg p-12 text-center border-2 border-dashed border-border">
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory
              ? 'No hay productos que coincidan con tu búsqueda'
              : 'Aún no hay productos disponibles'}
          </p>
          {!searchTerm && !selectedCategory && (
            <p className="text-sm text-muted-foreground mb-6">
              Sé el primero en registrarte como comerciante
            </p>
          )}
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90">
              Registrar Comerciante
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {product.nombre}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded">
                    {product.categoria}
                  </span>
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                    Registrado
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.descripcion || 'Sin descripción'}
                </p>

                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-2xl font-bold text-primary">
                    S/ {product.precio.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </p>
                </div>

                <div className="bg-muted/40 rounded p-3">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {product.comerciantes.nombre_negocio}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📍 {product.comerciantes.ubicacion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
