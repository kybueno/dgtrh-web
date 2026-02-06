import type {
  Prisma,
  Worker,
  Group,
  Position,
  Organization,
  Incident,
  IncidentType,
  Payroll,
  ExtraWork,
} from '~/prisma/generated/browser'

declare global {
  type UUID = `${string}-${string}-${string}-${string}` | string
  type EmailAddress = `${string}@${string}.${string}` | string

  type TableName =
    | 'workers'
    | 'groups'
    | 'positions'
    | 'organizations'
    | 'incident_types'
    | 'incidents'
    | 'payroll'
    | 'extra_work'

  type Tables<T extends TableName> =
    T extends 'workers' ? Worker :
    T extends 'groups' ? Group :
    T extends 'positions' ? Position :
    T extends 'organizations' ? Organization :
    T extends 'incident_types' ? IncidentType :
    T extends 'incidents' ? Incident :
    T extends 'payroll' ? Payroll :
    T extends 'extra_work' ? ExtraWork :
    never

  type TablesInsert<T extends TableName> =
    T extends 'workers' ? Prisma.WorkerCreateInput :
    T extends 'groups' ? Prisma.GroupCreateInput :
    T extends 'positions' ? Prisma.PositionCreateInput :
    T extends 'organizations' ? Prisma.OrganizationCreateInput :
    T extends 'incident_types' ? Prisma.IncidentTypeCreateInput :
    T extends 'incidents' ? Prisma.IncidentCreateInput :
    T extends 'payroll' ? Prisma.PayrollCreateInput :
    T extends 'extra_work' ? Prisma.ExtraWorkCreateInput :
    never

  type TablesUpdate<T extends TableName> =
    T extends 'workers' ? Prisma.WorkerUpdateInput :
    T extends 'groups' ? Prisma.GroupUpdateInput :
    T extends 'positions' ? Prisma.PositionUpdateInput :
    T extends 'organizations' ? Prisma.OrganizationUpdateInput :
    T extends 'incident_types' ? Prisma.IncidentTypeUpdateInput :
    T extends 'incidents' ? Prisma.IncidentUpdateInput :
    T extends 'payroll' ? Prisma.PayrollUpdateInput :
    T extends 'extra_work' ? Prisma.ExtraWorkUpdateInput :
    never

  type WorkerInfo = Tables<'workers'>
  interface WorkerDetailed extends WorkerInfo {
    group?: Group | null
    leaderAtGroup?: Group | null
    position?: Position | null
  }
  type WorkerInsert = TablesInsert<'workers'>
  type IncidentTypeInsert = TablesInsert<'incident_types'>
  type GroupInsert = TablesInsert<'groups'>
  type GroupInfo = Tables<'groups'>
  type PayrollInsert = TablesInsert<'payroll'>
  type PayrollInfo = Tables<'payroll'>
  type PositionInsert = TablesInsert<'positions'>
  type OrganizationInsert = TablesInsert<'organizations'>
  type OrganizationInfo = Tables<'organizations'>
  type PositionInfo = Tables<'positions'>
  type IncidentType = Tables<'incident_types'>
  type Incident = Tables<'incidents'>
}

export {}


interface StandardErrorResponse {
  error: true,
  url: string,
  statusCode: number,
  statusMessage: string,
  message: string,
  stack: string[]
}
