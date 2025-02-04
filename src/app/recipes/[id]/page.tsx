interface RecipeDetailProps {
    params: {
      id: string;
    };
  }
  
  export default function RecipeDetailPage({ params }: RecipeDetailProps) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Recipe ID: {params.id}</h2>
        <p>Placeholder for detailed recipe information...</p>
      </div>
    );
  }