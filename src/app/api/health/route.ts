import { NextResponse } from 'next/server'
import { connectDB, isMongoDBConfigured } from '@/lib/mongodb'

export async function GET() {
  const result: Record<string, unknown> = {
    mongoConfigured: isMongoDBConfigured(),
    mongoUriExists: !!process.env.MONGODB_URI,
    mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 30) + '...',
  }

  if (isMongoDBConfigured()) {
    try {
      const mongoose = await connectDB()
      result.connected = true
      result.readyState = mongoose.connection.readyState
      // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      result.dbName = mongoose.connection.db?.databaseName
    } catch (error) {
      result.connected = false
      result.error = error instanceof Error ? error.message : String(error)
    }
  }

  return NextResponse.json(result)
}
