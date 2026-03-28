import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isMongoDBConfigured } from '@/lib/mongodb'
import { Upload } from '@/lib/models'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: 'MongoDB no configurado' }, { status: 500 })
  }

  try {
    await connectDB()
    const upload = await Upload.findById(id)

    if (!upload) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    const buffer = Buffer.from(upload.data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': upload.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Error al cargar imagen' }, { status: 500 })
  }
}
