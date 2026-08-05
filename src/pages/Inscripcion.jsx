import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Inscripcion() {
  const [paso, setPaso]           = useState(0)
  const [clases, setClases]       = useState([])
  const [enviando, setEnviando]   = useState(false)
  const [exito, setExito]         = useState(false)
  const [matricula, setMatricula] = useState('')
  const [error, setError]         = useState('')

  const [form, setForm] = useState({
    academia: '',
    nombre: '', apellido: '', fechaNacimiento: '', edad: '',
    direccion: '', telefono: '', email: '',
    atencionEspecial: { requiere: false, descripcion: '' },
    tutor: { requerido: true, parentesco: 'madre', nombre: '', email: '', celular: '' },
    clasesSeleccionadas: []
  })

  const esTropical = form.academia === 'tropical'
  const colorBtn   = esTropical ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-[#2d5f7c] hover:bg-[#1e4a61] text-white'
  const colorBorder = esTropical ? 'border-orange-400 ring-orange-100' : 'border-[#2d5f7c] ring-[#2d5f7c]/10'
  const colorCheck  = esTropical ? 'border-orange-500 bg-orange-500' : 'border-[#2d5f7c] bg-[#2d5f7c]'
  const colorHeader = esTropical ? 'border-orange-100' : 'border-slate-100'

  // Calcular pasos dinámicamente según academia
  const pasos = form.academia === ''
    ? ['Academia']
    : esTropical
      ? ['Academia', 'Datos', 'Clase', 'Confirmación']
      : ['Academia', 'Datos', 'Tutor', 'Clase', 'Confirmación']

  useEffect(() => {
    if (!form.academia) return
    let activo = true
    api.get(`/publico/clases?academia=${form.academia}`).then(({ data }) => {
      if (!activo) return
      setClases(data.clases)
    }).catch(() => {})
    return () => { activo = false }
  }, [form.academia])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setTutor = (field, value) => setForm(f => ({ ...f, tutor: { ...f.tutor, [field]: value } }))
  const setAtencion = (field, value) => setForm(f => ({ ...f, atencionEspecial: { ...f.atencionEspecial, [field]: value } }))

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
    if (paso === 0 && !form.academia) {
      setError('Selecciona una academia para continuar.')
      return false
    }
    if (paso === 1) {
      if (!form.nombre || !form.apellido || !form.fechaNacimiento) {
        setError('Nombre, apellido y fecha de nacimiento son requeridos.')
        return false
      }
      if (esTropical && !form.telefono) {
        setError('El celular es requerido.')
        return false
      }
    }
    // Paso tutor (solo MCA, paso 2)
    if (!esTropical && paso === 2 && form.tutor.requerido) {
      if (!form.tutor.nombre || !form.tutor.celular) {
        setError('Nombre y celular del tutor son requeridos.')
        return false
      }
    }
    // Paso clase
    const pasoClase = esTropical ? 2 : 3
    if (paso === pasoClase && form.clasesSeleccionadas.length === 0) {
      setError('Selecciona al menos una clase y horario.')
      return false
    }
    return true
  }

  const siguiente = () => { if (validarPaso()) setPaso(p => p + 1) }
  const anterior  = () => { setError(''); setPaso(p => p - 1) }

  const handleSubmit = async () => {
    setEnviando(true)
    setError('')
    try {
      const { data } = await api.post('/publico/inscripcion', {
        nombre: form.nombre,
        apellido: form.apellido,
        fechaNacimiento: form.fechaNacimiento,
        edad: form.edad,
        direccion: form.direccion,
        telefono: form.telefono,
        email: form.email,
        atencionEspecial: form.atencionEspecial,
        tutor: (!esTropical && form.tutor.requerido) ? form.tutor : { requerido: false },
        clases: form.clasesSeleccionadas,
        academia: form.academia
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
    setExito(false); setPaso(0); setMatricula('')
    setForm({
      academia: '', nombre: '', apellido: '', fechaNacimiento: '', edad: '',
      direccion: '', telefono: '', email: '',
      atencionEspecial: { requiere: false, descripcion: '' },
      tutor: { requerido: true, parentesco: 'madre', nombre: '', email: '', celular: '' },
      clasesSeleccionadas: []
    })
  }

  // Agrupar clases por nombre
  const clasesAgrupadas = clases.reduce((acc, clase) => {
    if (!acc[clase.nombre]) acc[clase.nombre] = []
    acc[clase.nombre].push(clase)
    return acc
  }, {})

  const pasoClase = esTropical ? 2 : 3
  const pasoConfirmacion = esTropical ? 3 : 4

  // Pantalla de éxito
  if (exito) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center shadow-lg">
        <img
          src={esTropical ? '/logo_tropical.jpeg' : '/logo_MCA.jpeg'}
          alt="Logo" className="h-16 w-auto object-contain mx-auto mb-4"
        />
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">¡Inscripción recibida!</h2>
        <div className={`rounded-xl px-6 py-4 my-4 ${esTropical ? 'bg-orange-50 border border-orange-200' : 'bg-[#f0f6fa] border border-[#2d5f7c]/20'}`}>
          <p className={`text-xs mb-1 ${esTropical ? 'text-orange-500' : 'text-[#2d5f7c]'}`}>Tu número de matrícula</p>
          <p className={`text-3xl font-bold tracking-widest font-mono ${esTropical ? 'text-orange-600' : 'text-[#2d5f7c]'}`}>{matricula}</p>
          <p className="text-xs text-slate-400 mt-1">Guarda este número para futuras referencias</p>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Nos pondremos en contacto contigo pronto para confirmar tu lugar en {esTropical ? 'Mundo Tropical' : 'MCA Academia de Arte'}.
        </p>
        <Link to={esTropical ? '/tropical' : '/mca'} className={`block text-sm hover:underline mb-2 ${esTropical ? 'text-orange-500' : 'text-[#2d5f7c]'}`}>
          ← Volver al inicio
        </Link>
        <button onClick={resetForm} className="text-xs text-slate-400 hover:underline">Nueva inscripción</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header dinámico según academia */}
      <div className={`bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between ${colorHeader}`}>
        <div className="flex items-center gap-3">
          {form.academia ? (
            <Link to={esTropical ? '/tropical' : '/mca'}>
              <img
                src={esTropical ? '/logo_tropical.jpeg' : '/logo_MCA.jpeg'}
                alt="Logo" className="h-10 w-auto object-contain"
              />
            </Link>
          ) : (
            <Link to="/">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold">MCA</div>
            </Link>
          )}
          <div>
            <p className="text-sm font-bold text-slate-800">
              {form.academia === 'tropical' ? 'Mundo Tropical Academia' : form.academia === 'mca' ? 'MCA — Academia de Arte' : 'Inscripción'}
            </p>
            <p className="text-xs text-slate-400">Formulario de inscripción en línea</p>
          </div>
        </div>
        <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 hidden sm:block">← Inicio</Link>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Barra de pasos */}
        {form.academia && (
          <div className="flex items-center gap-2 mb-8">
            {pasos.map((p, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  i < paso ? 'bg-green-500 text-white' :
                  i === paso ? (esTropical ? 'bg-orange-500 text-white' : 'bg-[#2d5f7c] text-white') :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {i < paso
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    : i + 1}
                </div>
                <span className={`text-xs hidden sm:block truncate ${i === paso ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{p}</span>
                {i < pasos.length - 1 && <div className={`flex-1 h-px shrink-0 ${i < paso ? 'bg-green-300' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {/* ── PASO 0: Selección de academia ── */}
          {paso === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-800">¿A qué academia deseas inscribirte?</h2>
                <p className="text-xs text-slate-400 mt-1">Selecciona una academia para continuar</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* MCA */}
                <button type="button" onClick={() => { set('academia', 'mca'); set('clasesSeleccionadas', []) }}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                    form.academia === 'mca'
                      ? 'border-[#2d5f7c] bg-[#f0f6fa] shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  {form.academia === 'mca' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#2d5f7c] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <img src="/logo_MCA.jpeg" alt="MCA" className="h-16 w-auto object-contain mb-3" />
                  <p className="font-bold text-slate-800 text-sm">MCA — Academia de Arte</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ballet, Hip Hop, Danza Aérea, Yoga, Piano, Guitarra, Pintura y más.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {['Ballet', 'Hip Hop', 'Yoga', 'Piano'].map(d => (
                      <span key={d} className="text-xs bg-[#2d5f7c]/10 text-[#2d5f7c] px-2 py-0.5 rounded-full">{d}</span>
                    ))}
                  </div>
                </button>

                {/* Tropical */}
                <button type="button" onClick={() => { set('academia', 'tropical'); set('clasesSeleccionadas', []) }}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                    form.academia === 'tropical'
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  {form.academia === 'tropical' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <img src="/logo_tropical.jpeg" alt="Tropical" className="h-16 w-auto object-contain mb-3" />
                  <p className="font-bold text-slate-800 text-sm">Mundo Tropical Academia</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Salsa y Bachata para adultos. Clases nocturnas todos los días.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {['Salsa', 'Bachata', 'Nocturno'].map(d => (
                      <span key={d} className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{d}</span>
                    ))}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 1: Datos personales ── */}
          {paso === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Datos personales</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre <span className="text-red-400">*</span></label>
                  <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido <span className="text-red-400">*</span></label>
                  <input value={form.apellido} onChange={e => set('apellido', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de nacimiento <span className="text-red-400">*</span></label>
                  <input type="date" value={form.fechaNacimiento}
                    onChange={e => { set('fechaNacimiento', e.target.value); set('edad', calcularEdad(e.target.value)) }}
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Edad</label>
                  <input value={form.edad} readOnly placeholder="Auto"
                    className="w-full px-3 py-2 text-sm border border-slate-100 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Celular {esTropical && <span className="text-red-400">*</span>}
                  </label>
                  <input value={form.telefono} onChange={e => set('telefono', e.target.value)}
                    placeholder="809-000-0000"
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Dirección</label>
                  <input value={form.direccion} onChange={e => set('direccion', e.target.value)}
                    placeholder="Calle, sector, ciudad"
                    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:${colorBorder} focus:ring-2 transition`} />
                </div>
              </div>
              {!esTropical && (
                <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.atencionEspecial.requiere}
                      onChange={e => setAtencion('requiere', e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300" />
                    <span className="text-sm text-slate-700">¿Requiere atención especial?</span>
                  </label>
                  {form.atencionEspecial.requiere && (
                    <textarea value={form.atencionEspecial.descripcion}
                      onChange={e => setAtencion('descripcion', e.target.value)}
                      placeholder="Describe brevemente..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none resize-none" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PASO 2 (solo MCA): Datos del tutor ── */}
          {!esTropical && paso === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">Datos del tutor</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!form.tutor.requerido}
                    onChange={e => setTutor('requerido', !e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300" />
                  <span className="text-xs text-slate-500">Adulto (no aplica)</span>
                </label>
              </div>
              {form.tutor.requerido ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">¿Qué es del estudiante?</label>
                    <div className="flex gap-2">
                      {[{ value: 'madre', label: 'Madre' }, { value: 'padre', label: 'Padre' }, { value: 'representante_legal', label: 'Rep. legal' }].map(op => (
                        <button key={op.value} type="button" onClick={() => setTutor('parentesco', op.value)}
                          className={`flex-1 py-2 text-xs rounded-lg border transition font-medium ${
                            form.tutor.parentesco === op.value ? 'bg-[#2d5f7c] text-white border-[#2d5f7c]' : 'bg-white text-slate-600 border-slate-200'
                          }`}>{op.label}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nombre completo <span className="text-red-400">*</span></label>
                    <input value={form.tutor.nombre} onChange={e => setTutor('nombre', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#2d5f7c] transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                    <input type="email" value={form.tutor.email} onChange={e => setTutor('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#2d5f7c] transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Celular <span className="text-red-400">*</span></label>
                    <input value={form.tutor.celular} onChange={e => setTutor('celular', e.target.value)}
                      placeholder="809-000-0000"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#2d5f7c] transition" />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-5 text-center text-sm text-slate-400">
                  Los datos del tutor no son requeridos para estudiantes adultos.
                </div>
              )}
            </div>
          )}

          {/* ── PASO CLASE: Selección de clase y horario ── */}
          {paso === pasoClase && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800">Selecciona tu clase y horario</h2>
                <p className="text-xs text-slate-400 mt-1">Puedes inscribirte en más de una clase</p>
              </div>
              {Object.keys(clasesAgrupadas).length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-8">Cargando clases...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(clasesAgrupadas).map(([nombre, grupos]) => (
                    <div key={nombre} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className={`px-4 py-2.5 border-b ${esTropical ? 'bg-orange-50 border-orange-100' : 'bg-[#f0f6fa] border-slate-200'}`}>
                        <p className={`text-sm font-semibold ${esTropical ? 'text-orange-600' : 'text-[#2d5f7c]'}`}>{nombre}</p>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {grupos.map(clase => {
                          const seleccionada = form.clasesSeleccionadas.includes(clase._id)
                          const sinCupo = clase.cuposOcupados >= clase.cuposMaximos
                          return (
                            <button key={clase._id} type="button"
                              disabled={sinCupo}
                              onClick={() => !sinCupo && toggleClase(clase._id)}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between transition ${
                                sinCupo ? 'opacity-40 cursor-not-allowed bg-slate-50' :
                                seleccionada ? (esTropical ? 'bg-orange-50' : 'bg-[#f0f6fa]') :
                                'hover:bg-slate-50'
                              }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  seleccionada ? colorCheck : 'border-slate-300'
                                }`}>
                                  {seleccionada && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm text-slate-700 font-medium">
                                    {clase.grupo || clase.horarios?.map(h => `${h.dia} ${h.horaInicio}`).join(', ')}
                                  </p>
                                  <p className="text-xs text-slate-400">{clase.nivel} · {clase.instrumento}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="text-sm font-semibold text-slate-700">
                                  RD${clase.mensualidad?.toLocaleString('es-DO')}/mes
                                </p>
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
              )}
            </div>
          )}

          {/* ── PASO CONFIRMACIÓN ── */}
          {paso === pasoConfirmacion && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Confirmación</h2>

              {/* Academia */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <img src={esTropical ? '/logo_tropical.jpeg' : '/logo_MCA.jpeg'} alt="logo" className="h-10 w-auto object-contain" />
                <div>
                  <p className="text-xs text-slate-400">Academia seleccionada</p>
                  <p className="font-semibold text-slate-700 text-sm">{esTropical ? 'Mundo Tropical Academia' : 'MCA — Academia de Arte'}</p>
                </div>
              </div>

              {/* Datos personales */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-1 text-sm">
                <p className="font-semibold text-slate-700 mb-2">Estudiante</p>
                <p className="text-slate-600">{form.nombre} {form.apellido}</p>
                {form.edad && <p className="text-slate-500 text-xs">{form.edad} años</p>}
                {form.telefono && <p className="text-slate-500 text-xs">📱 {form.telefono}</p>}
                {form.email && <p className="text-slate-500 text-xs">✉ {form.email}</p>}
                {form.direccion && <p className="text-slate-500 text-xs">📍 {form.direccion}</p>}
                {form.atencionEspecial.requiere && <p className="text-amber-600 text-xs">⚠ Requiere atención especial</p>}
              </div>

              {/* Tutor (solo MCA) */}
              {!esTropical && form.tutor.requerido && form.tutor.nombre && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-1 text-sm">
                  <p className="font-semibold text-slate-700 mb-2">Tutor</p>
                  <p className="text-slate-600">{form.tutor.nombre} ({form.tutor.parentesco?.replace('_', ' ')})</p>
                  {form.tutor.celular && <p className="text-slate-500 text-xs">📱 {form.tutor.celular}</p>}
                  {form.tutor.email && <p className="text-slate-500 text-xs">✉ {form.tutor.email}</p>}
                </div>
              )}

              {/* Clases */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-700 mb-2">Clases seleccionadas</p>
                {form.clasesSeleccionadas.map(id => {
                  const c = clases.find(cl => cl._id === id)
                  return c ? (
                    <div key={id} className="flex justify-between text-slate-600">
                      <div>
                        <span className="font-medium">{c.nombre}</span>
                        {c.grupo && <span className="text-slate-400 text-xs"> · {c.grupo}</span>}
                      </div>
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
                Al enviar confirmas que los datos son correctos. La academia te contactará para validar tu inscripción.
              </p>
            </div>
          )}

          {/* Navegación */}
          <div className="flex gap-3 mt-6">
            {paso > 0 && (
              <button onClick={anterior}
                className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                Atrás
              </button>
            )}
            {paso < pasos.length - 1 ? (
              <button onClick={siguiente} disabled={paso === 0 && !form.academia}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${colorBtn} disabled:opacity-40 disabled:cursor-not-allowed`}>
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