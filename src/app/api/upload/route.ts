import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { connectDB, isMongoDBConfigured } from '@/lib/mongodb'
import { Upload } from '@/lib/models'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: 'MongoDB no configurado. Las imágenes requieren MongoDB.' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'El archivo es demasiado grande (máx 5MB)' }, { status: 400 })
  }

  try {
    await connectDB()

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `upload-${Date.now()}.${ext}`

    const upload = await Upload.create({
      filename,
      contentType: file.type,
      data: base64,
    })

    return NextResponse.json({ url: `/api/images/${upload._id}` })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
