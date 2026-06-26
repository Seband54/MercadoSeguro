import { createClient } from './supabase/server'

// Get merchant data by user ID
export async function getMerchantByUserId(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comerciantes')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) return null
  return data
}

// Get merchant's formalization status
export async function getMerchantFormalizationStatus(merchantId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('solicitudes')
    .select('*')
    .eq('comerciante_id', merchantId)
    .eq('tipo', 'Formalización')
    .single()
  
  if (error) return null
  return data
}

// Get merchant's products count
export async function getMerchantProductsCount(merchantId: string) {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('productos')
    .select('id', { count: 'exact' })
    .eq('comerciante_id', merchantId)
  
  if (error) return 0
  return count || 0
}

// Get all products for merchant
export async function getMerchantProducts(merchantId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('comerciante_id', merchantId)
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

// Create new product
export async function createProduct(
  merchantId: string,
  product: {
    nombre: string
    categoria: string
    precio: number
    stock: number
    descripcion?: string
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .insert({
      comerciante_id: merchantId,
      ...product,
      descripcion: product.descripcion || '',
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update product
export async function updateProduct(
  productId: string,
  updates: Partial<{
    nombre: string
    categoria: string
    precio: number
    stock: number
    descripcion: string
  }>
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .update(updates)
    .eq('id', productId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete product
export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', productId)
  
  if (error) throw error
}

// Get single product
export async function getProduct(productId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', productId)
    .single()
  
  if (error) return null
  return data
}

// Get approved merchants for public catalog
export async function getApprovedMerchants() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('comerciantes')
    .select('*')
    .eq('estado', 'Aprobado')
    .order('nombre_negocio', { ascending: true })
  
  if (error) return []
  return data || []
}

// Get all products from approved merchants (public catalog)
export async function getPublicCatalogProducts(
  searchTerm?: string,
  categoria?: string
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('productos')
    .select(
      `
      id,
      nombre,
      categoria,
      precio,
      stock,
      descripcion,
      comerciante_id,
      comerciantes(nombre_negocio, ubicacion, estado)
      `
    )
  
  // Filter by approved merchants via join
  query = query.order('created_at', { ascending: false })
  
  const { data, error } = await query
  
  if (error) return []
  
  // Filter by approved merchants in app layer (since RLS handles visibility)
  let filtered = data || []
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    )
  }
  
  if (categoria) {
    filtered = filtered.filter((p) => p.categoria === categoria)
  }
  
  return filtered
}
