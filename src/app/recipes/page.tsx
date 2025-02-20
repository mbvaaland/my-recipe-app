"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions?: string;
  userId: string;
  imageUrl?: string; // <-- Add imageUrl if not already in your interface
}

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");
        if (!res.ok) {
          throw new Error("Failed to fetch recipes.");
        }
        const data = await res.json();
        setRecipes(data.recipes);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchRecipes();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">All Recipes</h1>
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <Link
              href={`/recipes/${recipe._id}`}
              className="block border p-4 rounded hover:bg-gray-50 transition"
            >
              {/** 1) Show partial image if available */}
              {recipe.imageUrl && (
                <div className="w-full h-32 overflow-hidden rounded mb-2">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              {recipe.description && (
                <p className="text-gray-700">{recipe.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                By User: {recipe.userId}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}