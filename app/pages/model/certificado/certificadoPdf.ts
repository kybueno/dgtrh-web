import { getImageDataUrl } from '~/lib/documents-generation/pdfmake'

export async function printCertificadoModel() {
  const logoData = await getImageDataUrl('/uci-logo-row.png')
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [32, 32, 32, 32],
    content: [
      {
        image: logoData,
        width: 240,
        alignment: 'center',
        margin: [0, 0, 0, 16]
      },
      { text: 'MODELO DE CERTIFICADO', style: 'title', alignment: 'center' },
      {
        text: [
          'Área: ',
          { text: '__________________________________________\n\n' },
          'Nombre y Apellido: ',
          { text: '____________________________________\n\n' },
          'No. Expediente: ',
          { text: '________________________________________\n\n' },
          'Cargo: ',
          { text: '_______________________________________________\n\n' },
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
      title: { fontSize: 14, bold: true, margin: [0, 0, 0, 18] },
      body: { fontSize: 11, lineHeight: 1.35 }
    }
  }

  usePDFMake().createPdf(docDefinition).open()
}
