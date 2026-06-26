import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  getMerchantByUserId,
  getMerchantFormalizationStatus,
  getMerchantProducts,
} from '@/lib/db'
import { Button } from '@/components/ui/button'
import { FormalizationStatusCard } from '@/components/dashboard/FormalizationStatusCard'
import { ProductList } from '@/components/dashboard/ProductList'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get merchant data
  const merchant = await getMerchantByUserId(user.id)

  if (!merchant) {
    redirect('/login')
  }

  // Get formalization status
  const solicitud = await getMerchantFormalizationStatus(merchant.id)

  if (!solicitud) {
    redirect('/login')
  }

  // Get products
  const products = await getMerchantProducts(merchant.id)
  const maxProducts = 10
  const canAddMore = products.length < maxProducts

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Bienvenido, {merchant.nombre_completo}!
        </h1>
        <p className="text-muted-foreground">
          {merchant.nombre_negocio} • {merchant.ubicacion}
        </p>
      </div>

      {/* Status Card */}
      <FormalizationStatusCard
        estado={solicitud.estado as 'Pendiente' | 'Aprobada' | 'Rechazada'}
        createdAt={solicitud.created_at}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">
            Estado de Formalización
          </p>
          <p className="text-2xl font-bold text-foreground">
            {solicitud.estado}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">
            Productos Publicados
          </p>
          <p className="text-2xl font-bold text-foreground">
            {products.length} / {maxProducts}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground mb-1">
            Estado Comerciante
          </p>
          <p className="text-2xl font-bold text-primary">
            {merchant.estado}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-card rounded-lg border border-border p-8">
        <ProductList
          products={products}
          maxProducts={maxProducts}
          canAddMore={canAddMore}
        />
      </div>

      {/* Additional Info */}
      {solicitud.estado === 'Aprobada' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-2">
            Tu comerciante está verificado
          </h3>
          <p className="text-sm text-green-800 mb-4">
            Tus productos ahora son visibles en el catálogo público. Los
            compradores pueden encontrarte y ver tus productos.
          </p>
          <Link href="/catalogo">
            <Button variant="outline" size="sm">
              Ver catálogo público
            </Button>
          </Link>
        </div>
      )}

      {solicitud.estado === 'Pendiente' && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">
            Solicitud en revisión
          </h3>
          <p className="text-sm text-yellow-800">
            Puedes comenzar a agregar productos mientras tu solicitud de
            formalización está en revisión. Serán visibles en el catálogo una
            vez que seas aprobado.
          </p>
        </div>
      )}
    </div>
  )
}
