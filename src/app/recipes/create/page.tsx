"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      setError("You must be logged in to create a recipe.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1) Build FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      if (imageFile) {
        formData.append("image", imageFile); // must match `formData.get("image")` on server
      }

      // 2) Send POST to your /api/recipes route
      const res = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create recipe");
      }

      // 3) On success, go to /recipes or /recipes/[id]
      router.push("/recipes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (status === "unauthenticated") {
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Create a Recipe</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Ingredients */}
        <div className="mb-4">
          <label className="block font-semibold">Ingredients</label>
          <small className="text-gray-500">
            Separate by commas (e.g. "salt, pepper, tomatoes")
          </small>
          <textarea
            className="w-full border p-2 rounded mt-1"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <label className="block font-semibold">Instructions</label>
          <textarea
            className="w-full border p-2 rounded"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* Single Image */}
        <div className="mb-4">
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
}