import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

// export function useLogin() {
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   const login = async (email: string) => {
//     setLoading(true)
//     setError(null)

//     const res = await fetch('http://localhost:3001/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ email }),
//     })

//     setLoading(false)

//     if (!res.ok) {
//       const body = await res.json().catch(() => null)
//       setError(body?.message || 'Login failed')
//       return false
//     }

//     return true
//   }

//   return { login, loading, error }
// }
