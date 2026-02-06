import { getImageDataUrl } from '~/lib/documents-generation/pdfmake'

export async function printHolidayModel() {
  const imageData = await getImageDataUrl('/Picture.png')
  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [24, 24, 24, 24],
    content: [
      { text: 'MODELO DE VACACIONES', style: 'title', alignment: 'center' },
      { image: imageData, width: 520, alignment: 'center', margin: [0, 12, 0, 0] }
    ],
    styles: {
      title: { fontSize: 12, bold: true }
    }
  }

  usePDFMake().createPdf(docDefinition).open()
}
