// src/models/Recipe.ts

import mongoose, { Schema, Model, Document } from 'mongoose'

interface IRecipe extends Document {
  title: string
  description: string
  ingredients: string[]
  instructions: string
  // Optional: user relationship
  userId: string

  imageUrl?: string
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: '' },
    // userId helps link this recipe to a user (owner)
    userId: { type: String, required: true },

    imageUrl: {type: String },
  },
  { timestamps: true }
)

let Recipe: Model<IRecipe>
try {
  Recipe = mongoose.model<IRecipe>('Recipe')
} catch {
  Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema)
}

export default Recipe