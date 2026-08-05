import { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'

const diasLabel = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb'
}

const estadoConfig = {
  activa:   { label: 'Activa',    style: 'bg-green-50 text-green-700' },
  inactiva: { label: 'Inactiva',  style: 'bg-slate-100 text-slate-500' },
  llena:    { label: 'Sin cupos', style: 'bg-red-50 text-red-600' },
}

export default function Clases() {
  const [clases, setClases]         = useState([])
  const [cargando, setCargando]     = useState(true)
  const [profesores, setProfesores] = useState([])
  const [academia, setAcademia]     = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [guardando, setGuardando]   = useState(false)
  const [error, setError]           = useState('')
  const [form, setForm] = useState({
    nombre: '', nivel: 'basico', instrumento: '', cuposMaximos: '',
    mensualidad: '', profesorId: '', academia: 'mca',
    horarios: [{ dia: 'lunes', horaInicio: '09:00', horaFin: '10:00' }]
  })

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const params = academia ? { academia } : {}
      const { data } = await api.get('/clases', { params })
      setClases(data.clases)
      const profs = data.clases.map(c => c.profesor).filter(Boolean)
      const unique = [...new Map(profs.map(p => [p._id, p])).values()]
      setProfesores(unique)
    } finally {
      setCargando(false)
    }
  }, [academia])

  useEffect(() => {
    let activo = true
    const ejecutar = async () => {
      setCargando(true)
      try {
        const params = academia ? { academia } : {}
        const { data } = await api.get('/clases', { params })
        if (!activo) return
        setClases(data.clases)
        const profs = data.clases.map(c => c.profesor).filter(Boolean)
        const unique = [...new Map(profs.map(p => [p._id, p])).values()]
        setProfesores(unique)
      } finally {
        if (activo) setCargando(false)
      }
    }
    ejecutar()
    return () => { activo = false }
  }, [academia])

  const agregarHorario = () =>
    setForm(f => ({ ...f, horarios: [...f.horarios, { dia: 'lunes', horaInicio: '09:00', horaFin: '10:00' }] }))

  const quitarHorario = (i) =>
    setForm(f => ({ ...f, horarios: f.horarios.filter((_, idx) => idx !== i) }))

  const setHorario = (i, field, value) =>
    setForm(f => {
      const h = [...f.horarios]
      h[i] = { ...h[i], [field]: value }
      return { ...f, horarios: h }
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await api.post('/clases', { ...form, profesor: form.profesorId })
      setModalOpen(false)
      setForm({
        nombre: '', nivel: 'basico', instrumento: '', cuposMaximos: '',
        mensualidad: '', profesorId: '', academia: 'mca',
        horarios: [{ dia: 'lunes', horaInicio: '09:00', horaFin: '10:00' }]
      })
      cargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear clase')
    } finally {
      setGuardando(false)
    }
  }

  const moneda = (n) => `RD$${Number(n).toLocaleString('es-DO')}`

  const claseMCA      = clases.filter(c => c.academia === 'mca').length
  const claseTropical = clases.filter(c => c.academia === 'tropical').length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Clases</h1>
          <p className="text-sm text-slate-400">
            {clases.length} clases
            {!academia && (
              <span className="ml-2 text-xs">
                · <span className="text-[#2d5f7c]">{claseMCA} MCA</span>
                · <span className="text-orange-500">{claseTropical} Tropical</span>
              </span>
            )}
          </p>
        </div>
        <button onClick={() => { setError(''); setModalOpen(true) }}
          className="flex items-center gap-2 bg-[#2d5f7c] hover:bg-[#1e4a61] text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva clase
        </button>
      </div>

      {/* Selector academia */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '',         label: 'Todas',        icon: '🏫' },
          { value: 'mca',      label: 'MCA',          icon: '🎨' },
          { value: 'tropical', label: 'Tropical',     icon: '💃' },
        ].map(op => (
          <button key={op.value} onClick={() => setAcademia(op.value)}
            className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition ${
              academia === op.value
                ? op.value === 'tropical'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : op.value === 'mca'
                    ? 'bg-[#2d5f7c] text-white border-[#2d5f7c]'
                    : 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            <span>{op.icon}</span>{op.label}
          </button>
        ))}
      </div>

      {/* Grid de clases */}
      {cargando ? (
        <div className="text-center text-slate-400 text-sm py-16">Cargando...</div>
      ) : clases.length === 0 ? (
        <div className="text-center text-slate-400 text-sm py-16">No hay clases registradas</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clases.map((clase) => {
            const pct = Math.round((clase.cuposOcupados / clase.cuposMaximos) * 100)
            const barColor = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : 'bg-amber-400'
            const esTropical = clase.academia === 'tropical'
            return (
              <div key={clase._id} className={`bg-white rounded-xl border p-5 space-y-3 ${
                esTropical ? 'border-orange-100' : 'border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">{clase.nombre}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        esTropical ? 'bg-orange-100 text-orange-600' : 'bg-[#2d5f7c]/10 text-[#2d5f7c]'
                      }`}>
                        {esTropical ? '🌴' : '🎨'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">{clase.nivel} · {clase.instrumento}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoConfig[clase.estado]?.style}`}>
                    {estadoConfig[clase.estado]?.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-slate-600">{clase.profesor?.nombre} {clase.profesor?.apellido}</span>
                </div>

                {/* Grupo o horario */}
                <div className="flex flex-wrap gap-1">
                  {clase.grupo
                    ? <span className={`text-xs px-2 py-0.5 rounded-full ${
                        esTropical ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                      }`}>{clase.grupo}</span>
                    : clase.horarios?.map((h, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {diasLabel[h.dia]} {h.horaInicio}
                        </span>
                      ))
                  }
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{clase.cuposOcupados}/{clase.cuposMaximos} estudiantes</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Mensualidad</span>
                  <span className={`text-sm font-bold ${esTropical ? 'text-orange-600' : 'text-[#2d5f7c]'}`}>
                    {moneda(clase.mensualidad)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal nueva clase */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Nueva clase</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3 max-h-[72vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
              )}

              {/* Selector academia */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Academia</p>
                <div className="flex gap-2">
                  {[{ value: 'mca', label: '🎨 MCA' }, { value: 'tropical', label: '🌴 Tropical' }].map(op => (
                    <button key={op.value} type="button"
                      onClick={() => setForm(f => ({ ...f, academia: op.value }))}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                        form.academia === op.value
                          ? op.value === 'tropical'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-[#2d5f7c] text-white border-[#2d5f7c]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}>{op.label}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre de la clase</label>
                  <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ballet, Salsa, Piano..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Instrumento / Disciplina</label>
                  <input value={form.instrumento} onChange={e => setForm({ ...form, instrumento: e.target.value })}
                    placeholder="Danza, Música..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nivel</label>
                  <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                    <option value="iniciacion">Iniciación</option>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Cupos máximos</label>
                  <input type="number" required value={form.cuposMaximos}
                    onChange={e => setForm({ ...form, cuposMaximos: e.target.value })}
                    placeholder="20"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mensualidad (RD$)</label>
                  <input type="number" required value={form.mensualidad}
                    onChange={e => setForm({ ...form, mensualidad: e.target.value })}
                    placeholder="1500"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Profesor</label>
                  <select required value={form.profesorId}
                    onChange={e => setForm({ ...form, profesorId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                    <option value="">Seleccionar profesor...</option>
                    {profesores.map(p => (
                      <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600">Horarios</label>
                  <button type="button" onClick={agregarHorario}
                    className="text-xs text-blue-600 hover:underline">+ Agregar día</button>
                </div>
                <div className="space-y-2">
                  {form.horarios.map((h, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select value={h.dia} onChange={e => setHorario(i, 'dia', e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white">
                        {Object.entries(diasLabel).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <input type="time" value={h.horaInicio}
                        onChange={e => setHorario(i, 'horaInicio', e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400" />
                      <input type="time" value={h.horaFin}
                        onChange={e => setHorario(i, 'horaFin', e.target.value)}
                        className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-400" />
                      {form.horarios.length > 1 && (
                        <button type="button" onClick={() => quitarHorario(i)}
                          className="text-red-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}
                  className={`flex-1 py-2 text-sm font-medium text-white rounded-lg transition ${
                    form.academia === 'tropical'
                      ? 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300'
                      : 'bg-[#2d5f7c] hover:bg-[#1e4a61] disabled:bg-[#2d5f7c]/50'
                  }`}>
                  {guardando ? 'Guardando...' : 'Crear clase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}