import { NextRequest, NextResponse } from 'next/server'
import { createToken, COOKIE_NAME } from '@/lib/auth'
import { getAdminPasswordDB, saveAdminPasswordDB } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = (await getAdminPasswordDB()).trim()
  if (password.trim() !== adminPassword) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = await createToken()

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  })

  return response
}

export async function PUT(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  if (newPassword.trim().length < 6) {
    return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 })
  }

  const adminPassword = (await getAdminPasswordDB()).trim()
  if (currentPassword.trim() !== adminPassword) {
    return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 401 })
  }

  // Save to MongoDB so it persists across deploys
  await saveAdminPasswordDB(newPassword.trim())

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
