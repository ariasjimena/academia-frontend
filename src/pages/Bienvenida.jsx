import { Link } from 'react-router-dom'

export default function Bienvenida() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">

      {/* Título */}
      <div className="text-center mb-12">
        <p className="text-slate-400 text-sm tracking-widest uppercase mb-3">Bienvenido a</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
          Grupo Académico
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Selecciona tu academia para continuar</p>
      </div>

      {/* Dos puertas */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">

        {/* MCA */}
        <Link to="/mca"
          className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#2d5f7c]/60 rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2d5f7c]/20 transition">
            <img src="/logo_MCA.jpeg" alt="MCA" className="w-24 h-24 object-contain" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">MCA</h2>
          <p className="text-[#7eb8d4] font-medium text-sm mb-3">Academia de Arte</p>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Ballet, Hip Hop, Danza Aérea, Yoga, Piano, Guitarra, Pintura y más disciplinas artísticas.
          </p>
          <span className="inline-block bg-[#2d5f7c] text-white text-xs font-semibold px-6 py-2.5 rounded-full group-hover:bg-[#1e4a61] transition">
            Entrar a MCA →
          </span>
        </Link>

        {/* TROPICAL */}
        <Link to="/tropical"
          className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/60 rounded-3xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition">
            <img src="/logo_tropical.jpeg" alt="Mundo Tropical" className="w-24 h-24 object-contain" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Mundo Tropical</h2>
          <p className="text-orange-400 font-medium text-sm mb-3">Academia de Danza</p>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Salsa, Bachata y ritmos tropicales para adultos. Clases nocturnas todos los días.
          </p>
          <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-6 py-2.5 rounded-full group-hover:bg-orange-600 transition">
            Entrar a Tropical →
          </span>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-12 flex items-center gap-3">
        <div className="h-px w-16 bg-slate-700" />
        <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition">
          Acceso administrativo
        </Link>
        <div className="h-px w-16 bg-slate-700" />
      </div>

    </div>
  )
}
