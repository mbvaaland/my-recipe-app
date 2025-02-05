// src/app/api/recipes/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import Recipe from '@/models/Recipe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// CREATE a recipe
export async function POST(req: Request) {
  try {
    // 1. Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse the request body
    const { title, description, ingredients, instructions } = await req.json()

    // 3. Connect to DB
    await connectToDB()

    // 4. Create recipe document
    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      // userId from session
      userId: session.user._id,
    })

    // 5. Return success
    return NextResponse.json({ recipe: newRecipe }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating recipe:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
    try {
      await connectToDB()
      const recipes = await Recipe.find().sort({ createdAt: -1 })
      return NextResponse.json({ recipes }, { status: 200 })
    } catch (error: any) {
      console.error('Error fetching recipes:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }