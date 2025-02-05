// src/app/api/recipes/[id]/route.ts

import { connectToDB } from '@/lib/db'
import Recipe from '@/models/Recipe'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

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

export async function PATCH(request: Request, { params }: Params) {
  try {
    // 1. Check auth
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse JSON
    const { title, description, ingredients, instructions } = await request.json()

    // 3. Connect to DB
    await connectToDB()

    // 4. Find recipe
    const recipe = await Recipe.findById(params.id)
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // 5. Check ownership
    if (recipe.userId !== session.user._id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 6. Update fields
    if (title !== undefined) recipe.title = title
    if (description !== undefined) recipe.description = description
    if (ingredients !== undefined) recipe.ingredients = ingredients
    if (instructions !== undefined) recipe.instructions = instructions

    // 7. Save
    await recipe.save()

    return NextResponse.json({ recipe }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating recipe:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDB()
    const recipe = await Recipe.findById(params.id)
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    // Check ownership
    if (recipe.userId !== session.user._id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await recipe.deleteOne()

    return NextResponse.json({ message: 'Recipe deleted' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}