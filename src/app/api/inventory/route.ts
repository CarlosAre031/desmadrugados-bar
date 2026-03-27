import { NextRequest, NextResponse } from 'next/server'
import { getInventoryDB, saveInventoryDB } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const inventory = await getInventoryDB()
    return NextResponse.json(inventory)
  } catch (error) {
    console.error('Error getting inventory:', error)
    return NextResponse.json({ error: 'Error al obtener inventario' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const data = await req.json()
    await saveInventoryDB(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving inventory:', error)
    return NextResponse.json({ error: 'Error al guardar inventario' }, { status: 500 })
  }
}
