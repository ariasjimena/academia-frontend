import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const claseIcono = {
  'Danza': '🩰', 'Bienestar': '🧘', 'Arte': '🎨', 'Música': '🎵', 'Danza Urbana': '💃'
}

export default function Inicio() {
  const [clases, setClases] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    api.get('/publico/clases?academia=mca').then(({ data }) => {
      const unicas = []
      const nombres = new Set()
      data.clases.forEach(c => {
        if (!nombres.has(c.nombre)) { nombres.add(c.nombre); unicas.push(c) }
      })
      setClases(unicas)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_MCA.jpeg" alt="MCA" className="h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Nosotros', 'Clases', 'Contacto'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-600 hover:text-[#2d5f7c] transition font-medium">{item}</a>
            ))}
            <Link to="/login"
              className="text-sm text-slate-500 hover:text-[#2d5f7c] transition font-medium border border-slate-200 px-4 py-1.5 rounded-full hover:border-[#2d5f7c]">
              Iniciar sesión
            </Link>
            <Link to="/inscripcion"
              className="text-sm font-semibold bg-[#2d5f7c] text-white px-5 py-2 rounded-full hover:bg-[#1e4a61] transition">
              Inscríbete
            </Link>
          </div>
          <button className="md:hidden text-slate-600" onClick={() => setMenuAbierto(!menuAbierto)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {menuAbierto && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
            {['Nosotros', 'Clases', 'Contacto'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuAbierto(false)}
                className="block text-sm text-slate-600 hover:text-[#2d5f7c] font-medium py-1">{item}</a>
            ))}
            <Link to="/login" onClick={() => setMenuAbierto(false)}
              className="block text-sm text-center border border-slate-200 text-slate-600 px-5 py-2 rounded-full">
              Iniciar sesión
            </Link>
            <Link to="/inscripcion" onClick={() => setMenuAbierto(false)}
              className="block text-sm font-semibold bg-[#2d5f7c] text-white px-5 py-2 rounded-full text-center">
              Inscríbete
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-screen flex items-center bg-linear-to-br from-[#f0f6fa] via-white to-[#e8f4f8]">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#2d5f7c] text-sm font-semibold tracking-widest uppercase mb-4">Arte en familia, arte para todos</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 leading-tight mb-6">
              Mundo Creativo<br /><span className="text-[#2d5f7c]">Academia de Arte</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Un espacio donde el arte, la música y el movimiento se unen para despertar
              el potencial creativo de niños, adolescentes y adultos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/inscripcion"
                className="bg-[#2d5f7c] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1e4a61] transition text-sm">
                Inscríbete ahora
              </Link>
              <a href="#clases"
                className="border border-[#2d5f7c] text-[#2d5f7c] font-semibold px-8 py-3 rounded-full hover:bg-[#f0f6fa] transition text-sm">
                Ver clases
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-[#2d5f7c]/10 rounded-full flex items-center justify-center">
                <img src="/logo_MCA.jpeg" alt="MCA" className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-lg" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-xs font-semibold text-[#2d5f7c]">+200 estudiantes</div>
              <div className="absolute -bottom-4 -left-4 bg-[#2d5f7c] rounded-2xl shadow-lg px-4 py-2 text-xs font-semibold text-white">10+ disciplinas</div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#2d5f7c] text-xs font-semibold tracking-widest uppercase mb-2">Quiénes somos</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Nuestra Academia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f0f6fa] rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#2d5f7c] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Misión</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Brindar un espacio donde los estudiantes desarrollen su concentración,
                habilidades sociales y fomenten su creatividad a través de las disciplinas de las artes.
              </p>
            </div>
            <div className="bg-[#2d5f7c] rounded-2xl p-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Visión</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Ser institución de referencia en el desarrollo de las artes a nivel nacional,
                formando estudiantes con alto sentido creativo, humanista y crítico.
              </p>
            </div>
            <div className="bg-[#f0f6fa] rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#2d5f7c] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Valores</h3>
              <div className="flex flex-wrap gap-2">
                {['Disciplina', 'Responsabilidad', 'Tolerancia', 'Paz', 'Profesionalidad', 'Amor'].map(v => (
                  <span key={v} className="text-xs bg-[#2d5f7c]/10 text-[#2d5f7c] font-medium px-3 py-1 rounded-full">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLASES */}
      <section id="clases" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#2d5f7c] text-xs font-semibold tracking-widest uppercase mb-2">Lo que ofrecemos</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Nuestras Disciplinas</h2>
            <p className="text-slate-400 text-sm mt-3">Arte, movimiento y música para todas las edades</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clases.map(clase => (
              <div key={clase._id}
                className="bg-white rounded-2xl p-5 text-center border border-slate-100 hover:border-[#2d5f7c]/30 hover:shadow-md transition group">
                <div className="text-3xl mb-3">{claseIcono[clase.instrumento] || '✨'}</div>
                <p className="font-semibold text-slate-800 text-sm group-hover:text-[#2d5f7c] transition">{clase.nombre}</p>
                <p className="text-xs text-slate-400 mt-1 capitalize">{clase.instrumento}</p>
                <p className="text-xs font-semibold text-[#2d5f7c] mt-2">RD${clase.mensualidad?.toLocaleString('es-DO')}/mes</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/inscripcion"
              className="inline-block bg-[#2d5f7c] text-white font-semibold px-10 py-3 rounded-full hover:bg-[#1e4a61] transition text-sm">
              Ver horarios e inscribirme
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#2d5f7c]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">¿Listo para unirte a MCA?</h2>
          <p className="text-white/70 mb-8 text-lg">Inscríbete en línea en minutos y recibe tu matrícula al instante.</p>
          <Link to="/inscripcion"
            className="inline-block bg-white text-[#2d5f7c] font-bold px-10 py-4 rounded-full hover:bg-slate-50 transition text-sm">
            Formulario de inscripción →
          </Link>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#2d5f7c] text-xs font-semibold tracking-widest uppercase mb-2">Encuéntranos</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Contacto</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a href="tel:8095893831" className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-[#2d5f7c]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f0f6fa] rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#2d5f7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Teléfono</p>
              <p className="font-semibold text-slate-700 text-sm">809-589-3831</p>
            </a>
            <a href="mailto:Info.mca2024@gmail.com" className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-[#2d5f7c]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f0f6fa] rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#2d5f7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="font-semibold text-slate-700 text-sm">Info.mca2024@gmail.com</p>
            </a>
            <a href="https://instagram.com/mundocreativoacademia" target="_blank" rel="noreferrer"
              className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-[#2d5f7c]/30 hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f0f6fa] rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#2d5f7c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Instagram</p>
              <p className="font-semibold text-slate-700 text-sm">@mundocreativoacademia</p>
            </a>
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 border border-slate-100 text-sm text-slate-600 shadow-sm">
              <svg className="w-4 h-4 text-[#2d5f7c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Carretera Sánchez, Plaza Saomy — San Cristóbal
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo_MCA.jpeg" alt="MCA" className="h-8 w-auto object-contain brightness-0 invert" />
            <div>
              <p className="text-sm font-bold">MCA — Academia de Arte</p>
              <p className="text-xs text-slate-400">Arte en familia, arte para todos</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Mundo Creativo Academia de Arte.</p>
          <div className="flex gap-4">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">← Inicio</Link>
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition">Acceso administrativo</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
