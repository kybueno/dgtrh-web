type UUID = `${string}-${string}-${string}-${string}` | string;
type EmailAddress = `${string}@${string}.${string}` | string;

type Profile = Tables<"profiles"> 
type WorkerInfo = Tables<"workers"> 
interface WorkerDetailed extends WorkerInfo {
    group?: { name: string } | null;
    leaderAtGroup?: { name: string } | null;
    position?: Omit<Tables<"positions","id">> | null;
}
type WorkerInsert = TablesInsert<"workers"> 
type WorkerProfile = Tables<"profiles_with_worker"> 
type ProfileInsert = TablesInsert<"profiles"> 
type IncidentType = Tables<"incident_types"> 
type Incident = Tables<"incidents"> 
type IncidentTypeInsert = TablesInsert<"incident_types"> 
type GroupInsert = TablesInsert<"groups"> 
type GroupInfo = Tables<"groups"> 
type PayrollInsert = TablesInsert<"payroll"> 
type PayrollInfo = Tables <"payroll">
type PositionInsert = TablesInsert <"positions"> 
type OrganizationInsert = TablesInsert<"organizations"> 
type OrganizationInfo = Tables<"organizations"> 
type PositionInfo = Tables<"positions">


interface StandardErrorResponse {
  error: true,
  url: string,
  statusCode: number,
  statusMessage: string,
  message: string,
  stack: string[]
}
