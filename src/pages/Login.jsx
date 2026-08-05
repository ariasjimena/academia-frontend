import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const usuario = await login(form.email, form.password)
    if (usuario.rol === 'tutor') {
  navigate('/portal')
} else if (usuario.rol === 'profesor') {
  navigate('/profesor')
} else {
  navigate('/dashboard')
}
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Academia Creativa</h1>
          <p className="text-sm text-slate-500 mt-1">Inicia sesión para continuar</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@academia.com"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Academia Creativa © 2025
        </p>
      </div>
    </div>
  )
}