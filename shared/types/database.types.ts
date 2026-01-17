export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      extra_work: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          start_date: string
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          start_date: string
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extra_work_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extra_work_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          id: number
          leader_id: string
          name: string | null
        }
        Insert: {
          id?: number
          leader_id: string
          name?: string | null
        }
        Update: {
          id?: number
          leader_id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: true
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: true
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          desde: string | null
          first_name: string | null
          group_id: number | null
          hasta: string | null
          id: string
          incorporacion: string | null
          last_name: string | null
          middle_name: string | null
          motivo: string | null
          record_number: string | null
          second_last_name: string | null
          tiempo: unknown
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          desde?: string | null
          first_name?: string | null
          group_id?: number | null
          hasta?: string | null
          id?: string
          incorporacion?: string | null
          last_name?: string | null
          middle_name?: string | null
          motivo?: string | null
          record_number?: string | null
          second_last_name?: string | null
          tiempo?: unknown
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          desde?: string | null
          first_name?: string | null
          group_id?: number | null
          hasta?: string | null
          id?: string
          incorporacion?: string | null
          last_name?: string | null
          middle_name?: string | null
          motivo?: string | null
          record_number?: string | null
          second_last_name?: string | null
          tiempo?: unknown
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holidays_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holidays_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_types: {
        Row: {
          avg: boolean
          classification: string
          code: number
          created_at: string | null
          deductible: boolean | null
          description: string | null
          incentive: boolean
          name: string
          pay_for: string | null
          sum: boolean
          time_classification: string | null
          updated_at: string | null
        }
        Insert: {
          avg?: boolean
          classification?: string
          code: number
          created_at?: string | null
          deductible?: boolean | null
          description?: string | null
          incentive?: boolean
          name: string
          pay_for?: string | null
          sum?: boolean
          time_classification?: string | null
          updated_at?: string | null
        }
        Update: {
          avg?: boolean
          classification?: string
          code?: number
          created_at?: string | null
          deductible?: boolean | null
          description?: string | null
          incentive?: boolean
          name?: string
          pay_for?: string | null
          sum?: boolean
          time_classification?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          incident_code: number
          start_date: string
          updated_at: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          incident_code: number
          start_date: string
          updated_at?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          incident_code?: number
          start_date?: string
          updated_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_incident_code_fkey"
            columns: ["incident_code"]
            isOneToOne: false
            referencedRelation: "incident_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          acronym: string | null
          code: string | null
          description: string | null
          id: number
          img: string | null
          name: string | null
        }
        Insert: {
          acronym?: string | null
          code?: string | null
          description?: string | null
          id?: number
          img?: string | null
          name?: string | null
        }
        Update: {
          acronym?: string | null
          code?: string | null
          description?: string | null
          id?: number
          img?: string | null
          name?: string | null
        }
        Relationships: []
      }
      payroll: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          month: number
          revised_by: string | null
          status: string
          year: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          month?: number
          revised_by?: string | null
          status?: string
          year?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          month?: number
          revised_by?: string | null
          status?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_revised_by_fkey"
            columns: ["revised_by"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_revised_by_fkey"
            columns: ["revised_by"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          category: string
          code: number
          created_at: string
          description: string
          group_escale: string
          id: number
          level: string
        }
        Insert: {
          category: string
          code: number
          created_at?: string
          description: string
          group_escale: string
          id?: number
          level: string
        }
        Update: {
          category?: string
          code?: number
          created_at?: string
          description?: string
          group_escale?: string
          id?: number
          level?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          worker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      worker_roles: {
        Row: {
          created_at: string | null
          role_id: string
          valid_from: string
          valid_to: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          valid_from?: string
          valid_to?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          valid_from?: string
          valid_to?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_roles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_roles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          address: string | null
          ci: string | null
          created_at: string | null
          email: string | null
          first_name: string
          gender: string | null
          group_id: number | null
          id: string
          last_name: string
          level: string | null
          middle_name: string | null
          organizations_codes: string[]
          parent1_name: string | null
          parent2_name: string | null
          position_code: number | null
          record_number: string
          second_last_name: string
          status: Database["public"]["Enums"]["worker_status"]
          tel: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          ci?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          group_id?: number | null
          id?: string
          last_name: string
          level?: string | null
          middle_name?: string | null
          organizations_codes?: string[]
          parent1_name?: string | null
          parent2_name?: string | null
          position_code?: number | null
          record_number: string
          second_last_name: string
          status?: Database["public"]["Enums"]["worker_status"]
          tel?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          ci?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          group_id?: number | null
          id?: string
          last_name?: string
          level?: string | null
          middle_name?: string | null
          organizations_codes?: string[]
          parent1_name?: string | null
          parent2_name?: string | null
          position_code?: number | null
          record_number?: string
          second_last_name?: string
          status?: Database["public"]["Enums"]["worker_status"]
          tel?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_position_code_fkey"
            columns: ["position_code"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      complete_profiles: {
        Row: {
          created_at: string | null
          id: string | null
          user_id: string | null
          worker: Json | null
        }
        Relationships: []
      }
      incidents_view: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string | null
          incident_code: number | null
          incident_name: string | null
          start_date: string | null
          worker_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_incident_code_fkey"
            columns: ["incident_code"]
            isOneToOne: false
            referencedRelation: "incident_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_with_worker: {
        Row: {
          created_at: string | null
          id: string | null
          user_id: string | null
          worker: Database["public"]["Tables"]["workers"]["Row"] | null
          worker_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: true
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_incidents: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          first_name: string | null
          id: string | null
          incident_code: number | null
          incident_description: string | null
          incident_name: string | null
          last_name: string | null
          record_number: string | null
          start_date: string | null
          updated_at: string | null
          worker_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_incident_code_fkey"
            columns: ["incident_code"]
            isOneToOne: false
            referencedRelation: "incident_types"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      workers_with_roles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          middle_name: string | null
          record_number: string | null
          roles: Json | null
          second_last_name: string | null
          status: Database["public"]["Enums"]["worker_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_user_role: { Args: { role_names: string[] }; Returns: boolean }
    }
    Enums: {
      worker_status: "active" | "inactive" | "terminated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      worker_status: ["active", "inactive", "terminated"],
    },
  },
} as const
