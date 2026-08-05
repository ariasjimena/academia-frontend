import { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'

const estadoPill = {
  activo:     'bg-green-50 text-green-700',
  inactivo:   'bg-slate-100 text-slate-500',
  suspendido: 'bg-red-50 text-red-600',
  pendiente:  'bg-amber-50 text-amber-600',
}

const academiaConfig = {
  '':         { label: 'Todas',         style: 'bg-slate-100 text-slate-600' },
  'mca':      { label: 'MCA',           style: 'bg-[#2d5f7c]/10 text-[#2d5f7c]' },
  'tropical': { label: 'Tropical',      style: 'bg-orange-100 text-orange-600' },
}

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([])
  const [cargando, setCargando]       = useState(true)
  const [buscar, setBuscar]           = useState('')
  const [academia, setAcademia]       = useState('')
  const [filtroPendientes, setFiltroPendientes] = useState(false)
  const [modalOpen, setModalOpen]     = useState(false)
  const [guardando, setGuardando]     = useState(false)
  const [error, setError]             = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', fechaNacimiento: '', email: '', academia: 'mca',
    tutor: { nombre: '', apellido: '', celular: '', email: '', parentesco: 'madre' }
  })

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const params = { limite: 500 }
      if (buscar) params.buscar = buscar
      if (filtroPendientes) params.estado = 'pendiente'
      if (academia) params.academia = academia
      const { data } = await api.get('/estudiantes', { params })
      setEstudiantes(data.estudiantes)
    } catch {
      setError('Error al cargar estudiantes')
    } finally {
      setCargando(false)
    }
  }, [buscar, filtroPendientes, academia])

  useEffect(() => {
    const delay = setTimeout(cargar, 300)
    return () => clearTimeout(delay)
  }, [cargar])

  const activarEstudiante = useCallback(async (id) => {
    try {
      await api.put(`/estudiantes/${id}`, { estado: 'activo' })
      cargar()
    } catch {
      alert('Error al activar estudiante')
    }
  }, [cargar])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await api.post('/estudiantes', form)
      setModalOpen(false)
      setForm({
        nombre: '', apellido: '', fechaNacimiento: '', email: '', academia: 'mca',
        tutor: { nombre: '', apellido: '', celular: '', email: '', parentesco: 'madre' }
      })
      cargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  const setTutor = (field, value) =>
    setForm((f) => ({ ...f, tutor: { ...f.tutor, [field]: value } }))

  const totalMCA      = estudiantes.filter(e => e.academia === 'mca').length
  const totalTropical = estudiantes.filter(e => e.academia === 'tropical').length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Estudiantes</h1>
          <p className="text-sm text-slate-400">
            {estudiantes.length} registrados
            {!academia && (
              <span className="ml-2 text-xs">
                · <span className="text-[#2d5f7c]">{totalMCA} MCA</span>
                · <span className="text-orange-500">{totalTropical} Tropical</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroPendientes(!filtroPendientes)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition ${
              filtroPendientes
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pendientes
          </button>
          <button
            onClick={() => { setError(''); setModalOpen(true) }}
            className="flex items-center gap-2 bg-[#2d5f7c] hover:bg-[#1e4a61] text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo estudiante
          </button>
        </div>
      </div>

      {/* Filtros de academia */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { value: '',         label: 'Todas las academias', icon: '🏫' },
          { value: 'mca',      label: 'MCA — Academia de Arte', icon: '🎨' },
          { value: 'tropical', label: 'Mundo Tropical', icon: '💃' },
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
            <span>{op.icon}</span>
            {op.label}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre, matrícula, email o tutor..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white transition"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {cargando ? (
          <div className="text-center text-slate-400 text-sm py-16">Cargando...</div>
        ) : estudiantes.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-16">
            {filtroPendientes ? 'No hay inscripciones pendientes' : 'No se encontraron estudiantes'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Matrícula</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Estudiante</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Tutor / Contacto</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Clases</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Academia</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => (
                  <tr key={est._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {est.matricula || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${
                          est.academia === 'tropical'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-[#2d5f7c]/10 text-[#2d5f7c]'
                        }`}>
                          {est.nombre[0]}{est.apellido[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{est.nombre} {est.apellido}</p>
                          <p className="text-xs text-slate-400">{est.email || est.telefono || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {est.academia === 'tropical' ? (
                        <div>
                          <p className="text-xs text-slate-500">{est.telefono || '—'}</p>
                        </div>
                      ) : (
                        <div>
                          <p>{est.tutor?.nombre} {est.tutor?.apellido}</p>
                          <p className="text-xs text-slate-400">{est.tutor?.celular || est.tutor?.telefono}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {est.clases?.length > 0
                        ? est.clases.map((c) => (
                            <span key={c._id} className={`inline-block text-xs px-2 py-0.5 rounded-full mr-1 mb-1 ${
                              est.academia === 'tropical'
                                ? 'bg-orange-50 text-orange-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {c.nombre}{c.grupo ? ` · ${c.grupo.split(' ').slice(0,2).join(' ')}` : ''}
                            </span>
                          ))
                        : <span className="text-slate-400 text-xs">Sin clase</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        est.academia === 'tropical'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-[#2d5f7c]/10 text-[#2d5f7c]'
                      }`}>
                        {est.academia === 'tropical' ? '🌴 Tropical' : '🎨 MCA'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoPill[est.estado]}`}>
                        {est.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        {est.estado === 'pendiente' && (
                          <button onClick={() => activarEstudiante(est._id)}
                            className="text-xs text-green-600 hover:underline font-medium">
                            Activar
                          </button>
                        )}
                        {est.estado === 'activo' && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Desactivar a ${est.nombre} ${est.apellido}?`)) {
                                api.put(`/estudiantes/${est._id}`, { estado: 'inactivo' }).then(cargar)
                              }
                            }}
                            className="text-xs text-slate-400 hover:text-red-500 hover:underline">
                            Desactivar
                          </button>
                        )}
                        {est.estado === 'inactivo' && (
                          <button onClick={() => activarEstudiante(est._id)}
                            className="text-xs text-blue-600 hover:underline">
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nuevo estudiante */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Nuevo estudiante</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
              )}

              {/* Selector academia */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Academia</p>
                <div className="flex gap-2">
                  {[
                    { value: 'mca', label: '🎨 MCA' },
                    { value: 'tropical', label: '🌴 Tropical' },
                  ].map(op => (
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

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Datos del estudiante</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                  <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                  <input required value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de nacimiento</label>
                  <input type="date" required value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
              </div>

              {/* Tutor solo para MCA */}
              {form.academia === 'mca' && (
                <>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Datos del tutor</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                      <input required value={form.tutor.nombre} onChange={(e) => setTutor('nombre', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                      <input required value={form.tutor.apellido} onChange={(e) => setTutor('apellido', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Celular</label>
                      <input required value={form.tutor.celular} onChange={(e) => setTutor('celular', e.target.value)}
                        placeholder="809-000-0000"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Parentesco</label>
                      <select value={form.tutor.parentesco} onChange={(e) => setTutor('parentesco', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white">
                        <option value="madre">Madre</option>
                        <option value="padre">Padre</option>
                        <option value="representante_legal">Representante legal</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Celular para Tropical */}
              {form.academia === 'tropical' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Celular</label>
                  <input value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="809-000-0000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
              )}

              <div className="flex gap-3 pt-2 pb-1">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}
                  className={`flex-1 py-2 text-sm text-white font-medium rounded-lg transition ${
                    form.academia === 'tropical'
                      ? 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300'
                      : 'bg-[#2d5f7c] hover:bg-[#1e4a61] disabled:bg-[#2d5f7c]/50'
                  }`}>
                  {guardando ? 'Guardando...' : 'Guardar estudiante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}