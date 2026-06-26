import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMerchantByUserId, getProduct } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/dashboard/ProductForm'

interface ProductEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params

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

  const product = await getProduct(id)

  if (!product) {
    redirect('/dashboard')
  }

  // Verify ownership
  if (product.comerciante_id !== merchant.id) {
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
          Editar Producto
        </h1>
      </div>

      <ProductForm
        merchantId={merchant.id}
        product={product}
        isEditing={true}
      />
    </div>
  )
}
