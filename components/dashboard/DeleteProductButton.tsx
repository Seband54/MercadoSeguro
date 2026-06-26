'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { deleteProduct } from '@/lib/db'

interface DeleteProductButtonProps {
  productId: string
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      toast.success('Producto eliminado')
      router.refresh()
    } catch (error) {
      toast.error('Error al eliminar producto')
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Confirmar'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => setIsConfirming(true)}
    >
      Eliminar
    </Button>
  )
}
