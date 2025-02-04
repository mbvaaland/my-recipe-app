// src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    await connectToDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 })
    }

    // Create a new user
    const newUser = await User.create({ name, email, password })

    // Return success
    return NextResponse.json({ ok: true, user: newUser }, { status: 201 })
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}