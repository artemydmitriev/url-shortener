'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Link } from '@heroui/link'
import { useAuth } from '@/hooks/useLogin'

export default function Footer() {
  const { user } = useAuth()
  const router = useRouter()

  const navigate = (path: string) => () => router.push(path)

  return (
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      {user && <p>Logged in as {user.email}</p>}

      <button
        onClick={navigate('/')}
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      >
        <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
        Create URL
      </button>

      <button
        onClick={navigate('/urls')}
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      >
        <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
        My URLs
      </button>

      <button
        onClick={navigate('/rankings')}
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      >
        Rankings
      </button>
    </footer>
  )
}
