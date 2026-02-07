import type {
  Worker,
  Group,
  Position,
  Organization,
  Incident as PrismaIncident,
  IncidentType as PrismaIncidentType,
  Payroll,
  ExtraWork,
} from '~/prisma/generated/browser'

declare global {
  type UUID = `${string}-${string}-${string}-${string}` | string
  type EmailAddress = `${string}@${string}.${string}` | string

  type WorkerInfo = Worker
  interface WorkerDetailed extends WorkerInfo {
    group?: Group | null
    led_groups?: Group[] | null
    position?: Position | null
  }
  type GroupInfo = Group
  type PayrollInfo = Payroll
  type PositionInfo = Position
  type OrganizationInfo = Organization
  type IncidentType = PrismaIncidentType
  type Incident = PrismaIncident
  type ExtraWorkInfo = ExtraWork
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
