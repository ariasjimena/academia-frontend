import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const meses = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const bancoLabel = {
  popular: 'Banco Popular', banreservas: 'Banreservas',
  bhd: 'BHD', asociacion_popular: 'Asociación Popular'
}

export const generarFacturaPDF = (pago, academia = 'mca') => {
  const doc = new jsPDF()
  const esTropical = academia === 'tropical'
  const colorPrimario = esTropical ? [249, 115, 22] : [45, 95, 124]
  const nombreAcademia = esTropical ? 'Mundo Tropical Academia' : 'MCA — Academia de Arte'
  const numeroFactura = `F-${String(pago._id).slice(-8).toUpperCase()}`

  // Header
  doc.setFillColor(...colorPrimario)
  doc.rect(0, 0, 210, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(nombreAcademia, 14, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Carretera Sánchez, Plaza Saomy — San Cristóbal', 14, 21)
  doc.text('Tel: 809-589-3831  |  Info.mca2024@gmail.com', 14, 27)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURA', 160, 14)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(numeroFactura, 160, 20)
  doc.text(new Date().toLocaleDateString('es-DO'), 160, 26)

  // Datos del estudiante
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Facturado a:', 14, 48)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const estudiante = pago.estudiante
  doc.text(`${estudiante?.nombre || ''} ${estudiante?.apellido || ''}`, 14, 55)
  if (estudiante?.matricula) doc.text(`Matrícula: ${estudiante.matricula}`, 14, 61)
  if (estudiante?.tutor?.nombre) doc.text(`Tutor: ${estudiante.tutor.nombre}`, 14, 67)
  if (estudiante?.tutor?.celular) doc.text(`Tel: ${estudiante.tutor.celular}`, 14, 73)
  if (estudiante?.telefono && !estudiante?.tutor?.celular) doc.text(`Tel: ${estudiante.telefono}`, 14, 67)

  // Badge estado
  const estadoColor = pago.estado === 'aprobado' ? [34, 197, 94] : [234, 179, 8]
  doc.setFillColor(...estadoColor)
  doc.roundedRect(150, 45, 45, 12, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(pago.estado === 'aprobado' ? 'PAGADO' : 'PENDIENTE', 172.5, 53, { align: 'center' })

  // Tabla detalle
  doc.setTextColor(0, 0, 0)
  autoTable(doc, {
    startY: 82,
    head: [['Descripción', 'Período', 'Método de pago', 'Monto']],
    body: [[
      `${pago.clase?.nombre || 'Clase'}${pago.clase?.grupo ? ' · ' + pago.clase.grupo : ''}`,
      `${meses[pago.mes]} ${pago.anio}`,
      pago.metodoPago === 'transferencia'
        ? `Transferencia${pago.banco ? '\n' + (bancoLabel[pago.banco] || pago.banco) : ''}`
        : 'Efectivo',
      `RD$${Number(pago.monto).toLocaleString('es-DO')}`
    ]],
    headStyles: { fillColor: colorPrimario, textColor: 255, fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 10, minCellHeight: 14 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } }
  })

  const finalY = doc.lastAutoTable.finalY + 8

  // Total
  doc.setFillColor(248, 250, 252)
  doc.rect(120, finalY, 76, 16, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('TOTAL:', 125, finalY + 10)
  doc.setTextColor(...colorPrimario)
  doc.setFontSize(14)
  doc.text(`RD$${Number(pago.monto).toLocaleString('es-DO')}`, 192, finalY + 11, { align: 'right' })

  if (pago.fechaPago) {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de pago: ${new Date(pago.fechaPago).toLocaleDateString('es-DO')}`, 14, finalY + 10)
  }

  if (pago.notas) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(150, 150, 150)
    doc.text(`Nota: ${pago.notas}`, 14, finalY + 20)
  }

  // Footer
  doc.setFillColor(...colorPrimario)
  doc.rect(0, 270, 210, 27, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('¡Gracias por confiar en nosotros!', 105, 278, { align: 'center' })
  doc.text('Arte en familia, arte para todos  |  Carretera Sánchez, Plaza Saomy, San Cristóbal', 105, 284, { align: 'center' })
  doc.text(`Generado el ${new Date().toLocaleDateString('es-DO')} — ${numeroFactura}`, 105, 290, { align: 'center' })

  doc.save(`Factura_${numeroFactura}_${estudiante?.matricula || 'EST'}.pdf`)
}

export default function BtnFactura({ pago, academia, size = 'sm' }) {
  if (!pago || pago.estado !== 'aprobado') return null

  return (
    <button
      onClick={() => generarFacturaPDF(pago, academia)}
      className={`flex items-center gap-1.5 font-medium rounded-lg border transition ${
        size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-4 py-2'
      } border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50`}
      title="Descargar factura PDF"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Factura PDF
    </button>
  )
}
