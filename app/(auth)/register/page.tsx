'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUp } from '@/app/(auth)/actions'
import toast from 'react-hot-toast'

interface FormData {
  nombreCompleto: string
  nombreNegocio: string
  email: string
  password: string
  telefono: string
  ubicacion: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    nombreNegocio: '',
    email: '',
    password: '',
    telefono: '',
    ubicacion: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signUp(formData)

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success(result.message || 'Registro completado')
        setFormData({
          nombreCompleto: '',
          nombreNegocio: '',
          email: '',
          password: '',
          telefono: '',
          ubicacion: '',
        })
        
        // Redirect after a brief delay
        setTimeout(() => {
          if (result.redirectToDashboard) {
            router.push('/dashboard')
          } else {
            router.push('/login')
          }
        }, 1500)
      }
    } catch (error) {
      toast.error('Error durante el registro')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              MercadoSeguro
            </h1>
            <p className="text-muted-foreground">
              Formaliza tu negocio mayorista
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-foreground mb-1">
                Nombre Completo
              </label>
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombreCompleto}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="nombreNegocio" className="block text-sm font-medium text-foreground mb-1">
                Nombre del Negocio
              </label>
              <Input
                id="nombreNegocio"
                name="nombreNegocio"
                type="text"
                placeholder="Mi Negocio Mayorista"
                value={formData.nombreNegocio}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-1">
                Teléfono
              </label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+51 999 999 999"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-foreground mb-1">
                Ubicación
              </label>
              <Input
                id="ubicacion"
                name="ubicacion"
                type="text"
                placeholder="Lima, Perú"
                value={formData.ubicacion}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
