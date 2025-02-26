MyRecipeApp

MyRecipeApp is a full-stack recipe sharing platform built with Next.js 13, TypeScript, Tailwind, CSS, Sass, and Node.js. Users can create, view, edit, and delete recipes, complete with image uploads via Cloudinary and secure authentication using NextAuth.

    Features

        •	User Authentication: Secure sign-up, login, and session management using NextAuth with a credentials provider.
        •	Recipe CRUD: Create, read, update, and delete recipes with dynamic pages.
        •	Image Uploads: Upload recipe images that are stored on Cloudinary.
        •	Responsive UI: Clean and modern design using Tailwind CSS and Sass.
        •	Protected Routes: Only the recipe owner can edit or delete their recipes.
        •	Dynamic Layout: A consistent header, footer, and home page welcoming message.

    Tech Stack

        •	Next.js 13 with the App Router
        •	TypeScript for type safety
        •	Tailwind CSS & Sass for styling
        •	NextAuth for authentication
        •	MongoDB with Mongoose for database storage
        •	Cloudinary for image storage and management
        •	Node.js for server-side logic

    Installation

        1. Clone the Repository:
 
            git clone https://github.com/yourusername/my-recipe-app.git
            cd my-recipe-app

        2. Install Dependencies:

            npm install
            # or
            yarn install

        3. Configure Environment Variables:

            Create a .env.local file in the root directory with the following variables (do not commit this file):
            NEXTAUTH_URL=http://localhost:3000
            NEXTAUTH_SECRET=your_nextauth_secret

            MONGODB_URI=your_mongodb_connection_string

            CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
            CLOUDINARY_API_KEY=your_cloudinary_api_key
            CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    Usage

        1. Run the Development Server:

            npm run dev
            # or
            yarn dev

        2. Open in Browser:

            Visit http://localhost:3000 to view the app.

        3. Workflow:

            •	Home Page: Welcoming message with quick links.
            •	Recipes Page: Browse all recipes (each shows a partial image preview and basic details).
            •	Recipe Detail Page: View the full recipe with detailed instructions and an image.
            •	Create Recipe: Authenticated users can add new recipes with image uploads.
            •	Edit/Delete: Owners can edit or delete their recipes from the detail page.

    Deployment

            The easiest way to deploy MyRecipeApp is to use Vercel. Follow the Next.js deployment documentation for details on deploying with environment variables.

    Contributing

            Contributions are welcome! If you’d like to improve the project, please fork the repository and create a pull request with your changes.

    License

            MIT License
