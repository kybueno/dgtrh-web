import { getImageDataUrl } from '~/lib/documents-generation/pdfmake'

const DEFAULT_AREA = 'Dirección de Gestión Tecnológica'

type CertificadoDates = {
  requestDate?: string
  fromDate?: string
  toDate?: string
}

function formatDate(value?: string) {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('es-ES')
}

export async function printCertificadoModel(
  worker?: WorkerDetailed | WorkerInfo | null,
  dates?: CertificadoDates
) {
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
    ''
  const requestDate = formatDate(dates?.requestDate)
  const fromDate = formatDate(dates?.fromDate)
  const toDate = formatDate(dates?.toDate)

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [32, 32, 32, 32],
    content: [
      {
        image: logoData,
        width: 80,
        alignment: 'left',
        margin: [0, 0, 0, 10]
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
          { text: requestDate ? `${requestDate}\n\n` : '___________________________________\n\n' },
          'Desde: ',
          { text: fromDate ? `${fromDate}  ` : '____________  ' },
          'hasta: ',
          { text: toDate ? `${toDate}  ` : '____________  ' },
          'a descontar: ',
          { text: '__________\n\n' },
          'Entregado por: ',
          { text: '______________________________\n\n' },
          'Recibido por: ',
          { text: '______________________________' }
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
