import { NextRequest, NextResponse } from 'next/server'
import { getCarouselDB, saveCarouselDB } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const carousel = await getCarouselDB()
    return NextResponse.json(carousel)
  } catch (error) {
    console.error('Error getting carousel:', error)
    return NextResponse.json({ error: 'Error al obtener carrusel' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const data = await req.json()
    await saveCarouselDB(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving carousel:', error)
    return NextResponse.json({ error: 'Error al guardar carrusel' }, { status: 500 })
  }
}
