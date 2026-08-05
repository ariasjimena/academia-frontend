import { useEffect, useState } from 'react'
import api from '../../api/axios'
import PortalLayout from './PortalLayout'

const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const estadoConfig = {
  pendiente:           { label: 'Pendiente',           style: 'bg-amber-50 text-amber-600',  border: 'border-amber-200' },
  comprobante_enviado: { label: 'Comprobante enviado', style: 'bg-blue-50 text-blue-600',    border: 'border-blue-200' },
  aprobado:            { label: 'Pagado',              style: 'bg-green-50 text-green-700',  border: 'border-green-200' },
  rechazado:           { label: 'Rechazado',           style: 'bg-red-50 text-red-600',      border: 'border-red-200' },
}

const diasLabel = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb'
}

const moneda = (n) => `RD$${Number(n || 0).toLocaleString('es-DO')}`

export default function Portal() {
  const [datos, setDatos]         = useState(null)
  const [cargando, setCargando]   = useState(true)
  const [modalComp, setModalComp] = useState(null)
  const [archivo, setArchivo]     = useState(null)
  const [subiendo, setSubiendo]   = useState(false)
  const [errorComp, setErrorComp] = useState('')
  const [exito, setExito]         = useState('')

  const cargar = async () => {
    setCargando(true)
    try {
      const { data } = await api.get('/portal/mis-datos')
      setDatos(data)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true
    const ejecutar = async () => {
      setCargando(true)
      try {
        const { data } = await api.get('/portal/mis-datos')
        if (!activo) return
        setDatos(data)
      } finally {
        if (activo) setCargando(false)
      }
    }
    ejecutar()
    return () => { activo = false }
  }, [])

  const handleSubir = async (e) => {
    e.preventDefault()
    if (!archivo) return
    setSubiendo(true)
    setErrorComp('')
    try {
      const formData = new FormData()
      formData.append('comprobante', archivo)
      await api.post(`/pagos/${modalComp._id}/comprobante`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setModalComp(null)
      setArchivo(null)
      setExito('Comprobante enviado. La administración lo revisará pronto.')
      cargar()
      setTimeout(() => setExito(''), 5000)
    } catch (err) {
      setErrorComp(err.response?.data?.mensaje || 'Error al subir el archivo')
    } finally {
      setSubiendo(false)
    }
  }

  if (cargando) return (
    <PortalLayout>
      <div className="text-center text-slate-400 text-sm py-20">Cargando tu portal...</div>
    </PortalLayout>
  )

  const { estudiantes, pagos, resumen } = datos

  return (
    <PortalLayout>
      <div className="space-y-6">

        {exito && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-3">
            {exito}
          </div>
        )}

        {/* Resumen del mes */}
        <div>
        <h1 className="text-lg font-semibold text-slate-800 mb-4">Resumen general</h1>
          <div className="grid grid-cols-3 gap-3">
  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
    <p className="text-2xl font-semibold text-slate-800">{resumen.totalEstudiantes}</p>
    <p className="text-xs text-slate-400 mt-1">Estudiantes</p>
  </div>
  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
    <p className="text-2xl font-semibold text-green-600">{resumen.pagosAprobados}</p>
    <p className="text-xs text-slate-400 mt-1">Pagos aprobados</p>
  </div>
  <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
    <p className="text-2xl font-semibold text-amber-500">{resumen.pagosPendientes}</p>
    <p className="text-xs text-slate-400 mt-1">Pendientes</p>
  </div>
</div>
        </div>

        {/* Estudiantes y clases */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Mis estudiantes</h2>
          <div className="space-y-3">
            {estudiantes.map((est) => (
              <div key={est._id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center shrink-0">
                    {est.nombre[0]}{est.apellido[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{est.nombre} {est.apellido}</p>
                    <p className="text-xs text-slate-400">Inscrito desde {new Date(est.fechaInscripcion).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {est.clases?.length > 0 && (
                  <div className="space-y-2">
                    {est.clases.map((clase) => (
                      <div key={clase._id} className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-700">{clase.nombre}</p>
                          <span className="text-xs text-slate-500 capitalize">{clase.nivel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {clase.horarios?.map((h, i) => (
                            <span key={i} className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                              {diasLabel[h.dia]} {h.horaInicio}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">
                          Mensualidad: <span className="font-semibold text-slate-600">{moneda(clase.mensualidad)}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Historial de pagos */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Historial de pagos</h2>
          {pagos.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
              No hay pagos registrados aún
            </div>
          ) : (
            <div className="space-y-2">
              {pagos.map((pago) => {
                const cfg = estadoConfig[pago.estado]
                const puedeSubir = pago.estado === 'pendiente' && pago.metodoPago === 'transferencia'
                return (
                  <div key={pago._id} className={`bg-white rounded-xl border p-4 ${cfg.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {meses[pago.mes]} {pago.anio} — {pago.clase?.nombre}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {pago.estudiante?.nombre} {pago.estudiante?.apellido} ·{' '}
                          {pago.metodoPago === 'transferencia' ? 'Transferencia' : 'Efectivo'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{moneda(pago.monto)}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${cfg.style}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>

                    {puedeSubir && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => { setErrorComp(''); setArchivo(null); setModalComp(pago) }}
                          className="w-full text-sm text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 font-medium transition"
                        >
                          Subir comprobante de pago
                        </button>
                      </div>
                    )}

                    {pago.estado === 'comprobante_enviado' && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-blue-600">
                          Comprobante enviado el {new Date(pago.comprobante?.fechaSubida).toLocaleDateString('es-DO')}. Pendiente de validación.
                        </p>
                      </div>
                    )}

                    {pago.estado === 'rechazado' && pago.notas && (
                      <div className="mt-3 pt-3 border-t border-red-100">
                        <p className="text-xs text-red-500">Motivo: {pago.notas}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

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
            <form onSubmit={handleSubir} className="px-6 py-5 space-y-4">
              {errorComp && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{errorComp}</div>
              )}
              <p className="text-sm text-slate-600">
                Pago de <strong>{meses[modalComp.mes]} {modalComp.anio}</strong> · {moneda(modalComp.monto)}
              </p>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 transition"
                onClick={() => document.getElementById('portal-file').click()}
              >
                <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {archivo
                  ? <p className="text-sm text-blue-600 font-medium">{archivo.name}</p>
                  : <p className="text-sm text-slate-400">Toca para seleccionar · JPG, PNG o PDF</p>
                }
                <input id="portal-file" type="file" accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden" onChange={(e) => setArchivo(e.target.files[0])} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModalComp(null)}
                  className="flex-1 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={!archivo || subiendo}
                  className="flex-1 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition">
                  {subiendo ? 'Enviando...' : 'Enviar comprobante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PortalLayout>
  )
}