import { useState } from 'react'
import api from '../api/axios'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    const token = localStorage.getItem('token')
    if (usuarioGuardado && token) return JSON.parse(usuarioGuardado)
    return null
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data.usuario
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}