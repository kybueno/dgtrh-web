import { defineStore } from 'pinia'

export const useWorkerStore = defineStore('workerStore', {
  state: () => ({
    workers: [] as WorkerInfo[],
  }),
  actions: {
    async loadWorkers() {
      const data = await $fetch<WorkerDetailed[]>('/api/workers?detailed=true')
      this.workers = data
    },
    async createWorker(newWorkerData: WorkerInsert) {
      const worker = await $fetch<WorkerInfo>('/api/workers', {
        method: 'POST',
        body: newWorkerData,
      })

      if (worker) this.workers.push(worker)
      return worker
    },

    async deleteWorker(id: UUID) {
      try {
        await $fetch(`/api/workers/${id}`, { method: 'DELETE' })
        this.workers = this.workers.filter((worker) => worker.id !== id)
        return { error: null as any }
      } catch (error) {
        return { error }
      }
    },

    getWorkerById(id: string) {
      return this.workers.find((worker) => worker.id === id)
    },
    getWorkerByRecordNumber(recordNumber: string) {
      return this.workers.find((worker) => worker.record_number === recordNumber)
    },
    getWorkerByUsername(username: string) {
      return this.workers.find(
        (worker) => worker.email?.split('@')[0] === username
      )
    },
  },
})
