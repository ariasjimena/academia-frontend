import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function InicioTropical() {
  const [clases, setClases] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    api.get('/publico/clases?academia=tropical').then(({ data }) => {
      const unicas = []
      const nombres = new Set()
      data.clases.forEach(c => {
        if (!nombres.has(c.nombre)) {
          nombres.add(c.nombre)
          unicas.push(c)
        }
      })
      setClases(unicas)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_tropical.jpeg" alt="Mundo Tropical" className="h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Nosotros', 'Clases', 'Contacto'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-600 hover:text-orange-500 transition font-medium">
                {item}
              </a>
            ))}
            <Link to="/tropical/inscripcion"
              className="text-sm font-semibold bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition">
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
          <div className="md:hidden bg-white border-t border-orange-100 px-6 py-4 space-y-3">
            {['Nosotros', 'Clases', 'Contacto'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMenuAbierto(false)}
                className="block text-sm text-slate-600 hover:text-orange-500 font-medium py-1">
                {item}
              </a>
            ))}
            <Link to="/tropical/inscripcion" onClick={() => setMenuAbierto(false)}
              className="block text-sm font-semibold bg-orange-500 text-white px-5 py-2 rounded-full text-center">
              Inscríbete
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-screen flex items-center bg-linear-to-br from-orange-50 via-white to-sky-50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 leading-tight mb-6">
              Mundo Tropical<br />
              <span className="text-orange-500">Academia de Danza</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Aprende Salsa, Merengue y Bachata con los mejores instructores. Clases para adultos
              en un ambiente vibrante y lleno de energía tropical.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/tropical/inscripcion"
                className="bg-orange-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-orange-600 transition text-sm">
                Inscríbete ahora
              </Link>
              <a href="#clases"
                className="border border-orange-500 text-orange-500 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition text-sm">
                Ver clases
              </a>
            </div>
            <div className="flex gap-6 mt-8">
              <div>
                <p className="text-2xl font-bold text-slate-800">85+</p>
                <p className="text-xs text-slate-400">Estudiantes</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-800">6</p>
                <p className="text-xs text-slate-400">Días a la semana</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-800">3</p>
                <p className="text-xs text-slate-400">Ritmos</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-orange-500/10 rounded-full flex items-center justify-center">
                <img src="/logo_tropical.jpeg" alt="Mundo Tropical"
                  className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-lg" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 text-xs font-semibold text-orange-500 border border-orange-100">
                Clases nocturnas
              </div>
              <div className="absolute -bottom-4 -left-4 bg-orange-500 rounded-2xl shadow-lg px-4 py-2 text-xs font-semibold text-white">
                Salsa & Bachata
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-2">Quiénes somos</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Mundo Tropical Academia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">💃</div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Salsa</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Aprende los pasos fundamentales de la salsa con ritmo, estilo y energía.
                Clases para principiantes y avanzados.
              </p>
            </div>
            <div className="bg-orange-500 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🕺</div>
              <h3 className="text-lg font-bold text-white mb-3">Bachata</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Domina la bachata dominicana con técnica, sentimiento y conexión.
                El baile más sensual del Caribe.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Ambiente</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Un espacio vibrante, familiar y profesional donde la música y el baile
                se viven con pasión cada noche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLASES */}
      <section id="clases" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-2">Horarios</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Nuestras Clases</h2>
            <p className="text-slate-400 text-sm mt-3">Lunes a sábado · Horario nocturno</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {clases.map((clase) => (
              <div key={clase._id}
                className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-orange-300 hover:shadow-md transition group">
                <div className="text-3xl mb-3">{clase.nombre === 'Salsa' ? '💃' : clase.nombre === 'Bachata' ? '🕺' : '🎶'}</div>
                <p className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition">{clase.nombre}</p>
                <p className="text-xs text-slate-400 mt-1">{clase.instrumento}</p>
                <p className="text-lg font-bold text-orange-500 mt-3">
                  RD${clase.mensualidad?.toLocaleString('es-DO')}/mes
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/tropical/inscripcion"
              className="inline-block bg-orange-500 text-white font-semibold px-10 py-3 rounded-full hover:bg-orange-600 transition text-sm">
              Ver horarios e inscribirme
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ TROPICAL */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-2">¿Por qué elegirnos?</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Baila con nosotros</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🌙', titulo: 'Horario nocturno', desc: 'Clases de 8:00-9:00PM perfectas para adultos que trabajan durante el día.' },
              { icon: '👨‍🏫', titulo: 'Instructores expertos', desc: 'Profesores certificados con años de experiencia en danza tropical.' },
              { icon: '🎯', titulo: 'Todos los niveles', desc: 'Desde principiantes hasta avanzados, tenemos clase para ti.' },
              { icon: '🌴', titulo: 'Ambiente tropical', desc: 'Un espacio vibrante donde la música y el baile son los protagonistas.' },
            ].map((item) => (
              <div key={item.titulo} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            ¿Listo para bailar?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Inscríbete en línea en minutos y recibe tu número de matrícula al instante.
          </p>
          <Link to="/tropical/inscripcion"
            className="inline-block bg-white text-orange-500 font-bold px-10 py-4 rounded-full hover:bg-orange-50 transition text-sm">
            Formulario de inscripción →
          </Link>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-2">Encuéntranos</p>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Contacto</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a href="tel:8095893831"
              className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-orange-300 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Teléfono</p>
              <p className="font-semibold text-slate-700 text-sm">809-589-3831</p>
            </a>
            <a href="mailto:Info.mca2024@gmail.com"
              className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-orange-300 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="font-semibold text-slate-700 text-sm">Info.mca2024@gmail.com</p>
            </a>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mb-1">Dirección</p>
              <p className="font-semibold text-slate-700 text-sm">Plaza Saomy, San Cristóbal</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo_tropical.jpeg" alt="Tropical" className="h-8 w-auto object-contain" />
            <div>
              <p className="text-sm font-bold">Mundo Tropical Academia</p>
              <p className="text-xs text-slate-400">Danza urbana para adultos</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Mundo Tropical Academia.</p>
          <div className="flex gap-4">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition">← Inicio</Link>
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition">Acceso admin</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
