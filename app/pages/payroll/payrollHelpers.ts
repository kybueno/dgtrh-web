export function generatePrenomina(
  workers: WorkerInfo[],
  date: Date = new Date()
) {
  usePDFMake().createPdf(getPrenominaDefinition(workers, date)).open();
}

const getPrenominaDefinition = (
  workers: WorkerInfo[],
  date: Date = new Date()
) => {
  const monthName = date
    .toLocaleDateString("es-ES", { month: "long" })
    .toUpperCase();
  const year = date.getFullYear();

  return {
    pageOrientation: "landscape",
    pageSize: "A4",
    pageMargins: [20, 40, 20, 40],

    content: [
      // ===== TÍTULO =====
      {
        text: [
          "PRENÓMINA DE PAGO\n",
          "INCIDENCIAS DEL TIEMPO NO LABORADO\n",
          "TRABAJO EXTRAORDINARIO",
        ],
        style: "mainTitle",
        alignment: "center",
        margin: [0, 0, 0, 10],
      },

      // ===== INFO GENERAL =====
      {
        columns: [
          { text: "Organismo: MES", style: "orgInfo" },
          {
            text: `Mes: ${monthName} / Año: ${year}`,
            alignment: "right",
            style: "orgInfo",
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: "Entidad: UCI\nÁrea: Dirección de Gestión Tecnológica",
        style: "orgInfo",
        margin: [0, 0, 0, 10],
      },

      // ===== TABLA PRENÓMINA =====
      {
        style: "rhTableStyle",
        table: {
          headerRows: 1,
          widths: [60, "*", "*", 60],
          body: [
            [
              { text: "No. Exp.", style: "tableHeader" },
              { text: "Nombres y Apellidos", style: "tableHeader" },
              { text: "Cargo", style: "tableHeader" },
              { text: "Horas", style: "tableHeader" },
            ],

            ...workers.map((w) => [
              w.record_number ?? "",
              getDisplayName(w),
              w.position_code ?? "",
              {
                text: w.hours ?? w.horas ?? "",
                alignment: "center",
              },
            ]),
          ],
        },
        layout: {
          defaultBorder: true,
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
      },

      // ===== PIE =====
      {
        columns: [
          {
            stack: [
              { text: "Confeccionado por:", bold: true },
              { text: "Ana Iris Valdes Rodríguez" },
            ],
            margin: [0, 20, 0, 0],
          },
          {
            stack: [
              { text: "Aprobado por:", bold: true },
              { text: "Lester Rodríguez Vallejo" },
            ],
            alignment: "right",
            margin: [0, 20, 0, 0],
          },
        ],
      },
    ],

    styles: {
      mainTitle: {
        fontSize: 14,
        bold: true,
      },
      orgInfo: {
        fontSize: 10,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: "center",
        fillColor: "#eeeeee",
      },
    },

    defaultStyle: {
      fontSize: 9,
    },
  };
};
