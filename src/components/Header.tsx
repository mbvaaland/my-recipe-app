"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession(); // null if not logged in

  return (
    <header className="flex items-center justify-between bg-gray-100 p-4">
      <div className="text-xl font-bold">
        <Link href="/">MyRecipeApp</Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/recipes">Recipes</Link>
          </li>
          {session ? (
            <>
              {/* If user is logged in, maybe show a 'Create Recipe' link */}
              <li>
                <Link href="/recipes/create" className="hover:text-red-500">
                  Create
                </Link>
              </li>
              {/* Show a sign out button */}
              <li>
                <button
                  onClick={() => signOut()}
                  className="hover:text-red-500"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              {/* If user is NOT logged in, show login link */}
              <li>
                <Link href="/login" className="hover:text-red-500">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-red-500">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}