import { defineStore } from "pinia";
import { SupabaseClient } from "@supabase/supabase-js";

export const useWorkerStore = defineStore("workerStore", {
  state: () => ({
    workers: [] as WorkerInfo[],//primero esta vacío y al cargar la pagina se llena de los trabajadores
  }),
  actions: {
    //función 1 
    async loadWorkers() {    //I
   //1 return //2//si hay trabajadores no va a cargar trabajadores
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from("workers").select("*"); //3
      if (data) this.workers = data;  //4
      if (error) console.error(error); //5
    }, //F
    //función 2
    async createWorker(newWorkerData: WorkerInsert, supabase: SupabaseClient) {
      const { data, error } = await supabase //van a devolver error y data, si la creo sin problema error va a ser nulo y el data va a ser algo, y viceversa
        .from("workers")
        .insert(newWorkerData);

      if (data) this.workers.push(data[0]);
      if (error) console.error(error);   
    },
    
    

    //función 3
    getWorkerById(id: string) {
      return this.workers.find((worker: { id: string; }) => worker.id === id);
    },
    getWorkerByRecordNumber(recordNumber: string) {
      return this.workers.find(
        (worker: { record_number: string; }) => worker.record_number === recordNumber
      );
    },
    getWorkerByUsername(username: string) {
      return this.workers.find(
        (worker: { email: string; }) => worker.email?.split("@")[0] === username
      );
    },
  },
});
