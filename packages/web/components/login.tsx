'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useState } from 'react'
import { useAuth } from '@/hooks/useLogin'

export function Login() {
  const [email, setEmail] = useState('')
  const { login, loading } = useAuth()

  const handleLogin = async () => {
    await login(email)
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl">To create alias login</h1>
      <div className="flex flex-row gap-3">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Button
          onPress={handleLogin}
          disabled={loading}
          variant="solid"
          color="primary"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  )
}
