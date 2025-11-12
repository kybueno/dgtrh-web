import { defineStore } from "pinia";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useIncidentStore = defineStore("incidentStore", {
  state: () => ({
    incidents: [] as Incident[],
  }),
  actions: {
    async loadIncidents(supabase: SupabaseClient) {
      const { data, error } = await supabase.from("incidents").select("*");
      if (data) this.incidents = data;
      if (error) console.error(error);
    },
  },
   async createIncident(newIncidentData: IncidentType, supabase: SupabaseClient) {
      
  
        const { data, error } = await supabase 
          .from("incident_types")
          .insert(newIncidentData);
  
        if (data) this.incidents.push(data[0]);
        if (error) console.error(error);
        
      },
});
