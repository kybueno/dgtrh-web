<template>
    <div class="p-6 space-y-6 max-w-4xl mx-auto overflow-y-auto">
        <h1 class="text-2xl font-bold mb-4">Modelo de Evaluación del Desempeño</h1>
  
        <strong>1.Información General:</strong>  
       <p>1.1- Acciones realizadas para la preparación en las entidades con vistas al desarrollo del proceso evaluativo
        (Precisar las fundamentales que aseguraron el proceso)
       </p>
        
        <div class="gap-4 mt-6 ">
          <strong class="text-xl font-semibold">2.Información sobre los Resultados del Proceso</strong>
          <div class="flex flex-col gap-4 mt-4">

            <label>2.1- Total de trabajadores
              <UInput v-model="form.totalTrabajadores"/>
            </label>

            <label>2.2- Total que debían ser evaluados
              <UInput v-model="form.totalDebianEvaluarse" type="number" min="0" :max="form.totalTrabajadores"/>
              <span>{{percentShouldEvaluate}}</span>
            </label>
           
            <label>2.3- Total evaluados
              <UInput v-model="form.totalEvaluados" type="number" min="0" :max="form.totalDebianEvaluarse" />
              <span>{{percentEvaluated }}</span>
              <p>(Reflejar cifra y % que representan del total que debió ser evaluado).</p>
            </label>

            <label>2.4- Total no evaluados
              <span>{{ form.totalDebianEvaluarse - form.totalEvaluados }}</span>
              <span>{{percentNoEvaluated}}</span>

              <p>(Reflejar cifra y % que representan del total que debió ser evaluado)</p>
            </label>
            <p>(NOTA: LA CIFRA DEL TOTAL DE TRABAJADORES QUE DEBIAN SER EVALUADOS DEBE SER ES IGUAL A LA SUMA DE LOS EVALUADOS Y LOS NO EVALUADOS).</p>
          </div>
        </div>
  
        <div class="mt-6">
          <p>2.5- Causas por las que no fueron evaluados. (Se debe precisar la cantidad en cada una de las causales que aquí aparecen reflejadas y debe cuadrar con la cantidad no evaluados).</p>
          <div class="flex flex-col  gap-4 mt-4">
            <label>No tener el 70% del tiempo:<UInput v-model="form.causas.no70"/></label>
            <label>Certificado médico:<UInput v-model="form.causas.medico"/></label>
            <label>Licencia de maternidad:<UInput v-model="form.causas.maternidad" /></label>
            <label>Peritaje médico:<UInput v-model="form.causas.peritaje"/></label>
            <label>Misión:<UInput v-model="form.causas.mision"/></label>
            <label>Licencia sin sueldo:<UInput v-model="form.causas.sinSueldo" /></label>
            <label>Licencia deportiva:<UInput v-model="form.causas.deportiva" /></label>
            <label>Movilización:<UInput v-model="form.causas.movilizacion" /></label>
            <label>Prestación social:<UInput v-model="form.causas.prestacion" /></label>
            <label>Otras causas(Especificar):<UInput v-model="form.causas.otras" /></label>
          </div>
        </div>
  
        <!-- Resultados por categoría -->
        <div class="mt-6">
          <strong>3.Resultados por Categoría Ocupacional</strong>
          <div class="flex flex-col  gap-4 mt-4">
            <p>Del total de trabajadores evaluados:</p>
            <span>(Reflejar cifra y % que representan del total que debió ser evaluado)</span>
            <label>3.1.1- Administrativos evaluados:<UInput v-model="form.catEval.admin" /></label>
            <label>3.1.2- Servicios evaluados:<UInput v-model="form.catEval.serv" /></label>
            <label>3.1.3- Operarios evaluado:<UInput v-model="form.catEval.oper" /></label>
            <label>3.1.4- Técnicos evaluados:<UInput v-model="form.catEval.tec" /></label>
            <p>NOTA: LA SUMA DE ESTAS CATEGORIAS DE EVALUADOS DEBE SER IGUAL AL TOTAL DE TRABAJADORES EVALUADOS.
            </p>
          </div>

          <strong>3.2- Del total de trabajadores no evaluados, son: 
            (Reflejar cifra y % que representan del total que no fue evaluado) 
          </strong>
          <div class="flex flex-col gap-4 mt-4">
            <p>Del total de trabajadores evaluados:</p>
            <span>(Reflejar cifra y % que representan del total que debió ser evaluado)</span>
            <label>3.2.1- Administrativos:<UInput v-model="form.catEval.admin" /></label>
            <label>3.2.2- Servicios:<UInput v-model="form.catEval.serv" /></label>
            <label>3.2.3- Operarios:<UInput v-model="form.catEval.oper" /></label>
            <label>3.2.4- Técnicos:<UInput v-model="form.catEval.tec" /></label>
            <p>NOTA: LA SUMA DE ESTAS CATEGORIAS DE NO EVALUADOS DEBE SER IGUAL AL TOTAL DE TRABAJADORES NO EVALUADOS. 
            </p>
          </div>
        </div>
  
        <!-- Resultados evaluativos -->
        <div class="mt-6">
          <strong>4.Resultados por categoría evaluativa</strong>
          <p>4.1- Del total de evaluados, fueron: 
            (Reflejar cifra y % que representan del total que debió ser evaluado)</p>
          <div class="flex flex-col  gap-4 mt-4">
            <label>Desempeño superior:<UInput v-model="form.eval.superior" /></label>
            <label>Desempeño adecuado:<UInput v-model="form.eval.adecuado" /></label>
            <label>Desempeño deficiente:<UInput v-model="form.eval.deficiente" /></label>
            <p>NOTA: LA SUMA TOTAL DE LOS EVALUADOS EN ESTAS CATEGORIAS EVALUATIVAS DEBE SER IGUAL AL TOTAL DE EVALUADOS.</p>
          </div>
        </div>
  
        <!-- Acciones con evaluados de deficiente -->
        <label>4.2- Acciones realizadas con evaluados de deficiente:
          <UTextarea v-model="form.accionesDeficiente" />
        </label>

        <div class="mt-6">
          <strong>4.Reclamaciones realizadas</strong>
          <div class="flex flex-col  gap-4 mt-4">
            <label>5.1- Total de reclamaciones realizadas al jefe inmediato que evaluó:<UInput v-model="form.eval.superior" /></label>
            <label>5.1.1- De esas, cuántas con efecto: <UInput v-model="form.eval.adecuado" /></label>
            <label>5.1.2- De esas, cuántas sin efecto:<UInput v-model="form.eval.deficiente" /></label>
            <label>5.2.- Del total de reclamaciones realizadas, cuántas se trasladaron al OJLB:<UInput v-model="form.eval.deficiente" /></label>
            <label>5.2.1-Del total de reclamaciones que se trasladaron al OJLB, cuántas con efecto:<UInput v-model="form.eval.deficiente" /></label>
            <label>5.2.2- Del total de reclamaciones que se trasladaron al OJLB, cuántas sin efecto:<UInput v-model="form.eval.deficiente" /></label>
            <p>NOTA: LA SUMA TOTAL DE RECLAMACIONES CON EFECTO Y SIN EFECTO DEBE SER IGUAL AL TOTAL DE RECLAMACIONES REALIZADAS.</p>
          </div>
        </div>
  
        <!-- Valoración cualitativa -->
        <strong>6. Valoración cualitativa del proceso</strong>
        <label>6.1. Principales problemas o irregularidades presentadas.
          <UTextarea/>
        </label>

        <label> 6.2. Aspectos positivos y negativos del proceso. 
          <UTextarea v-model="form.valoracion" />
        </label>

        <p>Por:<UInput/>
        Director de Gestión Tecnológica</p>

        
        <!-- Generar PDF -->
        <div class="mt-8 flex justify-end">
          <UButton color="primary" @click="handlePrint">Imprimir</UButton>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { getEvaluationReportDefinition } from "./perfomanceEvaluations";
import type { Style } from '#components';


 
 const form = ref({
   acciones: "",
   totalTrabajadores: 0,
   totalDebianEvaluarse: 0,
   totalEvaluados: 0,
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

const percentShouldEvaluate = computed(()=>Intl.NumberFormat(undefined, {style:"percent"}).format(form.value.totalDebianEvaluarse/ form.value.totalTrabajadores))
const percentEvaluated = computed(()=>Intl.NumberFormat(undefined, {style:"percent"}).format(form.value.totalEvaluados/ form.value.totalDebianEvaluarse))
const percentNoEvaluated = computed(()=>Intl.NumberFormat(undefined, {style:"percent"}).format((form.value.totalDebianEvaluarse - form.value.totalEvaluados) / form.value.totalDebianEvaluarse))

 const handlePrint = () => {
  generateEvaluationReport(form.value);
};
 

 </script>
 