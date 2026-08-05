import { useEffect, useState } from 'react'
import api from '../../api/axios'
import ProfesorLayout from './ProfesorLayout'

const diasLabel = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb'
}

export default function PanelProfesor() {
  const [clases, setClases] = useState([])
  const [claseActiva, setClaseActiva] = useState(null)
  const [estudiantes, setEstudiantes] = useState([])
  const [asistencias, setAsistencias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [vista, setVista] = useState('clases')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [registros, setRegistros] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    const ejecutar = async () => {
      setCargando(true)
      try {
        const { data } = await api.get('/clases')
        if (!activo) return
        setClases(data.clases)
      } finally {
        if (activo) setCargando(false)
      }
    }
    ejecutar()
    return () => { activo = false }
  }, [])

  const abrirClase = async (clase) => {
    setClaseActiva(clase)
    setVista('asistencia')
    setError('')
    setExito('')
    try {
      const { data } = await api.get(`/clases/${clase._id}`)
      const lista = data.clase.estudiantes || []
      setEstudiantes(lista)
      setRegistros(lista.map((est) => ({
        estudiante: est._id,
        nombre: `${est.nombre} ${est.apellido}`,
        presente: false,
        justificado: false
      })))

      const hist = await api.get(`/clases/${clase._id}/asistencia`)
      setAsistencias(hist.data.asistencias || [])
    } catch {
      setError('Error al cargar la clase')
    }
  }

  const togglePresente = (id) => {
    setRegistros((prev) => prev.map((r) =>
      r.estudiante === id ? { ...r, presente: !r.presente, justificado: false } : r
    ))
  }

  const toggleJustificado = (id) => {
    setRegistros((prev) => prev.map((r) =>
      r.estudiante === id ? { ...r, justificado: !r.justificado } : r
    ))
  }

  const guardarAsistencia = async () => {
    setGuardando(true)
    setError('')
    try {
      await api.post(`/clases/${claseActiva._id}/asistencia`, {
        fecha,
        registros: registros.map(({ estudiante, presente, justificado }) => ({
          estudiante, presente, justificado
        }))
      })
      setExito('Asistencia guardada correctamente.')
      setTimeout(() => setExito(''), 4000)
      const hist = await api.get(`/clases/${claseActiva._id}/asistencia`)
      setAsistencias(hist.data.asistencias || [])
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar asistencia')
    } finally {
      setGuardando(false)
    }
  }

  const presentes = registros.filter((r) => r.presente).length

  return (
    <ProfesorLayout>
      <div className="space-y-6">

        {vista === 'clases' && (
          <>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Mis clases</h1>
              <p className="text-sm text-slate-400">Selecciona una clase para registrar asistencia</p>
            </div>

            {cargando ? (
              <div className="text-center text-slate-400 text-sm py-16">Cargando...</div>
            ) : clases.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-16">No tienes clases asignadas</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clases.map((clase) => {
                  const pct = Math.round((clase.cuposOcupados / clase.cuposMaximos) * 100)
                  return (
                    <button key={clase._id} onClick={() => abrirClase(clase)}
                      className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{clase.nombre}</p>
                          <p className="text-xs text-slate-400 capitalize mt-0.5">{clase.nivel} · {clase.instrumento}</p>
                        </div>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                          {clase.cuposOcupados} estudiantes
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
  {clase.grupo
    ? <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{clase.grupo}</span>
    : clase.horarios?.map((h, i) => (
      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
        {diasLabel[h.dia]} {h.horaInicio}
      </span>
    ))
  }
</div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Ocupación</span>
                          <span className="font-medium">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : 'bg-amber-400'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-medium">Registrar asistencia →</p>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        {vista === 'asistencia' && claseActiva && (
          <>
            <div className="flex items-center gap-3">
              <button onClick={() => setVista('clases')}
                className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">{claseActiva.nombre}</h1>
                <p className="text-sm text-slate-400">Registro de asistencia</p>
              </div>
            </div>

            {exito && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-3">
                {exito}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3">
                {error}
              </div>
            )}

            {/* Registrar asistencia */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">Fecha de la sesión</label>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400" />
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-green-600">{presentes}</span> / {registros.length} presentes
                </div>
              </div>

              {registros.length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-8">
                  Esta clase no tiene estudiantes inscritos aún
                </div>
              ) : (
                <div className="space-y-2">
                  {registros.map((r) => (
                    <div key={r.estudiante}
                      className={`flex items-center justify-between p-3 rounded-lg border transition ${r.presente ? 'border-green-200 bg-green-50' :
                          r.justificado ? 'border-amber-200 bg-amber-50' :
                            'border-slate-100 bg-slate-50'
                        }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">
                          {r.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{r.nombre}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {!r.presente && (
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-amber-600">
                            <input type="checkbox" checked={r.justificado}
                              onChange={() => toggleJustificado(r.estudiante)}
                              className="w-3.5 h-3.5 rounded" />
                            Justificado
                          </label>
                        )}
                        <button onClick={() => togglePresente(r.estudiante)}
                          className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition ${r.presente
                              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-600'
                            }`}>
                          {r.presente ? '✓ Presente' : 'Ausente'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {registros.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <button onClick={guardarAsistencia} disabled={guardando}
                    className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition">
                    {guardando ? 'Guardando...' : 'Guardar asistencia'}
                  </button>
                </div>
              )}
            </div>

            {/* Historial */}
            {asistencias.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Historial de sesiones</h2>
                <div className="space-y-3">
                  {asistencias.map((a) => {
                    const total = a.registros.length
                    const pres = a.registros.filter((r) => r.presente).length
                    const pct = total > 0 ? Math.round((pres / total) * 100) : 0
                    return (
                      <div key={a._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {new Date(a.fecha).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{pres}/{total} estudiantes presentes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </ProfesorLayout>
  )
}