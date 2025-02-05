"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Recipe {
  _id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions?: string;
  userId: string;
}

export default function EditRecipePage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const recipeId = params.id;

  // 1. If not logged in, redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. Fetch existing recipe
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await res.json();
        const r = data.recipe;
        
        setTitle(r.title);
        setDescription(r.description || "");
        setIngredients(r.ingredients.join(", "));
        setInstructions(r.instructions || "");
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (status === "authenticated") {
      fetchRecipe();
    }
  }, [recipeId, status]);

  // 3. Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const ingArray = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          ingredients: ingArray,
          instructions,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update recipe.");
      }

      // Redirect to the recipe detail page
      router.push(`/recipes/${recipeId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Ingredients</label>
          <small className="block text-gray-500 mb-1">
            Separate by commas (e.g. "carrots, celery, onions").
          </small>
          <textarea
            className="w-full border rounded p-2"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Instructions</label>
          <textarea
            className="w-full border rounded p-2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
}