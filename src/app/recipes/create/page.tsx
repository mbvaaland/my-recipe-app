"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CreateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // If session is still loading, you can show a spinner or placeholder
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert comma/line separated ingredients to array
      const ingArray = ingredients
        .split(",") // or split by new lines, etc.
        .map((item) => item.trim())
        .filter((item) => item);

      const res = await fetch("/api/recipes", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create recipe.");
      }

      // If successful, redirect to /recipes
      router.push("/recipes");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Recipe</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: My Delicious Soup"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A hearty soup with vegetables..."
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
            placeholder="carrots, celery, onions"
          />
        </div>

        <div>
          <label className="block font-semibold">Instructions</label>
          <textarea
            className="w-full border rounded p-2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Step-by-step cooking instructions..."
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}