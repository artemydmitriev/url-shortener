'use client'

import React, { createContext, useEffect, useState } from 'react'
import { backendUrl } from '@/utils/backendUrl'

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${backendUrl}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string) => {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })

    if (!res.ok) return false
    const { user } = await res.json()
    setUser(user)
    return true
  }

  const logout = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
