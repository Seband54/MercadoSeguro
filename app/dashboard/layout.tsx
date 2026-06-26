import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { getMerchantByUserId } from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For MVP demo: Use hardcoded test merchant (REMOVE IN PRODUCTION)
  // In production, this should check auth and get actual user merchant
  const testMerchantId = '550e8400-e29b-41d4-a716-446655440088'
  const testMerchantName = 'Demo Comerciante'

  // TODO: Restore auth protection before deploying to production
  // Uncomment these lines:
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')
  // const merchant = await getMerchantByUserId(user.id)
  // if (!merchant) redirect('/login')

  return (
    <>
      <DashboardHeader merchantName={testMerchantName} />
      <main className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  )
}
