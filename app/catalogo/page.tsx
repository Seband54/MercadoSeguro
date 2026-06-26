import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { productCategories } from '@/lib/validation'
import { getPublicCatalogProducts } from '@/lib/db'
import { CatalogContent } from '@/components/catalog/CatalogContent'

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

async function CatalogData({
  searchTerm,
  selectedCategory,
}: {
  searchTerm?: string
  selectedCategory?: string
}) {
  const products = await getPublicCatalogProducts(searchTerm, selectedCategory)
  return products
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const searchTerm = params.q || ''
  const selectedCategory = params.categoria || ''

  async function filterProducts(formData: FormData) {
    'use server'
    // This is handled by URL parameters for server-side filtering
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/inicio" className="text-2xl font-bold text-primary">
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

      {/* Filters & Content */}
      <Suspense fallback={<div className="text-center py-12">Cargando catálogo...</div>}>
        <CatalogContent
          initialProducts={await getPublicCatalogProducts(searchTerm, selectedCategory)}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          productCategories={productCategories}
        />
      </Suspense>

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
