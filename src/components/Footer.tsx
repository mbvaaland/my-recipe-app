// src/components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-auto">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} MyRecipeApp
      </p>
    </footer>
  );
}