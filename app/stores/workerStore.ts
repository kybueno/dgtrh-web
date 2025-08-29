import { defineStore } from "pinia";
import type { WorkerInfo, WorkerInsert } from "~/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useWorkerStore = defineStore("workerStore", {
  state: () => ({
    workers: [] as WorkerInfo[],
  }),
  actions: {
    async loadWorkers(supabase: SupabaseClient) {
      if (this.workers.length > 0) return;
      const { data, error } = await supabase.from("workers").select("*");
      if (data) this.workers = data;
      if (error) console.error(error);
    },
    async createWorker(newWorkerData: WorkerInsert, supabase: SupabaseClient) {
      if (this.workers.length > 0) return;
      const { data, error } = await supabase
        .from("workers")
        .insert(newWorkerData);
      if (data) this.workers.push(data);
      if (error) console.error(error);
    },
    getWorkerById(id: string) {
      return this.workers.find((worker) => worker.id === id);
    },
    getWorkerByRecordNumber(recordNumber: string) {
      return this.workers.find(
        (worker) => worker.record_number === recordNumber
      );
    },
    getWorkerByUsername(username: string) {
      return this.workers.find(
        (worker) => worker.email?.split("@")[0] === username
      );
    },
  },
});
