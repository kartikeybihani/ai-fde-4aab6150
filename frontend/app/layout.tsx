'use client'

import { Inter } from 'next/font/google'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/types/database'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      setIsAuthenticated(event === 'SIGNED_IN')
    })

    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Construction Manager</Link>
            <div className="space-x-4">
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                  <Link href="/projects" className="hover:text-gray-300">Projects</Link>
                  <Link href="/employees" className="hover:text-gray-300">Employees</Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push('/')
                    }}
                    className="hover:text-gray-300"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link href="/auth" className="hover:text-gray-300">Sign In</Link>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-auto">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Construction Manager. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Construction Manager',
  description: 'Manage your construction projects, employees, and materials efficiently',
}