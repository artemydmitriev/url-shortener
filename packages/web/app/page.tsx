'use client'
import Image from 'next/image'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Link } from '@heroui/link'
import { Snippet } from '@heroui/snippet'
import { useState } from 'react'
import { useAuth } from '@/hooks/useLogin'

export function Login() {
  const [email, setEmail] = useState('')
  const { login, loading, user } = useAuth()

  if (user) {
    return (
      <div>
        <p>Logged as {user.email}</p>
      </div>
    )
  }

  const handleLogin = async () => {
    const ok = await login(email)
    if (ok) {
      window.location.href = '/'
    }
  }

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
    </div>
  )
}

function UrlAliasCreator() {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)

  if (alias) {
    return <Snippet>{'http://localhost:3001/' + alias}</Snippet>
  }

  const create = async (url: string) => {
    const res = await fetch('http://localhost:3001/urls/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ url }),
    })

    if (!res.ok) return false
    const { slug } = await res.json()
    setAlias(slug)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <h1 className="text-2xl">URL Shortener</h1>
      <h2 className="text-xl">Enter the URL to create Alias</h2>
      <Input
        className="w-full"
        type="text"
        placeholder="URL"
        size="lg"
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button color="primary" variant="solid" onPress={() => create(url)}>
        Make
      </Button>
    </div>
  )
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <UrlAliasCreator />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Login />
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/urls"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          My URLs
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Raiting
        </a>
      </footer>
    </div>
  )
}
