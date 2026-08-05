import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Estudiantes from './pages/Estudiantes'
import Pagos from './pages/Pagos'
import Mensualidades from './pages/Mensualidades'
import Clases from './pages/Clases'
import Reportes from './pages/Reportes'
import Layout from './components/Layout'
import Portal from './pages/portal/Portal'
import Inscripcion from './pages/Inscripcion'
import PanelProfesor from './pages/profesor/PanelProfesor'
import Inicio from './pages/Inicio'
import Bienvenida from './pages/Bienvenida'
import InicioTropical from './pages/InicioTropical'
import InscripcionTropical from './pages/InscripcionTropical'

function RutaProtegida({ children }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Bienvenida />} />
<Route path="/mca" element={<Inicio />} />
<Route path="/tropical" element={<InicioTropical />} />
<Route path="/tropical/inscripcion" element={<InscripcionTropical />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscripcion" element={<Inscripcion />} />

      {/* Portal tutor */}
      <Route path="/portal" element={
        <RutaProtegida><Portal /></RutaProtegida>
      } />

      <Route path="/profesor" element={
  <RutaProtegida><PanelProfesor /></RutaProtegida>
} />

      {/* Panel admin */}
      <Route path="/dashboard" element={
        <RutaProtegida><Layout><Dashboard /></Layout></RutaProtegida>
      } />
      <Route path="/estudiantes" element={
        <RutaProtegida><Layout><Estudiantes /></Layout></RutaProtegida>
      } />
      <Route path="/clases" element={
        <RutaProtegida><Layout><Clases /></Layout></RutaProtegida>
      } />
      <Route path="/pagos" element={
        <RutaProtegida><Layout><Pagos /></Layout></RutaProtegida>
      } />
      <Route path="/mensualidades" element={
        <RutaProtegida><Layout><Mensualidades /></Layout></RutaProtegida>
      } />
      <Route path="/reportes" element={
        <RutaProtegida><Layout><Reportes /></Layout></RutaProtegida>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}