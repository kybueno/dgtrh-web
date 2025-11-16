<template>
    <div class="p-6 space-y-6 max-w-4xl mx-auto">
      <UCard>
        <h1 class="text-2xl font-bold mb-4">Modelo de Evaluación del Desempeño</h1>
  
        <strong>Información General</strong>  
        <UFormGroup label="Acciones realizadas para la preparación" name="acciones">
          <UTextarea v-model="form.acciones" placeholder="Describa las acciones..." />
        </UFormGroup>
  
        
        <div class="mt-6">
          <h2 class="text-xl font-semibold">Información sobre los Resultados del Proceso</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

            <UFormGroup label="Total de trabajadores">
              <UInput v-model="form.totalTrabajadores" type="number" />
            </UFormGroup>
            <UFormGroup label="Total que debían ser evaluados">
              <UInput v-model="form.totalDebianEvaluarse" type="number" />
            </UFormGroup>
            <UFormGroup label="Total evaluados">
              <UInput v-model="form.totalEvaluados" type="number" />
            </UFormGroup>
            <UFormGroup label="Total no evaluados">
              <UInput v-model="form.totalNoEvaluados" type="number" />
            </UFormGroup>
          </div>
        </div>
  
        <!-- Causas de no evaluación -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold">Causas de no evaluación</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <UFormGroup label="No tener el 70% del tiempo"><UInput v-model="form.causas.no70" type="number" /></UFormGroup>
            <UFormGroup label="Certificado médico"><UInput v-model="form.causas.medico" type="number" /></UFormGroup>
            <UFormGroup label="Licencia de maternidad"><UInput v-model="form.causas.maternidad" type="number" /></UFormGroup>
            <UFormGroup label="Peritaje médico"><UInput v-model="form.causas.peritaje" type="number" /></UFormGroup>
            <UFormGroup label="Misión"><UInput v-model="form.causas.mision" type="number" /></UFormGroup>
            <UFormGroup label="Licencia sin sueldo"><UInput v-model="form.causas.sinSueldo" type="number" /></UFormGroup>
            <UFormGroup label="Licencia deportiva"><UInput v-model="form.causas.deportiva" type="number" /></UFormGroup>
            <UFormGroup label="Movilización"><UInput v-model="form.causas.movilizacion" type="number" /></UFormGroup>
            <UFormGroup label="Prestación social"><UInput v-model="form.causas.prestacion" type="number" /></UFormGroup>
            <UFormGroup label="Otras causas"><UInput v-model="form.causas.otras" type="text" /></UFormGroup>
          </div>
        </div>
  
        <!-- Resultados por categoría -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold">Resultados por Categoría Ocupacional</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <UFormGroup label="Administrativos evaluados"><UInput v-model="form.catEval.admin" type="number" /></UFormGroup>
            <UFormGroup label="Servicios evaluados"><UInput v-model="form.catEval.serv" type="number" /></UFormGroup>
            <UFormGroup label="Operarios evaluados"><UInput v-model="form.catEval.oper" type="number" /></UFormGroup>
            <UFormGroup label="Técnicos evaluados"><UInput v-model="form.catEval.tec" type="number" /></UFormGroup>
          </div>
        </div>
  
        <!-- Resultados evaluativos -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold">Resultados por categoría evaluativa</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <UFormGroup label="Desempeño superior"><UInput v-model="form.eval.superior" type="number" /></UFormGroup>
            <UFormGroup label="Desempeño adecuado"><UInput v-model="form.eval.adecuado" type="number" /></UFormGroup>
            <UFormGroup label="Desempeño deficiente"><UInput v-model="form.eval.deficiente" type="number" /></UFormGroup>
          </div>
        </div>
  
        <!-- Acciones con evaluados de deficiente -->
        <UFormGroup label="Acciones realizadas con evaluados de deficiente" class="mt-6">
          <UTextarea v-model="form.accionesDeficiente" />
        </UFormGroup>
  
        <!-- Valoración cualitativa -->
        <UFormGroup label="Valoración cualitativa del proceso" class="mt-6">
          <UTextarea v-model="form.valoracion" />
        </UFormGroup>
  
        <!-- Generar PDF -->
        <div class="mt-8 flex justify-end">
          <UButton color="primary" @click="generarPDF">Imprimir en PDF</UButton>
        </div>
      </UCard>
    </div>
  </template>
  
  <script setup>
 
  
  const form = reactive({
    acciones: "",
    totalTrabajadores: 0,
    totalDebianEvaluarse: 0,
    totalEvaluados: 0,
    totalNoEvaluados: 0,
    causas: {
      no70: 0,
      medico: 0,
      maternidad: 0,
      peritaje: 0,
      mision: 0,
      sinSueldo: 0,
      deportiva: 0,
      movilizacion: 0,
      prestacion: 0,
      otras: ""
    },
    catEval: { admin: 0, serv: 0, oper: 0, tec: 0 },
    eval: { superior: 0, adecuado: 0, deficiente: 0 },
    accionesDeficiente: "",
    valoracion: ""
  });
  
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Informe de Evaluación del Desempeño", 10, 10);
    doc.text(JSON.stringify(form, null, 2), 10, 20);
    doc.save("evaluacion.pdf");
  };
  </script>
  

  