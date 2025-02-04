// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-gray-100 p-4">
      <div className="text-xl font-bold">
        <Link href="/">
          MyRecipeApp
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-red-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/recipes" className="hover:text-red-500">
              Recipes
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-red-500">
              Login
            </Link>
          </li>
          {/* Add more nav links as needed */}
        </ul>
      </nav>
    </header>
  );
}