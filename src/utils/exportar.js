import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── EXCEL ────────────────────────────────────────────────────────

export const exportarExcel = (datos, nombreArchivo, nombreHoja = 'Reporte') => {
  const ws = XLSX.utils.json_to_sheet(datos)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, nombreHoja)
  XLSX.writeFile(wb, `${nombreArchivo}.xlsx`)
}

export const exportarEstudiantesExcel = (estudiantes) => {
  const datos = estudiantes.map((est) => ({
    'Matrícula':        est.matricula || '—',
    'Nombre':           est.nombre,
    'Apellido':         est.apellido,
    'Email':            est.email || '—',
    'Teléfono':         est.telefono || '—',
    'Tutor':            est.tutor?.nombre ? `${est.tutor.nombre} ${est.tutor.apellido || ''}`.trim() : '—',
    'Celular tutor':    est.tutor?.celular || est.tutor?.telefono || '—',
    'Clases':           est.clases?.map(c => c.nombre).join(', ') || '—',
    'Estado':           est.estado,
    'Origen':           est.origenInscripcion === 'online' ? 'Online' : 'Admin',
    'Fecha inscripción': est.fechaInscripcion ? new Date(est.fechaInscripcion).toLocaleDateString('es-DO') : '—',
  }))
  exportarExcel(datos, `Estudiantes_${new Date().toLocaleDateString('es-DO').replace(/\//g, '-')}`, 'Estudiantes')
}

export const exportarPagosExcel = (pagos) => {
  const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const bancoLabel = {
    popular: 'Banco Popular', banreservas: 'Banreservas',
    bhd: 'BHD', asociacion_popular: 'Asoc. Popular'
  }
  const datos = pagos.map((p) => ({
    'Matrícula':   p.estudiante?.matricula || '—',
    'Estudiante':  `${p.estudiante?.nombre || ''} ${p.estudiante?.apellido || ''}`.trim(),
    'Clase':       p.clase?.nombre || '—',
    'Grupo':       p.clase?.grupo || '—',
    'Período':     `${meses[p.mes]} ${p.anio}`,
    'Monto':       p.monto,
    'Método':      p.metodoPago === 'transferencia' ? 'Transferencia' : 'Efectivo',
    'Banco':       p.banco ? (bancoLabel[p.banco] || p.banco) : '—',
    'Estado':      p.estado,
    'Fecha pago':  p.fechaPago ? new Date(p.fechaPago).toLocaleDateString('es-DO') : '—',
  }))
  exportarExcel(datos, `Pagos_${new Date().toLocaleDateString('es-DO').replace(/\//g, '-')}`, 'Pagos')
}

export const exportarMorosidadExcel = (morosos) => {
  const datos = morosos.map((m) => ({
    'Estudiante':       m.estudiante,
    'Clase':            m.clase,
    'Monto pendiente':  m.monto,
    'Celular tutor':    m.tutorTelefono || '—',
  }))
  exportarExcel(datos, `Morosidad_${new Date().toLocaleDateString('es-DO').replace(/\//g, '-')}`, 'Morosidad')
}

export const exportarMensualidadesExcel = (mensualidades, mes, anio) => {
  const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const estadoLabel = {
    aprobado: 'Pagado', comprobante_enviado: 'Comprobante enviado',
    pendiente: 'Pendiente', sin_pago: 'Sin pago'
  }
  const datos = mensualidades.map((m) => ({
    'Matrícula':   m.estudiante.matricula || '—',
    'Estudiante':  `${m.estudiante.nombre} ${m.estudiante.apellido}`,
    'Clase':       m.clase.nombre,
    'Grupo':       m.clase.grupo || '—',
    'Monto':       m.monto,
    'Estado':      estadoLabel[m.estado] || m.estado,
  }))
  exportarExcel(
    datos,
    `Mensualidades_${meses[mes]}_${anio}`,
    `${meses[mes]} ${anio}`
  )
}

// ── PDF ──────────────────────────────────────────────────────────

const crearPDFBase = (titulo, subtitulo) => {
  const doc = new jsPDF()

  // Header
  doc.setFillColor(24, 95, 165)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Academia Creativa', 14, 12)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(titulo, 14, 20)
  doc.setFontSize(9)
  doc.text(subtitulo, 14, 27)

  // Fecha generación
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-DO')}`, 150, 20)

  doc.setTextColor(0, 0, 0)
  return doc
}

export const exportarFinancieroPDF = (data) => {
  const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const doc = crearPDFBase(
    'Reporte Financiero',
    `Año ${data.anio} — Total: RD$${data.totalAnual?.toLocaleString('es-DO')}`
  )

  const filas = data.resumenMensual
    ?.filter(m => m.total > 0)
    .map(m => [
      meses[m.mes],
      `RD$${m.transferencia?.toLocaleString('es-DO') || 0}`,
      `RD$${m.efectivo?.toLocaleString('es-DO') || 0}`,
      `RD$${m.total?.toLocaleString('es-DO') || 0}`,
    ]) || []

  autoTable(doc, {
    startY: 38,
    head: [['Mes', 'Transferencia', 'Efectivo', 'Total']],
    body: filas,
    headStyles: { fillColor: [24, 95, 165], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' }
    },
    foot: [['TOTAL ANUAL', '', '', `RD$${data.totalAnual?.toLocaleString('es-DO') || 0}`]],
    footStyles: { fillColor: [24, 95, 165], textColor: 255, fontStyle: 'bold' }
  })

  doc.save(`Reporte_Financiero_${data.anio}.pdf`)
}

export const exportarMorosidadPDF = (data) => {
  const doc = crearPDFBase(
    'Reporte de Morosidad',
    `Mes actual — ${data.totalMorosos} estudiantes — RD$${data.totalPorCobrar?.toLocaleString('es-DO')} por cobrar`
  )

  const filas = data.morosos?.map(m => [
    m.estudiante,
    m.clase,
    m.tutorTelefono || '—',
    `RD$${m.monto?.toLocaleString('es-DO')}`,
  ]) || []

  autoTable(doc, {
    startY: 38,
    head: [['Estudiante', 'Clase', 'Tel. Tutor', 'Monto']],
    body: filas,
    headStyles: { fillColor: [24, 95, 165], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 9 },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold' }
    },
    foot: [['TOTAL', '', '', `RD$${data.totalPorCobrar?.toLocaleString('es-DO') || 0}`]],
    footStyles: { fillColor: [163, 45, 45], textColor: 255, fontStyle: 'bold' }
  })

  doc.save(`Reporte_Morosidad_${new Date().toLocaleDateString('es-DO').replace(/\//g, '-')}.pdf`)
}

export const exportarAsistenciaPDF = (data) => {
  const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const doc = crearPDFBase(
    'Reporte de Asistencia',
    `${meses[data.mes]} ${data.anio}`
  )

  const filas = data.reporte?.map(c => [
    c.clase,
    c.sesiones,
    `${c.totalPresencias}/${c.totalRegistros}`,
    `${c.tasaAsistencia}%`,
  ]) || []

  autoTable(doc, {
    startY: 38,
    head: [['Clase', 'Sesiones', 'Presencias', 'Tasa asistencia']],
    body: filas,
    headStyles: { fillColor: [24, 95, 165], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center', fontStyle: 'bold' }
    }
  })

  doc.save(`Reporte_Asistencia_${meses[data.mes]}_${data.anio}.pdf`)
}