// src/app/api/recipes/[id]/route.ts
import { connectToDB } from '@/lib/db'
import Recipe from '@/models/Recipe'
import { NextResponse } from 'next/server'

interface Params {
  params: {
    id: string
  }
}

// GET a single recipe by ID
export async function GET(request: Request, { params }: Params) {
  try {
    await connectToDB()
    const recipe = await Recipe.findById(params.id)
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    return NextResponse.json({ recipe }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}