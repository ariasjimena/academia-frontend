import { useEffect, useState } from 'react'
import api from '../api/axios'

const estadoConfig = {
  aprobado: { label: 'Pagado', style: 'bg-green-50 text-green-700' },
  comprobante_enviado: { label: 'Comprobante enviado', style: 'bg-blue-50 text-blue-600' },
  pendiente: { label: 'Pendiente', style: 'bg-amber-50 text-amber-600' },
  sin_pago: { label: 'Sin pago', style: 'bg-red-50 text-red-600' },
}

const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const IconoWhatsApp = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L0 24l6.335-1.502A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.368l-.36-.214-3.762.892.948-3.65-.235-.374A9.818 9.818 0 1112 21.818z" />
  </svg>
)

export default function Mensualidades() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [enviando, setEnviando] = useState(null)
  const [mensajeExito, setMensajeExito] = useState('')

  useEffect(() => {
    let activo = true
    const ejecutar = async () => {
      setCargando(true)
      try {
        const { data } = await api.get('/mensualidades', { params: { mes, anio } })
        if (!activo) return
        setDatos(data)
      } finally {
        if (activo) setCargando(false)
      }
    }
    ejecutar()
    return () => { activo = false }
  }, [mes, anio])

  const moneda = (n) => `RD$${Number(n).toLocaleString('es-DO')}`

  const lista = datos?.mensualidades?.filter((m) =>
    filtro ? m.estado === filtro : true
  ) ?? []

  const enviarRecordatorio = async (estudianteId, nombreEstudiante) => {
    setEnviando(estudianteId)
    setMensajeExito('')
    try {
      await api.post(`/notificaciones/recordatorio/${estudianteId}`)
      setMensajeExito(`✅ Recordatorio enviado a ${nombreEstudiante}`)
      setTimeout(() => setMensajeExito(''), 4000)
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al enviar recordatorio')
    } finally {
      setEnviando(null)
    }
  }

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Mensualidades</h1>
          <p className="text-sm text-slate-400">{meses[mes]} {anio}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white">
            {meses.slice(1).map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 w-24 outline-none focus:border-blue-400" />
        </div>
      </div>

      {mensajeExito && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-3">
          {mensajeExito}
        </div>
      )}

      {datos && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Total</p>
            <p className="text-2xl font-semibold text-slate-800">{datos.resumen.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Pagados</p>
            <p className="text-2xl font-semibold text-green-600">{datos.resumen.aprobados}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Pendientes</p>
            <p className="text-2xl font-semibold text-amber-500">{datos.resumen.pendientes}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">Por validar</p>
            <p className="text-2xl font-semibold text-blue-600">{datos.resumen.comprobanteEnviado}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {[
          { key: '', label: 'Todos' },
          { key: 'aprobado', label: 'Pagados' },
          { key: 'comprobante_enviado', label: 'Por validar' },
          { key: 'pendiente', label: 'Pendientes' },
          { key: 'sin_pago', label: 'Sin pago' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFiltro(key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${filtro === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {cargando ? (
          <div className="text-center text-slate-400 text-sm py-16">Cargando...</div>
        ) : lista.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-16">Sin registros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Matrícula</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Estudiante</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Clase</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Monto</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Estado</th>
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Recordatorio</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((item, i) => {
                  const sinPago = item.estado === 'sin_pago' || item.estado === 'pendiente'
                  const estaEnviando = enviando === item.estudiante.id
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.estudiante.matricula || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {item.estudiante.nombre} {item.estudiante.apellido}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        <div>{item.clase.nombre}</div>
                        {item.clase.grupo && (
                          <div className="text-xs text-slate-400">{item.clase.grupo}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">{moneda(item.monto)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoConfig[item.estado]?.style}`}>
                          {estadoConfig[item.estado]?.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {sinPago && item.estudiante.id && (
                          <button
                            onClick={() => enviarRecordatorio(
                              item.estudiante.id,
                              `${item.estudiante.nombre} ${item.estudiante.apellido}`
                            )}
                            disabled={estaEnviando}
                            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition ${estaEnviando
                                ? 'text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
                              }`}
                          >
                            <IconoWhatsApp />
                            {estaEnviando ? 'Enviando...' : 'WhatsApp'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}