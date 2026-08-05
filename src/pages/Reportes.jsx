import { useState } from 'react'
import api from '../api/axios'
import {
  exportarEstudiantesExcel,
  exportarPagosExcel,
  exportarMorosidadExcel,
  exportarFinancieroPDF,
  exportarMorosidadPDF,
  exportarAsistenciaPDF
} from '../utils/exportar'

const anioActual = new Date().getFullYear()
const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const moneda = (n) => `RD$${Number(n || 0).toLocaleString('es-DO')}`

const BtnExcel = ({ onClick, label }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition">
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    {label}
  </button>
)

const BtnPDF = ({ onClick, label }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition">
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
    {label}
  </button>
)

export default function Reportes() {
  const [activo, setActivo]     = useState(null)
  const [datos, setDatos]       = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState('')
  const [mes, setMes]           = useState(new Date().getMonth() + 1)
  const [anio, setAnio]         = useState(anioActual)

  const cargar = async (tipo) => {
    setCargando(true)
    setError('')
    setDatos(null)
    setActivo(tipo)
    try {
      let data
      if (tipo === 'financiero') {
        const res = await api.get('/reportes/financiero', { params: { anio } })
        data = res.data
      } else if (tipo === 'asistencia') {
        const res = await api.get('/reportes/asistencia', { params: { mes, anio } })
        data = res.data
      } else if (tipo === 'morosidad') {
        const res = await api.get('/reportes/morosidad')
        data = res.data
      } else if (tipo === 'dashboard') {
        const res = await api.get('/reportes/dashboard')
        data = res.data
      } else if (tipo === 'estudiantes') {
        const res = await api.get('/estudiantes', { params: { limite: 500 } })
        data = res.data
      } else if (tipo === 'pagos') {
        const res = await api.get('/pagos', { params: { limite: 500 } })
        data = res.data
      }
      setDatos(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al generar reporte')
    } finally {
      setCargando(false)
    }
  }

  const reportes = [
    {
      key: 'dashboard',
      titulo: 'Resumen general',
      desc: 'Métricas globales de la academia',
      iconColor: 'bg-blue-50 text-blue-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    },
    {
      key: 'financiero',
      titulo: 'Reporte financiero',
      desc: 'Ingresos mensuales por método de pago',
      iconColor: 'bg-green-50 text-green-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
    {
      key: 'asistencia',
      titulo: 'Reporte de asistencia',
      desc: 'Tasa de asistencia por clase',
      iconColor: 'bg-amber-50 text-amber-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    },
    {
      key: 'morosidad',
      titulo: 'Reporte de morosidad',
      desc: 'Estudiantes con pagos vencidos',
      iconColor: 'bg-red-50 text-red-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    },
    {
      key: 'estudiantes',
      titulo: 'Listado de estudiantes',
      desc: 'Todos los estudiantes con sus datos',
      iconColor: 'bg-purple-50 text-purple-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    },
    {
      key: 'pagos',
      titulo: 'Listado de pagos',
      desc: 'Todos los pagos registrados',
      iconColor: 'bg-teal-50 text-teal-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Reportes</h1>
        <p className="text-sm text-slate-400">Genera y exporta reportes en Excel o PDF</p>
      </div>

      {/* Filtros período */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium text-slate-500">Período:</span>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 bg-white">
          {meses.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 w-24 outline-none focus:border-blue-400" />
      </div>

      {/* Cards de reportes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map((r) => (
          <button key={r.key} onClick={() => cargar(r.key)}
            className={`text-left bg-white rounded-xl border p-5 transition hover:shadow-sm ${
              activo === r.key ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'
            }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${r.iconColor}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {r.icon}
              </svg>
            </div>
            <p className="font-semibold text-slate-800 text-sm">{r.titulo}</p>
            <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">{error}</div>
      )}

      {cargando && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
          Generando reporte...
        </div>
      )}

      {/* Resultados */}
      {datos && !cargando && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          {/* Dashboard */}
          {activo === 'dashboard' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Resumen general</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Estudiantes activos', value: datos.stats?.estudiantesActivos },
                  { label: 'Nuevos este mes',     value: datos.stats?.nuevosEsteMes },
                  { label: 'Ingresos del mes',    value: moneda(datos.stats?.ingresosMes) },
                  { label: 'Pagos pendientes',    value: datos.stats?.pagosPendientes },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="text-xl font-semibold text-slate-800 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Este reporte no tiene exportación — usa los otros reportes para descargar datos.</p>
            </div>
          )}

          {/* Financiero */}
          {activo === 'financiero' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm font-semibold text-slate-700">Ingresos {datos.anio}</p>
                <div className="flex gap-2">
                  <BtnPDF onClick={() => exportarFinancieroPDF(datos)} label="Exportar PDF" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-400 py-2 pr-4">Mes</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-2 pr-4">Transferencia</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-2 pr-4">Efectivo</th>
                      <th className="text-right text-xs font-medium text-slate-400 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.resumenMensual?.map((m) => (
                      <tr key={m.mes} className={`border-b border-slate-50 ${m.total === 0 ? 'opacity-40' : ''}`}>
                        <td className="py-2 pr-4 font-medium text-slate-700">{meses[m.mes]}</td>
                        <td className="py-2 pr-4 text-right text-slate-600">{moneda(m.transferencia)}</td>
                        <td className="py-2 pr-4 text-right text-slate-600">{moneda(m.efectivo)}</td>
                        <td className="py-2 text-right font-semibold text-slate-800">{moneda(m.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200">
                      <td className="py-2 font-bold text-slate-800">Total anual</td>
                      <td></td><td></td>
                      <td className="py-2 text-right font-bold text-blue-600">{moneda(datos.totalAnual)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Asistencia */}
          {activo === 'asistencia' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  Asistencia — {meses[datos.mes]} {datos.anio}
                </p>
                <BtnPDF onClick={() => exportarAsistenciaPDF(datos)} label="Exportar PDF" />
              </div>
              {datos.reporte?.length === 0 ? (
                <p className="text-sm text-slate-400">No hay sesiones registradas en este período.</p>
              ) : (
                <div className="space-y-3">
                  {datos.reporte?.map((c, i) => {
                    const color = c.tasaAsistencia >= 85 ? 'bg-green-500' : c.tasaAsistencia >= 70 ? 'bg-amber-400' : 'bg-red-400'
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-medium">{c.clase}</span>
                          <span>{c.sesiones} sesiones · <strong>{c.tasaAsistencia}%</strong></span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${c.tasaAsistencia}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Morosidad */}
          {activo === 'morosidad' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Morosidad — mes actual</p>
                  <p className="text-xs text-slate-400">{datos.totalMorosos} estudiantes · {moneda(datos.totalPorCobrar)} por cobrar</p>
                </div>
                <div className="flex gap-2">
                  <BtnExcel onClick={() => exportarMorosidadExcel(datos)} label="Exportar Excel" />
                  <BtnPDF onClick={() => exportarMorosidadPDF(datos)} label="Exportar PDF" />
                </div>
              </div>
              {datos.morosos?.length === 0 ? (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                  No hay estudiantes morosos este mes.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-xs font-medium text-slate-400 py-2 pr-4">Estudiante</th>
                        <th className="text-left text-xs font-medium text-slate-400 py-2 pr-4">Clase</th>
                        <th className="text-left text-xs font-medium text-slate-400 py-2 pr-4">Tel. Tutor</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-2">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.morosos?.map((m, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-2 pr-4 font-medium text-slate-800">{m.estudiante}</td>
                          <td className="py-2 pr-4 text-slate-600">{m.clase}</td>
                          <td className="py-2 pr-4 text-slate-500">{m.tutorTelefono || '—'}</td>
                          <td className="py-2 text-right font-semibold text-red-600">{moneda(m.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Estudiantes */}
          {activo === 'estudiantes' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Listado de estudiantes</p>
                  <p className="text-xs text-slate-400">{datos.total} estudiantes</p>
                </div>
                <BtnExcel onClick={() => exportarEstudiantesExcel(datos.estudiantes)} label="Exportar Excel" />
              </div>
              <p className="text-xs text-slate-400">
                El Excel incluye: matrícula, nombre, email, teléfono, tutor, clases, estado y fecha de inscripción.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                {datos.total} estudiantes listos para exportar.
              </div>
            </div>
          )}

          {/* Pagos */}
          {activo === 'pagos' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Listado de pagos</p>
                  <p className="text-xs text-slate-400">{datos.total} pagos</p>
                </div>
                <BtnExcel onClick={() => exportarPagosExcel(datos.pagos)} label="Exportar Excel" />
              </div>
              <p className="text-xs text-slate-400">
                El Excel incluye: matrícula, estudiante, clase, período, monto, método, banco y estado.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                {datos.total} pagos listos para exportar.
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}