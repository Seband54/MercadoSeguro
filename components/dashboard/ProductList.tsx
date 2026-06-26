'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DeleteProductButton } from './DeleteProductButton'

interface Product {
  id: string
  nombre: string
  categoria: string
  precio: number
  stock: number
}

interface ProductListProps {
  products: Product[]
  maxProducts: number
  canAddMore: boolean
}

export function ProductList({
  products,
  maxProducts,
  canAddMore,
}: ProductListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Mis Productos
          </h3>
          <p className="text-sm text-muted-foreground">
            {products.length} de {maxProducts} productos publicados
          </p>
        </div>
        <Link href="/dashboard/productos/nuevo">
          <Button
            disabled={!canAddMore}
            className="bg-primary hover:bg-primary/90"
          >
            + Nuevo Producto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-12 text-center border-2 border-dashed border-border">
          <p className="text-muted-foreground mb-4">
            Aún no has publicado productos
          </p>
          <Link href="/dashboard/productos/nuevo">
            <Button className="bg-primary hover:bg-primary/90">
              Agregar tu primer producto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Nombre
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Categoría
                </th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">
                  Precio
                </th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">
                  Stock
                </th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-muted/50 transition"
                >
                  <td className="py-3 px-4 text-foreground">{product.nombre}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {product.categoria}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground font-medium">
                    S/ {product.precio.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground">
                    {product.stock}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    <Link
                      href={`/dashboard/productos/${product.id}/editar`}
                    >
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!canAddMore && products.length >= maxProducts && (
        <div className="mt-6 bg-secondary/10 border border-secondary rounded-lg p-4">
          <p className="text-sm text-secondary-foreground">
            Has alcanzado el límite de {maxProducts} productos en el plan
            Gratuito.{' '}
            <span className="font-semibold">
              Upgrade a Plan Premium para publicar más productos.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
