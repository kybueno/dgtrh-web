import { defineStore } from "pinia";
import type { WorkerInfo, WorkerInsert } from "~/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useWorkerStore = defineStore("workerStore", {
  state: () => ({
    workers: [] as WorkerInfo[],
  }),
  actions: {
    //función 1 
    async loadWorkers(supabase: SupabaseClient) {    //I
      if (this.workers.length > 0) return;  //1 return //2
      const { data, error } = await supabase.from("workers").select("*"); //3
      if (data) this.workers = data;  //4
      if (error) console.error(error); //5
    }, //F
    //función 2
    async createWorker(newWorkerData: WorkerInsert, supabase: SupabaseClient) {
      if (this.workers.length > 0) return;
      const { data, error } = await supabase
        .from("workers")
        .insert(newWorkerData);
      if (data) this.workers.push(data);
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
