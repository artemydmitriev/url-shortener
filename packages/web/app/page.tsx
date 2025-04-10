'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Snippet } from '@heroui/snippet'
import { useState, useMemo } from 'react'
import Footer from '@/components/footer'
import { useAuth } from '@/hooks/useLogin'
import { Login } from '@/components/login'

export function UrlAliasCreator() {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isInvalid = useMemo(() => !!error, [error])

  const create = async () => {
    if (!url.trim()) return

    setLoading(true)
    setAlias('')
    setError('')

    try {
      const res = await fetch('http://localhost:3001/urls/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const message = errorData?.message || `Error ${res.status}`
        throw new Error(message)
      }

      const { slug } = await res.json()
      setAlias(`${window.location.origin}/${slug}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6">
      <div className="w-full text-start">
        <h1 className="text-3xl font-semibold mb-2">URL Shortener</h1>
        <p className="text-lg text-gray-600">Enter the URL to create Alias</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <Input
          type="url"
          placeholder="https://example.com"
          size="lg"
          value={url}
          onValueChange={(val) => {
            setUrl(val)
            if (error) setError('')
          }}
          isInvalid={isInvalid}
          errorMessage={error}
        />
        <Button
          onPress={create}
          disabled={loading}
          color="primary"
          variant="solid"
          className="w-full text-base py-2"
        >
          {loading ? 'Creating...' : 'Make'}
        </Button>
        {/* {error && (
          <p className="text-sm text-red-500 px-1 mt-1" role="alert">
            {error}
          </p>
        )} */}
      </div>

      {alias && (
        <div className="w-full mt-4 flex flex-col gap-2 items-start">
          <p className="text-lg font-medium">Your URL Alias</p>
          <div className="flex items-center w-full gap-2">
            <Snippet
              symbol=""
              variant="bordered"
              className="w-full rounded-lg text-sm px-4 py-2"
            >
              {alias}
            </Snippet>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {user ? <UrlAliasCreator /> : <Login />}
      </main>
      <Footer />
    </div>
  )
}
