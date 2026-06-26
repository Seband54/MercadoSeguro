'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/(auth)/actions'

interface DashboardHeaderProps {
  merchantName: string
}

export function DashboardHeader({ merchantName }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold text-primary">
            MercadoSeguro
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              ¡Hola, {merchantName}!
            </p>
            <p className="text-xs text-muted-foreground">Comerciante</p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
