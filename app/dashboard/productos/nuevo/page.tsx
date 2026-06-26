import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMerchantByUserId, getMerchantProductsCount } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/dashboard/ProductForm'

export default async function NuevoProductoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const merchant = await getMerchantByUserId(user.id)

  if (!merchant) {
    redirect('/login')
  }

  // Check if merchant has reached the limit
  const productCount = await getMerchantProductsCount(merchant.id)
  if (productCount >= 10) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            ← Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Nuevo Producto
        </h1>
      </div>

      <ProductForm merchantId={merchant.id} isEditing={false} />
    </div>
  )
}
