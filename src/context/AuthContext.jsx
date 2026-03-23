import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('ip_token')
    const storedUser  = localStorage.getItem('ip_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('ip_token', jwtToken)
    localStorage.setItem('ip_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ip_token')
    localStorage.removeItem('ip_user')
  }

  const isStudent = () => user?.role === 'STUDENT'
  const isAdmin   = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isStudent, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
