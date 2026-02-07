import { defaultRhTableStyles } from "~/lib/documents-generation/styles";
import { getImageDataUrl } from "~/lib/documents-generation/pdfmake";

export const exportSignSheet = (
  worker: WorkerDetailed,
  date: Date = new Date()
) => {
  const month = date.getMonth();
  const monthName = date.toLocaleDateString("es-US", { month: "long" });
  const signSheetDocumentDefinition = {
    content: [
      {
        style: "rhTableStyle",
        color: "#444",
        table: {
          widths: [200, "auto", "auto"],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [
              {
                text: `Hoja de Firma de ${getDisplayName(worker)}`,
                style: "tableHeader",
                colSpan: 2,
                alignment: "center",
              },
              {},
              { text: "Header 3", style: "tableHeader", alignment: "center" },
            ],
            [
              {
                text: monthName,
                style: "tableHeader",
                alignment: "center",
              },
              { text: "Header 2", style: "tableHeader", alignment: "center" },
              { text: "Header 3", style: "tableHeader", alignment: "center" },
            ],
            ["Sample value 1", "Sample value 2", "Sample value 3"],
            [
              {
                rowSpan: 3,
                text: "rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor",
              },
              "Sample value 2",
              "Sample value 3",
            ],
            ["", "Sample value 2", "Sample value 3"],
            ["Sample value 1", "Sample value 2", "Sample value 3"],
            [
              "Sample value 1",
              {
                colSpan: 2,
                rowSpan: 2,
                text: "Both:\nrowSpan and colSpan\ncan be defined at the same time",
              },
              "",
            ],
            ["Sample value 1", "", ""],
          ],
        },
      },
    ],
    styles: defaultRhTableStyles,
    defaultStyle: {
      // alignment: 'justify'
    },
  };
  usePDFMake().createPdf(signSheetDocumentDefinition).open();
};
export async function generateSignSheet(
  worker: WorkerDetailed,
  date: Date = new Date()
) {
  const logoData = await getImageDataUrl("/uci-logo.png");
  usePDFMake().createPdf(getSignSheetDefinition(worker, date, logoData)).open();
}
const getSignSheetDefinition = (
  worker: WorkerDetailed,
  date = new Date(),
  logoData?: string
) => {
  const monthName = date
    .toLocaleDateString("es-ES", { month: "long" })
    .toUpperCase();
  const year = date.getFullYear();
  const areaLabel =
    worker.group?.name ||
    worker.led_groups?.[0]?.name ||
    ""

  // Column widths matching the original HTML structure
  const columnWidths = [
    28, // Day number
    41.8, // Morning Entry
    41.8, // Morning Exit
    57.65, // Afternoon Entry
    45.9, // Afternoon Exit
    40.4, // Overtime Start
    91.4, // Overtime End
    41.86, // Signature

    // Right side (days 17-31)
    22.56, // Day number
    25.89, // Morning Entry
    34.9, // Morning Exit
    48.75, // Afternoon Entry
    39.25, // Afternoon Exit
    34.2, // Overtime Start
    77.25, // Overtime End
    62.8, // Signature
  ];

  const HOLIDAYS = [
    // Formato: MM-DD
    "01-01", // Año Nuevo
    "05-01", // Día del Trabajador
    "07-26", // Día de la Rebeldía Nacional
    "10-10", // Inicio de las guerras de independencia
    "12-25", // Navidad
  ];

  function isHoliday(date: Date) {
    const mmdd = date.toISOString().slice(5, 10);
    return HOLIDAYS.includes(mmdd);
  }

  function isWeekend(date: Date) {
    const d = date.getDay(); // 0 domingo, 6 sábado
    return d === 0 || d === 6;
  }

  function getBackgroundForDay(date: Date) {
    if (isHoliday(date)) return "#FFD7D7"; // rojo claro para feriados
    if (isWeekend(date)) return "#E0E0E0"; // gris para fin de semana
    return null;
  }

  // Create day rows (1-16 on left, 17-31 on right)
  const dayRows = [];
  for (let i = 0; i < 16; i++) {
    const dayLeft = i + 1;
    const dayRight = i + 17;

    const leftDate = new Date(date.getFullYear(), date.getMonth(), dayLeft);
    const rightDate =
      dayRight <= 31
        ? new Date(date.getFullYear(), date.getMonth(), dayRight)
        : null;

    const bgLeft = getBackgroundForDay(leftDate);
    const bgRight = rightDate ? getBackgroundForDay(rightDate) : null;

    dayRows.push([
      { text: dayLeft.toString(), style: "dayCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "timeCell", fillColor: bgLeft },
      { text: "", style: "signatureCell" },
      {
        text: dayRight <= 31 ? dayRight.toString() : "",
        style: "dayCell",
        fillColor: bgRight,
      },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "timeCell", fillColor: bgRight },
      { text: "", style: "signatureCell", fillColor: bgRight },
    ]);
  }

  return {
    pageOrientation: "landscape",
    pageSize: "A4",
    pageMargins: [20, 40, 20, 40],
    content: [
      // Header section
      {
        columns: [
          {
            image: logoData,
            width: 80,
          },
          {
            text: "REGISTRO DE ASISTENCIA",
            style: "mainTitle",
            alignment: "center",
            margin: [0, 10, 0, 0],
          },
        ],
      },

      // Employee information section
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: `Organismo: MES`,
                style: "orgInfo",
                border: [true, true, true, false],
              },
            ],
            [
              {
                text: `Dirección: DIRECCIÓN DE GESTIÓN TECNOLÓGICA`,
                style: "orgInfo",
                border: [true, false, true, false],
              },
            ],
            [
              {
                text: `Área: ${areaLabel}`,
                style: "orgInfo",
                border: [true, false, true, true],
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
        },
        margin: [0, 10, 0, 10],
      },

      // Employee details and month/year
      {
        columns: [
          {
            text: `Nombre y Apellidos: ${getDisplayName(worker)}`,
            style: "employeeInfo",
          },
          {
            text: `Mes: ${monthName}`,
            style: "monthInfo",
            alignment: "center",
          },
          {
            text: `Año: ${year}`,
            style: "yearInfo",
            alignment: "right",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      // Main attendance table
      {
        table: {
          headerRows: 2,
          widths: columnWidths,
          body: [
            // First header row
            [
              { text: "", rowSpan: 2, style: "tableHeader" },
              { text: "Mañana", colSpan: 2, style: "tableHeader" },
              {},
              { text: "Tarde", colSpan: 2, style: "tableHeader" },
              {},
              {
                text: "Trabajo extraordinario",
                colSpan: 2,
                style: "tableHeader",
              },
              {},
              { text: "Firma", rowSpan: 2, style: "tableHeader" },

              { text: "", rowSpan: 2, style: "tableHeader" },
              { text: "Mañana", colSpan: 2, style: "tableHeader" },
              {},
              { text: "Tarde", colSpan: 2, style: "tableHeader" },
              {},
              {
                text: "Trabajo extraordinario",
                colSpan: 2,
                style: "tableHeader",
              },
              {},
              { text: "Firma", rowSpan: 2, style: "tableHeader" },
            ],

            // Second header row
            [
              {}, // Empty because of rowSpan above
              { text: "Ent.", style: "tableHeader" },
              { text: "Salid.", style: "tableHeader" },
              { text: "Entrada", style: "tableHeader" },
              { text: "Salida", style: "tableHeader" },
              { text: "Inicio", style: "tableHeader" },
              { text: "Terminación", style: "tableHeader" },
              {}, // Empty because of rowSpan above

              {}, // Empty because of rowSpan above
              { text: "Ent.", style: "tableHeader" },
              { text: "Salid.", style: "tableHeader" },
              { text: "Entrada", style: "tableHeader" },
              { text: "Salida", style: "tableHeader" },
              { text: "Inicio", style: "tableHeader" },
              { text: "Terminación", style: "tableHeader" },
              {}, // Empty because of rowSpan above
            ],

            // Day rows
            ...dayRows,
          ],
        },
        layout: {
          defaultBorder: true,
          paddingLeft: () => 2,
          paddingRight: () => 2,
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
      },
      {
        text: "Aprobado por:",
        alignment: "left",
        margin: [10, 10, 0, 0],
        fontSize: 10,
        bold: true,
      },
      {
        stack: [
          {
            text: "Nombre y Apellido: Lester Rodriguez Vallejo",
            alignment: "left",
            fontSize: 10,
            margin: [10, 10, 0, 0],
          },
          {
            text: "Firma: _________________________",
            alignment: "right",
            fontSize: 10,
            margin: [0, 0, 0, 2],
          },
        ],
        alignment: "right",
        margin: [0, 10, 10, 0],
        width: "auto",
      },
    ],
    styles: {
      mainTitle: {
        fontSize: 16,
        bold: true,
        margin: [0, 15, 0, 0],
      },
      orgInfo: {
        fontSize: 10,
        bold: true,
      },
      employeeInfo: {
        fontSize: 12,
        bold: true,
      },
      monthInfo: {
        fontSize: 16,
        bold: true,
      },
      yearInfo: {
        fontSize: 10,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: "center",
        fillColor: "#eeeeee",
      },
      dayCell: {
        alignment: "center",
        fontSize: 10,
        bold: true,
      },
      timeCell: {
        alignment: "center",
        fontSize: 10,
      },
      signatureCell: {
        alignment: "center",
        fontSize: 10,
        margin: [0, 10, 0, 0],
      },
    },
    defaultStyle: {
      // font: "Helvetica",
    },
  };
};

// Example usage:
// const pdfDocDefinition = getSignSheetDefinition(
//   { name: 'Karen Yoselin Bueno Aceo', id: '23214' },
//   new Date(2025, 6, 1) // July 2025
// );
// pdfMake.createPdf(pdfDocDefinition).open();
