import { NextRequest, NextResponse } from 'next/server'
import { getPromotionsDB, savePromotionsDB } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const promotions = await getPromotionsDB()
    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Error getting promotions:', error)
    return NextResponse.json({ error: 'Error al obtener promociones' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const data = await req.json()
    await savePromotionsDB(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving promotions:', error)
    return NextResponse.json({ error: 'Error al guardar promociones' }, { status: 500 })
  }
}
