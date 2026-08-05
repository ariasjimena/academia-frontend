import { useEffect, useState } from 'react'
import api from '../api/axios'
import BtnFactura from '../components/Factura'

const estadoConfig = {
  pendiente:           { label: 'Pendiente',           style: 'bg-slate-100 text-slate-500' },
  comprobante_enviado: { label: 'Comprobante enviado', style: 'bg-blue-50 text-blue-600' },
  aprobado:            { label: 'Aprobado',            style: 'bg-green-50 text-green-700' },
  rechazado:           { label: 'Rechazado',           style: 'bg-red-50 text-red-600' },
}

const bancoLabel = {
  popular: 'Banco Popular', banreservas: 'Banreservas',
  bhd: 'BHD', asociacion_popular: 'Asoc. Popular',
}

const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function Pagos() {
  const [pagos, setPagos]               = useState([])
  const [estudiantes, setEstudiantes]   = useState([])
  const [clases, setClases]             = useState([])
  const [cargando, setCargando]         = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalPago, setModalPago]       = useState(false)
  const [modalComp, setModalComp]       = useState(null)
  const [guardando, setGuardando]       = useState(false)
  const [error, setError]               = useState('')
  const [archivo, setArchivo]           = useState(null)
  const [form, setForm] = useState({
    estudianteId: '', claseId: '',
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    monto: '', metodoPago: 'transferencia', banco: ''
  })

  useEffect(() => {
    api.get('/estudiantes', { params: { limite: 500 } })
      .then(({ data }) => setEstudiantes(data.estudiantes))
      .catch(() => {})
    api.get('/clases')
      .then(({ data }) => setClases(data.clases))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let activo = true
    const ejecutar = async () => {
      setCargando(true)
      try {
        const params = filtroEstado ? { estado: filtroEstado } : {}
        const { data } = await api.get('/pagos', { params })
        if (!activo) return
        setPagos(data.pagos)
        setError('')
      } catch {
        if (activo) setError('Error al cargar pagos')
      } finally {
        if (activo) setCargando(false)
      }
    }
    ejecutar()
    return () => { activo = false }
  }, [filtroEstado])

  const recargar = () => setFiltroEstado(f => f + '')

  const handleCrearPago = async (e) => {
    e.preventDefault()
    if (form.metodoPago === 'transferencia' && !form.banco) {
      setError('Selecciona el banco de la transferencia')
      return
    }
    setGuardando(true)
    setError('')
    try {
      await api.post('/pagos', form)
      setModalPago(false)
      setForm({
        estudianteId: '', claseId: '',
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear(),
        monto: '', metodoPago: 'transferencia', banco: ''
      })
      recargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar pago')
    } finally {
      setGuardando(false)
    }
  }

  const handleSubirComprobante = async (e) => {
    e.preventDefault()
    if (!archivo) return
    setGuardando(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('comprobante', archivo)
      await api.post(`/pagos/${modalComp._id}/comprobante`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setModalComp(null)
      setArchivo(null)
      recargar()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al subir comprobante')
    } finally {
      setGuardando(false)
    }
  }

  const handleValidar = async (pagoId, accion) => {
    try {
      await api.put(`/pagos/${pagoId}/validar`, { accion })
      recargar()
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al validar')
    }
  }

  const moneda = (n) => `RD$${Number(n).toLocaleString('es-DO')}`

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Pagos</h1>
          <p className="text-sm text-slate-400">{pagos.length} registros</p>
        </div>
        <button onClick={() => { setError(''); setModalPago(true) }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar pago
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pendiente', 'comprobante_enviado', 'aprobado', 'rechazado'].map((e) => (
          <button key={e} onClick={() => setFiltroEstado(e)}
            className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
              filtroEstado === e
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            {e === '' ? 'Todos' : estadoConfig[e]?.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {cargando ? (
          <div className="text-center text-slate-400 text-sm py-16">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm py-16">{error}</div>
        ) : pagos.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-16">No hay pagos registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Matrícula</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Estudiante</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Clase</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Período</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Monto</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Pago</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Estado</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {pago.estudiante?.matricula || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {pago.estudiante?.nombre} {pago.estudiante?.apellido}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{pago.clase?.nombre}</div>
                      {pago.clase?.grupo && (
                        <div className="text-xs text-slate-400">{pago.clase.grupo}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{meses[pago.mes]} {pago.anio}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{moneda(pago.monto)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          pago.metodoPago === 'transferencia'
                            ? 'bg-purple-50 text-purple-600'
                            : 'bg-teal-50 text-teal-600'
                        }`}>
                          {pago.metodoPago === 'transferencia' ? 'Transferencia' : 'Efectivo'}
                        </span>
                        {pago.banco && (
                          <div className="text-xs text-slate-400 mt-0.5">{bancoLabel[pago.banco] || pago.banco}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoConfig[pago.estado]?.style}`}>
                        {estadoConfig[pago.estado]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Botón factura PDF — solo pagos aprobados */}
                        <BtnFactura pago={pago} academia={pago.academia || 'mca'} />

                        {pago.estado === 'pendiente' && pago.metodoPago === 'transferencia' && (
                          <button onClick={() => { setError(''); setModalComp(pago) }}
                            className="text-xs text-blue-600 hover:underline">
                            Comprobante
                          </button>
                        )}
                        {pago.estado === 'comprobante_enviado' && (
                          <>
                            <button onClick={() => handleValidar(pago._id, 'aprobar')}
                              className="text-xs text-green-600 hover:underline font-medium">
                              Aprobar
                            </button>
                            <button onClick={() => handleValidar(pago._id, 'rechazar')}
                              className="text-xs text-red-500 hover:underline">
                              Rechazar
                            </button>
                          </>
                        )}
                        {pago.estado === 'pendiente' && pago.metodoPago === 'efectivo' && (
                          <button onClick={() => handleValidar(pago._id, 'aprobar')}
                            className="text-xs text-green-600 hover:underline font-medium">
                            Confirmar
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

      {/* Modal registrar pago */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Registrar pago</h2>
              <button onClick={() => setModalPago(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCrearPago} className="px-6 py-4 space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Estudiante</label>
                <select required value={form.estudianteId}
                  onChange={(e) => setForm({ ...form, estudianteId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                  <option value="">Seleccionar...</option>
                  {estudiantes.map((est) => (
                    <option key={est._id} value={est._id}>
                      {est.matricula ? `[${est.matricula}] ` : ''}{est.nombre} {est.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Clase</label>
                <select required value={form.claseId}
                  onChange={(e) => setForm({ ...form, claseId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                  <option value="">Seleccionar...</option>
                  {clases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nombre}{c.grupo ? ` · ${c.grupo}` : ''} — RD${c.mensualidad?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mes</label>
                  <select value={form.mes} onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                    {meses.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Año</label>
                  <input type="number" required value={form.anio}
                    onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Monto (RD$)</label>
                <input type="number" required value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  placeholder="1800"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Método de pago</label>
                <select value={form.metodoPago}
                  onChange={(e) => setForm({ ...form, metodoPago: e.target.value, banco: '' })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                </select>
              </div>
              {form.metodoPago === 'transferencia' && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Banco</label>
                  <select value={form.banco} onChange={(e) => setForm({ ...form, banco: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-400 bg-white transition">
                    <option value="">Seleccionar banco...</option>
                    <option value="popular">Banco Popular</option>
                    <option value="banreservas">Banreservas</option>
                    <option value="bhd">BHD</option>
                    <option value="asociacion_popular">Asociación Popular</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalPago(false)}
                  className="flex-1 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={guardando}
                  className="flex-1 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition">
                  {guardando ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal subir comprobante */}
      {modalComp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Subir comprobante</h2>
              <button onClick={() => setModalComp(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubirComprobante} className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-600">
                Pago de <strong>{modalComp.estudiante?.nombre}</strong> — {meses[modalComp.mes]} {modalComp.anio}
              </p>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 transition"
                onClick={() => document.getElementById('comp-file').click()}>
                <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {archivo
                  ? <p className="text-sm text-blue-600 font-medium">{archivo.name}</p>
                  : <p className="text-sm text-slate-400">JPG, PNG o PDF · máx 5MB</p>
                }
                <input id="comp-file" type="file" accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden" onChange={(e) => setArchivo(e.target.files[0])} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModalComp(null)}
                  className="flex-1 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={!archivo || guardando}
                  className="flex-1 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition">
                  {guardando ? 'Subiendo...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}