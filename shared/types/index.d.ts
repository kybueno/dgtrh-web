type UUID = `${string}-${string}-${string}-${string}` | string;
type EmailAddress = `${string}@${string}.${string}` | string;

interface Profile extends Tables<"profiles"> {}
interface WorkerInfo extends Tables<"workers"> {}
interface WorkerInsert extends TablesInsert<"workers"> {}
interface WorkerProfile extends Tables<"profiles_with_worker"> {}
interface ProfileInsert extends TablesInsert<"profiles"> {}
interface IncidentType extends Tables<"incident_types"> {}
interface Incident extends Tables<"incidents"> {}
interface IncidentTypeInsert extends TablesInsert<"incident_types"> {}
interface GroupInsert extends TablesInsert<"groups"> {}
interface GroupInfo extends Tables<"groups"> {}
interface PayrollInsert extends TablesInsert<"payroll"> {}
interface PositionInsert extends TablesInsert <"positions"> {}
interface PositionInfo extends Tables <"positions"> {}
interface OrganizationInsert extends TablesInsert<"organizations"> {}
interface OrganizationInfo extends Tables<"organizations"> {}
