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

const formatMonthLabel = (month: number, year: number) => {
  const name = new Date(year, month - 1, 1).toLocaleDateString('es-ES', {
    month: 'long'
  })
  return `${name} ${year}`
}

const buildTableRows = (payload: PayrollSummaryPayload, incidentCodes: number[]) => {
  const totals = { hours: 0, h060: 0, h115: 0 }
  const rows: any[] = []

  payload.workers.forEach((entry) => {
    const incidentCells = incidentCodes.map((code) => {
      if (!Number.isFinite(code)) return ''
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
    { text: 'TOTALES', colSpan: 3 + incidentCodes.length, bold: true },
    ...Array(3 + incidentCodes.length - 1).fill(''),
    totals.hours ? totals.hours.toFixed(2) : '',
    totals.h060 ? totals.h060.toFixed(2) : '',
    totals.h115 ? totals.h115.toFixed(2) : '',
    ''
  ])

  return rows
}

export function generatePrenomina(payload: PayrollSummaryPayload, incidentCodesOverride?: number[]) {
  usePDFMake().createPdf(getPrenominaDefinition(payload, incidentCodesOverride)).open()
}

const getPrenominaDefinition = (payload: PayrollSummaryPayload, incidentCodesOverride?: number[]) => {
  const payroll = payload.payroll
  const monthLabel = formatMonthLabel(payroll.month, payroll.year)
  const createdBy = payroll.creator ? getDisplayName(payroll.creator) : '-'
  const reviewedBy = payroll.reviewer ? getDisplayName(payroll.reviewer) : '-'

  const incidentCodesWithData = payload.incidentTypes
    .map((type) => type.code)
    .filter((code) =>
      payload.workers.some((entry) => (entry.incidentDaysByType?.[code] ?? 0) > 0)
    )
  const incidentCodes =
    incidentCodesOverride?.length
      ? incidentCodesOverride
      : incidentCodesWithData.length > 0
        ? incidentCodesWithData
        : payload.incidentTypes.map((type) => type.code)

  const maxIncidentColumns = 10
  const incidentChunks: number[][] = []
  for (let i = 0; i < incidentCodes.length; i += maxIncidentColumns) {
    incidentChunks.push(incidentCodes.slice(i, i + maxIncidentColumns))
  }

  const tables = incidentChunks.length ? incidentChunks : [[Number.NaN]]

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
      ...tables.map((chunk, index) => {
        const incidentHeaderCells = chunk.map((code) => (Number.isFinite(code) ? String(code) : ''))
        return {
          table: {
            headerRows: 2,
            widths: [
              45,
              150,
              95,
              ...Array(chunk.length).fill(24),
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
                { text: 'INCIDENCIAS DEL TIEMPO NO LABORADO', colSpan: chunk.length },
                ...Array(Math.max(chunk.length - 1, 0)).fill(''),
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
              ...buildTableRows(payload, chunk)
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
          fontSize: 9,
          pageBreak: index < tables.length - 1 ? 'after' : undefined
        }
      })
    ],
    defaultStyle: {
      fontSize: 9
    }
  }
}
