import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const navItems = [
  {
    to: '/dashboard', label: 'Dashboard', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    )
  },
  {
    to: '/estudiantes', label: 'Estudiantes', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    )
  },
  {
    to: '/clases', label: 'Clases', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    )
  },
  {
    to: '/pagos', label: 'Pagos', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    )
  },
  {
    to: '/mensualidades', label: 'Mensualidades', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    )
  },
  {
    to: '/reportes', label: 'Reportes', icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    )
  },
]

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const iniciales = usuario
    ? `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase()
    : 'U'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-200`}>

        {/* Logo MCA */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
          <img
            src="/logo_MCA.jpeg"
            alt="MCA"
            className="h-8 w-8 object-contain shrink-0 rounded"
          />
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#2d5f7c] leading-tight truncate">MCA Academia de Arte</p>
              <p className="text-xs text-slate-400 leading-tight">Panel Administrativo</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#f0f6fa] text-[#2d5f7c] font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f0f6fa] flex items-center justify-center text-[#2d5f7c] text-xs font-bold shrink-0">
              {iniciales}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{usuario?.nombre} {usuario?.apellido}</p>
                <p className="text-xs text-slate-400 capitalize">{usuario?.rol}</p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-slate-400 hover:text-[#2d5f7c] transition shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 capitalize">{usuario?.rol}</span>
            <span className="text-slate-200">·</span>
            <span className="text-xs font-medium text-slate-600">{usuario?.nombre} {usuario?.apellido}</span>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

    </div>
  )
}