import { defineStore } from "pinia";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useIncidentTypeStore = defineStore("incidentTypeStore", {
  state: () => ({
    incidentTypes: [] as IncidentType[],
  }),
  actions: {
    async loadIncidentTypes(supabase: SupabaseClient) {
      if (this.incidentTypes.length > 0) return;
      const { data, error } = await supabase.from("incident_types").select("*");
      if (data) this.incidentTypes = data;
      if (error) console.error(error);
    },
    async createIncidentType(newIncidentTypeData: IncidentTypeInsert) {},
  },
});
