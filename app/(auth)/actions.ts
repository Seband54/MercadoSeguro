'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registerSchema, loginSchema } from '@/lib/validation'

export async function signUp(formData: {
  nombreCompleto: string
  nombreNegocio: string
  email: string
  password: string
  telefono: string
  ubicacion: string
}) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(formData)
    console.log('[v0] Starting signup for:', validatedData.email)

    const supabase = await createClient()

    // 1. Create auth user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (authError) {
      console.error('[v0] Auth signup error:', authError)
      return {
        error: `Error de autenticación: ${authError.message}`,
      }
    }

    if (!authData.user) {
      console.error('[v0] No user created')
      return {
        error: 'No se pudo crear la cuenta',
      }
    }

    console.log('[v0] Auth user created:', authData.user.id)

    // 2. Create comerciante record using service role
    // The database trigger will auto-create the solicitud
    const { data: comerciante, error: comercianteError } = await supabase
      .from('comerciantes')
      .insert({
        user_id: authData.user.id,
        nombre_completo: validatedData.nombreCompleto,
        nombre_negocio: validatedData.nombreNegocio,
        email: validatedData.email,
        telefono: validatedData.telefono,
        ubicacion: validatedData.ubicacion,
        estado: 'Pendiente',
      })

    if (comercianteError) {
      console.error('[v0] Comerciante creation error:', comercianteError)
      // Don't fail - the user was created in auth
      return {
        success: true,
        message: 'Cuenta creada. Por favor inicia sesión.',
        requiresManualLogin: true,
      }
    }

    console.log('[v0] Comerciante created successfully')

    return {
      success: true,
      message: 'Registro completado. Redirigiendo...',
      redirectToDashboard: true,
    }
  } catch (error) {
    console.error('[v0] Signup error:', error)
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: 'Error durante el registro',
    }
  }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      return {
        error: error.message,
      }
    }

    if (!data.user) {
      return {
        error: 'No se pudo iniciar sesión',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: 'Error durante el inicio de sesión',
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
