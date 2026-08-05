import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const pasos = ['Datos', 'Clases', 'Confirmación']

export default function InscripcionTropical() {
  const [paso, setPaso]           = useState(0)
  const [clases, setClases]       = useState([])
  const [enviando, setEnviando]   = useState(false)
  const [exito, setExito]         = useState(false)
  const [matricula, setMatricula] = useState('')
  const [error, setError]         = useState('')

  const [form, setForm] = useState({
    nombre: '', apellido: '', fechaNacimiento: '', email: '',
    telefono: '', direccion: '',
    clasesSeleccionadas: []
  })

  useEffect(() => {
    let activo = true
    api.get('/publico/clases?academia=tropical').then(({ data }) => {
      if (!activo) return
      setClases(data.clases)
    }).catch(() => {})
    return () => { activo = false }
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleClase = (id) => {
    setForm(f => ({
      ...f,
      clasesSeleccionadas: f.clasesSeleccionadas.includes(id)
        ? f.clasesSeleccionadas.filter(c => c !== id)
        : [...f.clasesSeleccionadas, id]
    }))
  }

  const calcularEdad = (fecha) => {
    if (!fecha) return ''
    const hoy = new Date()
    const nac = new Date(fecha)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }

  const validarPaso = () => {
    setError('')
    if (paso === 0) {
      if (!form.nombre || !form.apellido || !form.fechaNacimiento || !form.telefono) {
        setError('Nombre, apellido, fecha de nacimiento y celular son requeridos.')
        return false
      }
    }
    if (paso === 1 && form.clasesSeleccionadas.length === 0) {
      setError('Selecciona al menos una clase.')
      return false
    }
    return true
  }

  const siguiente = () => { if (validarPaso()) setPaso(p => p + 1) }

  const handleSubmit = async () => {
    setEnviando(true)
    setError('')
    try {
      const { data } = await api.post('/publico/inscripcion', {
        nombre: form.nombre,
        apellido: form.apellido,
        fechaNacimiento: form.fechaNacimiento,
        edad: calcularEdad(form.fechaNacimiento),
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        clases: form.clasesSeleccionadas,
        academia: 'tropical',
        tutor: { requerido: false }
      })
      setMatricula(data.matricula)
      setExito(true)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al enviar la inscripción')
    } finally {
      setEnviando(false)
    }
  }

  const resetForm = () => {
    setExito(false)
    setPaso(0)
    setMatricula('')
    setForm({ nombre: '', apellido: '', fechaNacimiento: '', email: '', telefono: '', direccion: '', clasesSeleccionadas: [] })
  }

  const clasesAgrupadas = clases.reduce((acc, clase) => {
    if (!acc[clase.nombre]) acc[clase.nombre] = []
    acc[clase.nombre].push(clase)
    return acc
  }, {})

  if (exito) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-orange-100 p-8 max-w-md w-full text-center shadow-lg">
        <img src="/logo_tropical.jpeg" alt="Tropical" className="h-16 w-auto object-contain mx-auto mb-4" />
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">¡Inscripción recibida!</h2>
        {matricula && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-4 my-4">
            <p className="text-xs text-orange-500 mb-1">Tu número de matrícula</p>
            <p className="text-3xl font-bold text-orange-600 tracking-widest font-mono">{matricula}</p>
            <p className="text-xs text-slate-400 mt-1">Guarda este número para futuras referencias</p>
          </div>
        )}
        <p className="text-sm text-slate-500 mb-4">
          Nos pondremos en contacto contigo pronto para confirmar tu lugar en Mundo Tropical.
        </p>
        <Link to="/tropical" className="block text-sm text-orange-500 hover:underline mb-2">← Volver al inicio</Link>
        <button onClick={resetForm} className="text-xs text-slate-400 hover:underline">Nueva inscripción</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tropical">
            <img src="/logo_tropical.jpeg" alt="Tropical" className="h-10 w-auto object-contain" />
          </Link>
          <div>
            <p className="text-sm font-bold text-slate-800">Mundo Tropical Academia</p>
            <p className="text-xs text-slate-400">Formulario de inscripción en línea</p>
          </div>
        </div>
        <Link to="/tropical" className="text-xs text-orange-500 hover:underline hidden sm:block">← Volver al inicio</Link>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Pasos */}
        <div className="flex items-center gap-2 mb-8">
          {pasos.map((p, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                i < paso ? 'bg-green-500 text-white' :
                i === paso ? 'bg-orange-500 text-white' :
                'bg-slate-200 text-slate-400'
              }`}>
                {i < paso
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === paso ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{p}</span>
              {i < pasos.length - 1 && <div className={`flex-1 h-px ${i < paso ? 'bg-green-300' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

          {/* Paso 0 — Datos personales */}
          {paso === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Tus datos</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre <span className="text-red-400">*</span></label>
                  <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido <span className="text-red-400">*</span></label>
                  <input value={form.apellido} onChange={e => set('apellido', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de nacimiento <span className="text-red-400">*</span></label>
                  <input type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Celular <span className="text-red-400">*</span></label>
                  <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                    placeholder="809-000-0000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Dirección</label>
                  <input value={form.direccion} onChange={e => set('direccion', e.target.value)}
                    placeholder="Calle, sector, ciudad"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
              </div>
            </div>
          )}

          {/* Paso 1 — Clases */}
          {paso === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Selecciona tus clases</h2>
              <p className="text-xs text-slate-400">Puedes seleccionar más de una clase y horario.</p>
              <div className="space-y-3">
                {Object.entries(clasesAgrupadas).map(([nombre, grupos]) => (
                  <div key={nombre} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-100">
                      <p className="text-sm font-semibold text-orange-600">{nombre}</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {grupos.map((clase) => {
                        const seleccionada = form.clasesSeleccionadas.includes(clase._id)
                        const sinCupo = clase.cuposOcupados >= clase.cuposMaximos
                        return (
                          <button key={clase._id} type="button"
                            disabled={sinCupo}
                            onClick={() => !sinCupo && toggleClase(clase._id)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between transition ${
                              sinCupo ? 'opacity-40 cursor-not-allowed bg-slate-50' :
                              seleccionada ? 'bg-orange-50' : 'hover:bg-slate-50'
                            }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                seleccionada ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                              }`}>
                                {seleccionada && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <p className="text-sm text-slate-700">{clase.grupo}</p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <p className="text-sm font-semibold text-slate-700">RD${clase.mensualidad?.toLocaleString('es-DO')}/mes</p>
                              {sinCupo
                                ? <span className="text-xs text-red-400">Sin cupos</span>
                                : <span className="text-xs text-slate-400">{clase.cuposMaximos - clase.cuposOcupados} disponibles</span>
                              }
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2 — Confirmación */}
          {paso === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Confirmación</h2>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-700">Datos personales</p>
                <p className="text-slate-600">{form.nombre} {form.apellido}</p>
                <p className="text-slate-500 text-xs">{form.telefono} · {form.email}</p>
                {form.direccion && <p className="text-slate-500 text-xs">{form.direccion}</p>}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-700">Clases seleccionadas</p>
                {form.clasesSeleccionadas.map(id => {
                  const c = clases.find(cl => cl._id === id)
                  return c ? (
                    <div key={id} className="flex justify-between text-slate-600">
                      <span>{c.nombre} · {c.grupo}</span>
                      <span className="font-medium">RD${c.mensualidad?.toLocaleString('es-DO')}/mes</span>
                    </div>
                  ) : null
                })}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-slate-800">
                  <span>Total mensual</span>
                  <span>RD${form.clasesSeleccionadas.reduce((sum, id) => {
                    const c = clases.find(cl => cl._id === id)
                    return sum + (c?.mensualidad || 0)
                  }, 0).toLocaleString('es-DO')}/mes</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center">
                Al enviar confirmas que los datos son correctos.
              </p>
            </div>
          )}

          {/* Navegación */}
          <div className="flex gap-3 mt-6">
            {paso > 0 && (
              <button onClick={() => setPaso(p => p - 1)}
                className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                Atrás
              </button>
            )}
            {paso < pasos.length - 1 ? (
              <button onClick={siguiente}
                className="flex-1 py-2.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition">
                Siguiente
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={enviando}
                className="flex-1 py-2.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition">
                {enviando ? 'Enviando...' : 'Enviar inscripción'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
