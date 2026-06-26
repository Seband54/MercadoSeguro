'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">MercadoSeguro</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Inicia Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90">
                Regístrate
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
          Formaliza tu negocio mayorista digitalmente
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
          En Perú, muchos comerciantes mayoristas operan sin formalización.
          MercadoSeguro te ayuda a registrarte oficialmente y ganar visibilidad
          en una plataforma transparente, accesible y segura.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Registrar Comerciante
            </Button>
          </Link>
          <Link href="/catalogo" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Explorar Catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="bg-card rounded-xl max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16 shadow-sm border border-border">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">El Problema</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold">✗</span>
                <span>Comerciantes operan informalmente</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✗</span>
                <span>Falta de transparencia y confianza</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✗</span>
                <span>Acceso limitado a mercados formales</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✗</span>
                <span>Dificultad para crecer y escalar</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-4">La Solución</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Registro digital simple y accesible</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Catálogo público de comerciantes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Gestión de productos en línea</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Mayor visibilidad y oportunidades</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
        <h3 className="text-3xl font-bold text-foreground text-center mb-12">
          Características de MercadoSeguro
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h4 className="text-lg font-bold text-primary mb-3">
              Para Comerciantes
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Registro e inicio de sesión seguro</li>
              <li>• Seguimiento de estado de formalización</li>
              <li>• Gestión de hasta 10 productos</li>
              <li>• Dashboard intuitivo</li>
              <li>• Visibilidad en el catálogo público</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h4 className="text-lg font-bold text-primary mb-3">
              Para Compradores
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Catálogo centralizado de comerciantes</li>
              <li>• Búsqueda por nombre de producto</li>
              <li>• Filtrado por categoría</li>
              <li>• Información de comerciantes verificados</li>
              <li>• Acceso transparente a precios</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Freemium Section */}
      <section className="bg-muted/40 rounded-xl max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16 border border-border">
        <h3 className="text-2xl font-bold text-foreground text-center mb-12">
          Planes Disponibles
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-8 border-2 border-primary">
            <h4 className="text-xl font-bold text-primary mb-2">
              Plan Gratuito
            </h4>
            <p className="text-muted-foreground text-sm mb-6">
              Ideal para comenzar
            </p>
            <ul className="space-y-3 mb-8 text-sm text-foreground">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Hasta 10 productos</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Dashboard de comerciante</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Acceso al catálogo</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Seguimiento de formalización</span>
              </li>
            </ul>
            <p className="text-2xl font-bold text-primary">
              $0<span className="text-sm text-muted-foreground">/mes</span>
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border-2 border-secondary opacity-60">
            <h4 className="text-xl font-bold text-secondary mb-2">
              Plan Premium
            </h4>
            <p className="text-muted-foreground text-sm mb-6">
              Próximamente
            </p>
            <ul className="space-y-3 mb-8 text-sm text-foreground">
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Productos ilimitados</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Comerciante verificado</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Mayor visibilidad</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Análisis y reportes</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground font-semibold">
              Disponible pronto
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            MercadoSeguro © 2024. Formalizando el comercio mayorista en Perú.
          </p>
        </div>
      </footer>
    </div>
  )
}
