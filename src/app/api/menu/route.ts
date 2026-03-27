import { NextRequest, NextResponse } from 'next/server'
import { getMenuDB, saveMenuDB } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    const menu = await getMenuDB()
    return NextResponse.json(menu)
  } catch (error) {
    console.error('Error getting menu:', error)
    return NextResponse.json({ error: 'Error al obtener menú' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const data = await req.json()
    await saveMenuDB(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving menu:', error)
    return NextResponse.json({ error: 'Error al guardar menú' }, { status: 500 })
  }
}
