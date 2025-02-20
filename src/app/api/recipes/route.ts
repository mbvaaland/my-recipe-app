// src/app/api/recipes/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import Recipe from '@/models/Recipe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req: Request) {
  try {
    // 1) Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse FormData (since we’re uploading an image)
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const ingredientsStr = formData.get("ingredients") as string;
    const instructions = formData.get("instructions") as string;
    const file = formData.get("image") as File | null; // The single image

    const ingredients = ingredientsStr
      ? ingredientsStr.split(",").map((i) => i.trim())
      : [];

    await connectToDB();

    let imageUrl = "";

    // 3) If user uploaded a file, send it to Cloudinary
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // We wrap upload_stream in a Promise so we can await it
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "recipes", // optional folder in Cloudinary
            // you could add transformations here if you want a small/partial view
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        bufferToStream(buffer).pipe(stream);
      });

      // Cast the result to the correct type
      const { secure_url } = uploadResult as {
        secure_url: string;
        // other fields...
      };

      imageUrl = secure_url;
    }

    // 4) Create the recipe in MongoDB
    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      userId: session.user._id,
      imageUrl,
    });

    return NextResponse.json({ recipe: newRecipe }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating recipe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
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