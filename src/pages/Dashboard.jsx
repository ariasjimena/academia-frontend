import { useEffect, useState } from 'react'
import api from '../api/axios'

const StatCard = ({ label, value, sub, color = 'blue' }) => {
  const colors = {
    blue:  'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red:   'bg-red-50 text-red-600',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-slate-800">{value}</p>
      {sub && <p className={`text-xs mt-1 font-medium ${colors[color]}`}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/reportes/dashboard')
      .then(({ data }) => setStats(data.stats))
      .catch(() => setError('No se pudo cargar el dashboard'))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Cargando...
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
      {error}
    </div>
  )

  const moneda = (n) => `RD$${n?.toLocaleString('es-DO') ?? 0}`

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-400">Resumen general de la academia</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Estudiantes activos"  value={stats.estudiantesActivos} sub={`+${stats.nuevosEsteMes} este mes`} color="blue" />
        <StatCard label="Ingresos del mes"     value={moneda(stats.ingresosMes)}  sub="Pagos aprobados"   color="green" />
        <StatCard label="Pagos pendientes"     value={stats.pagosPendientes}      sub="Por validar"       color="amber" />
        <StatCard label="Clases activas"       value={stats.totalClases}          sub="Este período"      color="blue" />
      </div>

      {/* Ocupación por clase */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Ocupación por clase</h2>
        <div className="space-y-3">
          {stats.clases?.map((clase) => {
            const color = clase.ocupacion >= 90
              ? 'bg-green-500'
              : clase.ocupacion >= 70
              ? 'bg-blue-500'
              : 'bg-amber-400'
            return (
              <div key={clase.id}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">{clase.nombre}</span>
                  <span>{clase.inscritos}/{clase.cupos} · <span className="font-semibold">{clase.ocupacion}%</span></span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${color}`}
                    style={{ width: `${clase.ocupacion}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}