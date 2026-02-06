type PayrollSummaryWorker = {
  worker: WorkerDetailed
  incidentDaysByType: Record<number, number>
  extraWorkHours: number
  observation: string | null
}

type PayrollSummaryPayload = {
  payroll: PayrollInfo & {
    creator?: WorkerInfo | null
    reviewer?: WorkerInfo | null
  }
  incidentTypes: IncidentType[]
  workers: PayrollSummaryWorker[]
}

const PAYROLL_INCIDENT_CODES = [12, 15, 21, 22, 23, 25, 26, 27, 32, 36]

const formatMonthLabel = (month: number, year: number) => {
  const name = new Date(year, month - 1, 1).toLocaleDateString('es-ES', {
    month: 'long'
  })
  return `${name} ${year}`
}

const buildTableRows = (payload: PayrollSummaryPayload) => {
  const totals = { hours: 0, h060: 0, h115: 0 }
  const rows: any[] = []

  payload.workers.forEach((entry) => {
    const incidentCells = PAYROLL_INCIDENT_CODES.map((code) => {
      const value = entry.incidentDaysByType?.[code] ?? 0
      return value === 0 ? '' : value
    })

    const hours = Number(entry.extraWorkHours ?? 0)
    const h060 = 0
    const h115 = 0

    totals.hours += hours
    totals.h060 += h060
    totals.h115 += h115

    rows.push([
      entry.worker.record_number ?? '',
      getDisplayName(entry.worker),
      entry.worker.position?.description ?? entry.worker.position_code ?? '',
      ...incidentCells,
      hours ? hours.toFixed(2) : '',
      h060 ? h060.toFixed(2) : '',
      h115 ? h115.toFixed(2) : '',
      entry.observation ?? ''
    ])
  })

  rows.push([
    { text: 'TOTALES', colSpan: 3 + PAYROLL_INCIDENT_CODES.length, bold: true },
    ...Array(3 + PAYROLL_INCIDENT_CODES.length - 1).fill(''),
    totals.hours ? totals.hours.toFixed(2) : '',
    totals.h060 ? totals.h060.toFixed(2) : '',
    totals.h115 ? totals.h115.toFixed(2) : '',
    ''
  ])

  return rows
}

export function generatePrenomina(payload: PayrollSummaryPayload) {
  usePDFMake().createPdf(getPrenominaDefinition(payload)).open()
}

const getPrenominaDefinition = (payload: PayrollSummaryPayload) => {
  const payroll = payload.payroll
  const monthLabel = formatMonthLabel(payroll.month, payroll.year)
  const createdBy = payroll.creator ? getDisplayName(payroll.creator) : '-'
  const reviewedBy = payroll.reviewer ? getDisplayName(payroll.reviewer) : '-'

  const incidentHeaderCells = PAYROLL_INCIDENT_CODES.map((code) => String(code))

  return {
    pageOrientation: 'landscape',
    pageSize: 'A4',
    pageMargins: [20, 30, 20, 30],
    content: [
      {
        table: {
          widths: ['*', '*'],
          body: [[
            {
              text: [
                'ORGANISMO: MES\n',
                'ENTIDAD: UCI\n',
                'AREA: Dirección de Gestión de Tecnología\n',
                'PRENÓMINA DE PAGO'
              ],
              bold: true,
              alignment: 'left'
            },
            {
              text: [
                `Fecha: ${monthLabel}\n`,
                `CONFEC. POR: ${createdBy}\n`,
                `REVISADO Y APROBADO POR: ${reviewedBy}`
              ],
              bold: true,
              alignment: 'left'
            }
          ]]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 6]
      },
      {
        table: {
          headerRows: 2,
          widths: [
            45,
            150,
            95,
            ...Array(PAYROLL_INCIDENT_CODES.length).fill(24),
            40,
            40,
            40,
            90
          ],
          body: [
            [
              { text: 'No.Ex.', rowSpan: 2 },
              { text: 'Nombres y Apellidos', rowSpan: 2 },
              { text: 'Cargo', rowSpan: 2 },
              { text: 'INCIDENCIAS DEL TIEMPO NO LABORADO', colSpan: PAYROLL_INCIDENT_CODES.length },
              ...Array(PAYROLL_INCIDENT_CODES.length - 1).fill(''),
              { text: 'TRABAJO EXTRAORDINARIO', colSpan: 3 },
              '', '',
              { text: 'Observaciones', rowSpan: 2 }
            ],
            [
              '',
              '',
              '',
              ...incidentHeaderCells,
              'Horas',
              '0.60',
              '1.15',
              ''
            ],
            ...buildTableRows(payload)
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#000',
          vLineColor: () => '#000',
          paddingLeft: () => 3,
          paddingRight: () => 3,
          paddingTop: () => 2,
          paddingBottom: () => 2
        },
        fontSize: 9
      }
    ],
    defaultStyle: {
      fontSize: 9
    }
  }
}
