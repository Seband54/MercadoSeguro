'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { productCategories } from '@/lib/validation'
import { getPublicCatalogProducts } from '@/lib/db'

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

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const data = await getPublicCatalogProducts(searchTerm, selectedCategory)
        setProducts(data)
      } catch (error) {
        console.error('Error loading catalog:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      loadProducts()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])

  const filteredCount = products.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            MercadoSeguro
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Inicia Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground">
            Explora productos de comerciantes verificados
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
          {isLoading ? (
            'Cargando productos...'
          ) : filteredCount === 0 ? (
            'No hay productos disponibles'
          ) : (
            <>
              Se encontraron <span className="font-semibold">{filteredCount}</span>{' '}
              producto{filteredCount !== 1 ? 's' : ''}
            </>
          )}
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        ) : filteredCount === 0 ? (
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
            {products.map((product) => (
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

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            MercadoSeguro © 2024. Formalizando el comercio mayorista en Perú.
          </p>
        </div>
      </footer>
    </div>
  )
}
