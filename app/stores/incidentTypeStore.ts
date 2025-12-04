import { defineStore } from "pinia";

export const useIncidentTypeStore = defineStore("incidentTypeStore", {
  state: () => ({
    incidentTypes: [] as IncidentType[],
  }),
  actions: {
    async loadIncidentTypes() {
      const supabase = useSupabaseClient()
      if (this.incidentTypes.length > 0) return;
      const { data, error } = await supabase.from("incident_types").select("*");
      if (data) this.incidentTypes = data;
      if (error) console.error(error);
    },
    async createIncidentType(newIncidentTypeData: IncidentTypeInsert) {},
  },
});
