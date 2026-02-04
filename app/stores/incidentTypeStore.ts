import { defineStore } from 'pinia'

export const useIncidentTypeStore = defineStore('incidentTypeStore', {
  state: () => ({
    incidentTypes: [] as IncidentType[],
  }),
  actions: {
    async loadIncidentTypes() {
      if (this.incidentTypes.length > 0) return
      const data = await $fetch<IncidentType[]>('/api/incident-types')
      this.incidentTypes = data
    },
    async createIncidentType(newIncidentTypeData: IncidentTypeInsert) {
      const incidentType = await $fetch<IncidentType>('/api/incident-types', {
        method: 'POST',
        body: newIncidentTypeData,
      })
      if (incidentType) this.incidentTypes.push(incidentType)
    },
  },
})
