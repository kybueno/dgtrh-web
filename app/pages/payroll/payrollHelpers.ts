

import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
//import { PrenominaData } from '~/types/prenomina';

const workerStore = useWorkerStore();
const supabase = useSupabaseClient()
const incidentStore = useIncidentStore()

onMounted(() => {
  incidentStore.loadIncidents(supabase)
})


onMounted(async () => {
  await workerStore.loadWorkers();
});

export interface PrenominaEmpleado {
  noEx: string;
  nombreCompleto: string;
  cargo: string;
  diasTrabajados: number;
  incidencias?: { [key: string]: number }; // Para códigos como 12, 15, 21, etc.
  horasExtraordinarias?: number;
}

export interface PrenominaData {
  organismo: string;
  mes: string;
  fecha: string;
  entidad: string;
  area: string;
  confeccionadoPor: string;
  revisadoPor: string;
  empleados: PrenominaEmpleado[];
}
// services/pdfService.ts


export class PdfService {
  static generatePrenominaPDF(data: PrenominaData): TDocumentDefinitions {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        // Header
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: `ORGANISMO: ${data.organismo}`,
                  border: [false, false, false, false]
                },
                {
                  text: `Fecha: ${data.fecha}`,
                  border: [false, false, false, false],
                  alignment: 'right'
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: `ENTIDAD: ${data.entidad}`,
                  border: [false, false, false, false]
                },
                {
                  text: `CONFEC.POR: ${data.confeccionadoPor}`,
                  border: [false, false, false, false],
                  alignment: 'right'
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: `AREA: ${data.area}`,
                  border: [false, false, false, false]
                },
                {
                  text: `REVISADO Y APROBADO POR: ${data.revisadoPor}`,
                  border: [false, false, false, false],
                  alignment: 'right'
                }
              ]
            ]
          },
          layout: 'noBorders'
        },
        
        // Título
        {
          text: 'PRENOMINA DE PAGO',
          style: 'header',
          margin: [0, 20, 0, 10]
        },
        
        // Tabla principal
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: this.buildTableBody(data.empleados)
          },
          layout: {
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              return '#000000';
            },
            vLineColor: function(i, node) {
              return '#000000';
            },
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          fillColor: '#eeeeee'
        },
        tableCell: {
          fontSize: 7
        }
      },
      defaultStyle: {
        font: 'Helvetica'
      }
    };
    
    return docDefinition;
  }
  
  private static buildTableBody(empleados: PrenominaEmpleado[]): TableCell[][] {
    const body: TableCell[][] = [];
    
    // Encabezados
    body.push([
      { text: 'No.Ex.', style: 'tableHeader' },
      { text: 'NOMBRES Y APELLIDOS', style: 'tableHeader' },
      { text: 'CARGO', style: 'tableHeader' },
      { text: 'DÍAS', style: 'tableHeader' },
      { text: 'HORAS EXTRA', style: 'tableHeader' }
    ]);
    
    // Datos de empleados
    empleados.forEach(empleado => {
      body.push([
        { text: empleado.noEx, style: 'tableCell' },
        { text: empleado.nombreCompleto, style: 'tableCell' },
        { text: empleado.cargo, style: 'tableCell' },
        { text: empleado.diasTrabajados.toString(), style: 'tableCell' },
        { text: empleado.horasExtraordinarias ? empleado.horasExtraordinarias.toString() : '', style: 'tableCell' }
      ]);
    });
    
    return body;
  }
}


export const usePrenominaPDF = (worker: WorkerInfo, date: Date = new Date(), p0: Date) => {
  const { generatePrenominaPDF } = usePrenominaPDF(worker);
  
  const generatePDF = () => {
    generatePrenominaPDF();
  };
  usePDFMake().createPdf(generatePrenominaPDF(worker, date)).open();
}
  const getPrenominaPDF = (worker: WorkerInfo, date = new Date()) =>  {
    // Datos de ejemplo basados en la imagen
    const prenominaData: PrenominaData = {
      organismo: 'MES',
      mes: 'Agosto 2024',
      fecha: 'Agosto 2024',
      entidad: 'UCI',
      area: 'Dirección de Gestión de Tecnología',
      confeccionadoPor: 'Ana Iris Valdes Rodríguez',
      revisadoPor: 'Lester Rodríguez Vallejo',
      empleados: [
        { noEx: '06252', nombreCompleto: 'DAISY TAPANES RODRIGUEZ', cargo: 'TÉCNICO EN CIENCIAS INFORMÁTICAS', diasTrabajados: 21 },
        { noEx: '06799', nombreCompleto: 'MIRIAM ABUNDIA PALENZUELA MARINEZ', cargo: 'TÉCNICO GENERAL', diasTrabajados: 13 },
        { noEx: '07433', nombreCompleto: 'ANIA JOSEFA MENÉNDEZ RODRÍGUEZ', cargo: 'ESPECIALISTA SUPERIOR', diasTrabajados: 24 },
        { noEx: '07646', nombreCompleto: 'LESTER RODRÍGUEZ VALLEJO', cargo: 'DIRECTOR', diasTrabajados: 19 },
        { noEx: '08154', nombreCompleto: 'ANA IRIS VALDES RODRIGUEZ', cargo: 'GESTIÓN DE RECURSOS', diasTrabajados: 19 },
        { noEx: '09200', nombreCompleto: 'YUNIER SIERRA CHACON', cargo: 'TÉCNICO GENERAL', diasTrabajados: 22 },
        { noEx: '09391', nombreCompleto: 'ANGEL FABRA TORRES', cargo: 'SUBDIRECTOR', diasTrabajados: 23 },
        { noEx: '10286', nombreCompleto: 'MARIA ELENA ÁLVAREZ BRITO', cargo: 'TÉCNICO GENERAL', diasTrabajados: 22 },
        { noEx: '10422', nombreCompleto: 'ARNALDO RODELAY ALMEIDA MARTÍNEZ', cargo: 'TÉCNICO GENERAL', diasTrabajados: 16 },
        { noEx: '10594', nombreCompleto: 'TOMÁS FUENTES FAJARDO', cargo: 'TÉCNICO GENERAL', diasTrabajados: 22 },
        { noEx: '11730', nombreCompleto: 'CARLOS OSMANY HIDALGO CRUZ', cargo: 'TÉCNICO EN CIENCIAS INFORMÁTICAS', diasTrabajados: 24 },
        { noEx: '12276', nombreCompleto: 'MAGALI RODRÍGUEZ ARTEAGA', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '12564', nombreCompleto: 'GRACIELA CORRALES GONZÁLEZ', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '14549', nombreCompleto: 'YANISLEDY BARROSO BENITEZ', cargo: 'ESPECIALISTA SUPERIOR', diasTrabajados: 23 },
        { noEx: '15097', nombreCompleto: 'VIRGEN MARÍA CASTILLO CASERO', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '15232', nombreCompleto: 'MIGUEL RODRIGUEZ LOPEZ', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '15270', nombreCompleto: 'JORGE GONZALEZ GONZALEZ', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '17818', nombreCompleto: 'WILFREDO PALMA ALFONSO', cargo: 'TÉCNICO GENERAL', diasTrabajados: 21 },
        { noEx: '19294', nombreCompleto: 'MARÍA DEL ROSARIO GUTIÉRREZ POSADA', cargo: 'ESPECIALISTA SUPERIOR', diasTrabajados: 19 },
        { noEx: '20625', nombreCompleto: 'SANDRO IZQUIERDO HERNANDEZ', cargo: 'TÉCNICO EN CIENCIAS INFORMÁTICAS', diasTrabajados: 22 },
        { noEx: '21203', nombreCompleto: 'ADELI CHIRINO BRAVO', cargo: 'ESPECIALISTA GENERAL', diasTrabajados: 24 }
      ]
    };

    const docDefinition = PdfService.generatePrenominaPDF(prenominaData);
    
    // En el cliente, usa pdfmake para generar el PDF
    if (process.client) {
      import('pdfmake/build/pdfmake').then(pdfMakeModule => {
        const pdfMake = pdfMakeModule.default;
        const pdfFonts = require('pdfmake/build/vfs_fonts');
        
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.createPdf(docDefinition).download('prenomina_agosto_2024.pdf');
      });
    }
  };

  // return {
  //   generatePrenominaPDF
  // };



