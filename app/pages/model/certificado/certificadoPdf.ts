import { getImageDataUrl } from '~/lib/documents-generation/pdfmake'

const DEFAULT_AREA = 'Dirección de Gestión Tecnológica'

export async function printCertificadoModel(worker?: WorkerDetailed | WorkerInfo | null) {
  const logoData = await getImageDataUrl('/uci-logo-row.png')
  const areaName =
    worker?.group?.name ||
    worker?.leaderAtGroup?.name ||
    DEFAULT_AREA
  const workerName = worker ? getDisplayName(worker as any) : ''
  const recordNumber = worker?.record_number ?? ''
  const positionLabel =
    (worker as any)?.position?.description ||
    (worker as any)?.position?.name ||
    '____________________________'

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [32, 32, 32, 32],
    content: [
      {
        image: logoData,
        width: 160,
        alignment: 'left',
        margin: [0, 0, 0, 12]
      },
      { text: 'MODELO DE CERTIFICADO', style: 'title', alignment: 'center' },
      {
        text: [
          'Área: ',
          { text: worker ? `${areaName}\n\n` : '__________________________________________\n\n' },
          'Nombre y Apellidos: ',
          { text: worker ? `${workerName}\n\n` : '____________________________________\n\n' },
          'No. Expediente: ',
          { text: worker ? `${recordNumber}\n\n` : '________________________________________\n\n' },
          'Cargo: ',
          { text: worker ? `${positionLabel}\n\n` : '_______________________________________________\n\n' },
          'Fecha de Solicitud: ',
          { text: '___________________________________\n\n' },
          'Desde: ',
          { text: '____________  ' },
          'hasta: ',
          { text: '____________  ' },
          'a descontar: ',
          { text: '__________\n\n' },
          'Entregado por: ',
          { text: '___________________  ' },
          'recibido por: ',
          { text: '___________________' }
        ],
        style: 'body'
      }
    ],
    styles: {
      title: { fontSize: 12, bold: true, margin: [0, 0, 0, 14] },
      body: { fontSize: 11, lineHeight: 1.35 }
    }
  }

  usePDFMake().createPdf(docDefinition).open()
}
