interface FormalizationStatusCardProps {
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada'
  createdAt: string
}

export function FormalizationStatusCard({
  estado,
  createdAt,
}: FormalizationStatusCardProps) {
  const statusColors = {
    Pendiente: 'bg-yellow-50 border-yellow-200',
    Aprobada: 'bg-green-50 border-green-200',
    Rechazada: 'bg-red-50 border-red-200',
  }

  const statusTextColors = {
    Pendiente: 'text-yellow-900',
    Aprobada: 'text-green-900',
    Rechazada: 'text-red-900',
  }

  const statusBadgeColors = {
    Pendiente: 'bg-yellow-100 text-yellow-800',
    Aprobada: 'bg-green-100 text-green-800',
    Rechazada: 'bg-red-100 text-red-800',
  }

  const statusMessages = {
    Pendiente:
      'Tu solicitud está siendo revisada. Te notificaremos cuando haya actualizaciones.',
    Aprobada:
      '¡Felicidades! Tu comerciante ha sido verificado. Ahora puedes publicar productos.',
    Rechazada:
      'Tu solicitud fue rechazada. Contáctanos para más información.',
  }

  const date = new Date(createdAt).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className={`rounded-lg border-2 p-6 ${statusColors[estado]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${statusTextColors[estado]}`}>
          Estado de Formalización
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadgeColors[estado]}`}
        >
          {estado}
        </span>
      </div>
      <p className={`text-sm ${statusTextColors[estado]} mb-3`}>
        {statusMessages[estado]}
      </p>
      <p className={`text-xs ${statusTextColors[estado]}`}>
        Solicitado el {date}
      </p>
    </div>
  )
}
