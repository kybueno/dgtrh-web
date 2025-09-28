type UUID = `${string}-${string}-${string}-${string}` | string;
type EmailAddress = `${string}@${string}.${string}` | string;

interface Profile extends Tables<"profiles"> {}
interface WorkerInfo extends Tables<"workers"> {
    padre: any;
}
interface WorkerInsert extends TablesInsert<"workers"> {}
interface WorkerProfile extends Tables<"profiles_with_worker"> {}
interface ProfileInsert extends TablesInsert<"profiles"> {}
interface IncidentType extends Tables<"incident_types"> {}
interface Incident extends Tables<"incidents"> {}
interface IncidentTypeInsert extends TablesInsert<"incident_types"> {}
