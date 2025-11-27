export const getEvaluationReportDefinition = () => {
  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],

    content: [
      // TÍTULO PRINCIPAL
      {
        text: "INFORMACIÓN DE LAS ENTIDADES SUBORDINADAS AL MES SOBRE\nLOS RESULTADOS DE LA EVALUACIÓN DEL DESEMPEÑO LABORAL\nEN EL AÑO 2024",
        style: "mainTitle",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      {
        text: "DIRECCIÓN DE GESTIÓN TECNOLÓGICA",
        style: "subTitle",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },

      // SECCIÓN 1
      { text: "1. INFORMACIÓN GENERAL:", style: "sectionTitle" },
      {
        text:
          "1.1- Acciones realizadas para la preparación en las entidades con vistas al desarrollo del proceso evaluativo\n\n(Precisar las fundamentales que aseguraron el proceso)",
        style: "paragraph",
        margin: [0, 0, 0, 15],
      },

      // SECCIÓN 2
      { text: "2. INFORMACIÓN SOBRE LOS RESULTADOS DEL PROCESO", style: "sectionTitle" },

      {
        style: "paragraph",
        margin: [0, 5, 0, 5],
        stack: [
          "2.1- Total de trabajadores: __35 48%__",
          "2.2- Total de trabajadores que debían ser evaluados: ___35 100 %_",
          "2.3- Total de trabajadores evaluados: ___32 91.42 %__\n(Reflejar cifra y % que representan del total que debió ser evaluado).",
          "2.4- Total de trabajadores no evaluados: _3 8.57%_\n(Reflejar cifra y % que representan del total que debió ser evaluado)",
          {
            text:
              "NOTA: La cifra del total de trabajadores que debían ser evaluados debe ser igual a la suma de los evaluados y los no evaluados.",
            italics: true,
            margin: [0, 5, 0, 5],
          },
        ],
      },

      // CAUSAS NO EVALUADOS
      {
        text: "2.5- Causas por las que no fueron evaluados:",
        style: "subSectionTitle",
        margin: [0, 5, 0, 5],
      },

      {
        style: "paragraph",
        stack: [
          "No tener el 70 % del tiempo: _______",
          "Certificado médico:_______1_______",
          "Licencia de maternidad: _____________",
          "Peritaje médico: _____________________",
          "Misión: ____________________________",
          "Licencia sin sueldo: _________________",
          "Licencia deportiva: _________________",
          "Movilización: _______________________",
          "Prestación social:___________________",
          "Otras causas (Especificar): __2 (directivos)____",
        ],
        margin: [15, 0, 0, 15],
      },

      // SECCIÓN 3
      { text: "3. RESULTADOS DE LA EVALUACIÓN POR CATEGORÍA OCUPACIONAL", style: "sectionTitle" },

      {
        margin: [0, 5, 0, 10],
        stack: [
          "3.1- Del total de trabajadores evaluados:",
          "3.1.1- Administrativos: _____",
          "3.1.2- Servicios: _____________",
          "3.1.3- Operarios: ____________",
          "3.1.4- Técnicos: ___32 91.42%__",
          {
            text:
              "NOTA: La suma de estas categorías debe ser igual al total de trabajadores evaluados.",
            italics: true,
            margin: [0, 5, 0, 5],
          },
          "3.2- Del total de trabajadores no evaluados, son:",
          "3.2.1- Administrativos: ____2___6.25%_",
          "3.2.2- Servicios: ________________",
          "3.2.3- Operarios: _______________",
          "3.2.4- Técnicos: __1____3.12%____",
          {
            text:
              "NOTA: La suma de estas categorías debe ser igual al total de trabajadores no evaluados.",
            italics: true,
            margin: [0, 5, 0, 5],
          },
        ],
        style: "paragraph",
      },

      // SECCIÓN 4
      { text: "4. RESULTADOS POR CATEGORÍA EVALUATIVA", style: "sectionTitle" },

      {
        style: "paragraph",
        margin: [0, 5, 0, 10],
        stack: [
          "4.1- Del total de evaluados, fueron:",
          "4.1.1- Desempeño superior: _7 21.87%_",
          "4.1.2- Desempeño adecuado: _25 78.12%_",
          "4.1.3- Desempeño deficiente: _____________",
          {
            text:
              "NOTA: La suma debe ser igual al total de evaluados.",
            italics: true,
            margin: [0, 5, 0, 5],
          },
          "4.2- Acciones realizadas con los evaluados de desempeño deficiente.",
        ],
      },

      // SECCIÓN 5 RECLAMACIONES
      { text: "5. RECLAMACIONES REALIZADAS", style: "sectionTitle" },
      {
        style: "paragraph",
        margin: [0, 5, 0, 10],
        stack: [
          "5.1- Total de reclamaciones realizadas al jefe inmediato: __________",
          "5.1.1- De esas, cuántas con efecto: __________",
          "5.1.2- Cuántas sin efecto: ___________",
          "5.2- Del total de reclamaciones, cuántas se trasladaron al OJLB: ____________",
          "5.2.1- De estas, cuántas con efecto: _______________",
          "5.2.2- Cuántas sin efecto: _______________",
          {
            text:
              "NOTA: La suma de con efecto y sin efecto debe ser igual al total de reclamaciones.",
            italics: true,
            margin: [0, 5, 0, 5],
          },
        ],
      },

      // SECCIÓN 6
      { text: "6. VALORACIÓN CUALITATIVA DEL PROCESO:", style: "sectionTitle" },

      {
        text: "6.1- Principales problemas o irregularidades presentadas.",
        style: "subSectionTitle",
      },
      {
        text: "El proceso de evaluación se realizó correctamente.",
        style: "paragraph",
        margin: [0, 0, 0, 15],
      },

      {
        text: "6.2- Aspectos positivos y negativos del proceso.",
        style: "subSectionTitle",
      },

      {
        text:
          "El proceso de evaluación anual de los trabajadores de la Dirección de Gestión Tecnológica es una herramienta fundamental para medir el desempeño y el crecimiento profesional. Se analizaron logros, se identificaron áreas de mejora y se fortaleció la comunicación entre directivos y equipos.\n\nDestacar que del total de trabajadores evaluados, 2 directivos no se listan en estas evaluaciones ya que son evaluados por el Director General de Tecnología.",
        style: "paragraph",
        margin: [0, 0, 0, 20],
      },

      // FIRMA FINAL
      {
        text: "Lester Rodríguez Vallejo\nDirector de Gestión Tecnológica",
        style: "signature",
        alignment: "right",
        margin: [0, 20, 0, 0],
      },
    ],

    styles: {
      mainTitle: { bold: true, fontSize: 15 },
      subTitle: { bold: true, fontSize: 13 },
      sectionTitle: { bold: true, fontSize: 12, margin: [0, 10, 0, 5] },
      subSectionTitle: { bold: true, fontSize: 11, margin: [0, 8, 0, 3] },
      paragraph: { fontSize: 10, lineHeight: 1.2 },
      signature: { fontSize: 11, bold: true },
    },
  };
};
