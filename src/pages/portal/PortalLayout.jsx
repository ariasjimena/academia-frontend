import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function PortalLayout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-800">Academia Creativa</span>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Portal familiar</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Hola, <strong>{usuario?.nombre}</strong></span>
          <button onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-slate-600 transition">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}