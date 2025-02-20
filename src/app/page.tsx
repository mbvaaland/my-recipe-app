export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center">
      {/* Background Image */}
      <img
        src="/homepage.jpg"
        alt="Delicious food"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Optional Overlay to darken the image a bit */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Content Above Image */}
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to MyRecipeApp!
        </h1>
        <p className="text-lg text-white">
          Share your favorite recipes and discover new dishes from fellow food lovers.
        </p>
      </div>
    </main>
  );
}