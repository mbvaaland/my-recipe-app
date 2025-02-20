"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// 1) Interface now includes `imageUrl?: string;`
interface Recipe {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions?: string;
  userId: string;
  imageUrl?: string; // <-- new field
}

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();
  const params = useParams(); 
  const recipeId = params.id;

  // Grab session to check ownership
  const { data: session, status } = useSession();

  // Fetch the recipe details
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch recipe.");
        }
        const data = await res.json();
        setRecipe(data.recipe);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchRecipe();
  }, [recipeId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Show a loading message while fetching the recipe or session is loading
  if (!recipe || status === "loading") {
    return <p>Loading recipe...</p>;
  }

  // Check if the logged-in user owns this recipe
  const isOwner = session?.user._id === recipe.userId;

  // 2) Display the image if `imageUrl` is present
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>

      {/* Render recipe image if it exists */}
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full max-w-lg rounded mb-4"
        />
      )}

      <p className="text-gray-700 mb-4">{recipe.description}</p>
      
      <h2 className="text-lg font-semibold">Ingredients</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold">Instructions</h2>
      <p className="mb-4">{recipe.instructions}</p>

      {/* Edit/Delete buttons only if user is the owner */}
      {isOwner && (
        <>
          <button
            onClick={() => router.push(`/recipes/${recipeId}/edit`)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              const confirmed = confirm("Are you sure you want to delete this recipe?");
              if (!confirmed) return;
              
              try {
                const res = await fetch(`/api/recipes/${recipeId}`, {
                  method: "DELETE",
                });
                if (!res.ok) {
                  const data = await res.json();
                  throw new Error(data.error || "Failed to delete recipe.");
                }
                router.push("/recipes");
              } catch (err: any) {
                setError(err.message);
              }
            }}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}