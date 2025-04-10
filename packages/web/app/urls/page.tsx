'use client'
import Image from 'next/image'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Snippet } from '@heroui/snippet'
import { Link } from '@heroui/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useLogin'
import { Login } from '../page'

export default function URLsPage() {
  const [urls, setUrls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/urls/', {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUrls(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        {loading && <p>Loading URLs...</p>}
        {!loading && urls.length === 0 && <p>No URLs found.</p>}
        {urls.map((u) => (
          <div key={u.id} className="flex flex-row gap-2">
            <Link key={u.id + 'url'} href={u.url}>
              {u.url}
            </Link>
            {'--->'}
            <div key={u.id + 'slug'}>{'http://localhost:3001/' + u.slug}</div>
          </div>
        ))}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Login />
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Create URL
        </Link>
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
