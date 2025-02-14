// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'  // <-- Import the client-side Providers

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Recipe App',
  description: 'A recipe sharing platform built with Next.js 13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-grow p-4">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}