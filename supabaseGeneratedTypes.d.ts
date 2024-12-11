export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      staged_calls: {
        Row: {
          agent_snapshot_id: string
          created_at: string
          customer_phone_number: string
          failed_attempts: number
          field_overrides: Json
          id: string
          phone_id: string
          scheduled: string | null
          status: Database["public"]["Enums"]["staged_call_status"]
          updated_at: string
        }
        Insert: {
          agent_snapshot_id: string
          created_at?: string
          customer_phone_number: string
          failed_attempts?: number
          field_overrides?: Json
          id?: string
          phone_id: string
          scheduled?: string | null
          status: Database["public"]["Enums"]["staged_call_status"]
          updated_at?: string
        }
        Update: {
          agent_snapshot_id?: string
          created_at?: string
          customer_phone_number?: string
          failed_attempts?: number
          field_overrides?: Json
          id?: string
          phone_id?: string
          scheduled?: string | null
          status?: Database["public"]["Enums"]["staged_call_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_agent_snapshot_id"
            columns: ["agent_snapshot_id"]
            isOneToOne: false
            referencedRelation: "agent_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agent_snapshot_id"
            columns: ["agent_snapshot_id"]
            isOneToOne: false
            referencedRelation: "agent_snapshots_enriched"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agent_snapshot_id"
            columns: ["agent_snapshot_id"]
            isOneToOne: false
            referencedRelation: "agents_enriched"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_phone_id"
            columns: ["phone_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      calls_combined: {
        Row: {
          agent_id: string | null
          agent_snapshot_id: string | null
          created_at: string | null
          customer_phone_number: string | null
          direction: Database["public"]["Enums"]["call_direction"] | null
          duration_seconds: string | null
          id: string | null
          phone_id: string | null
          phone_number_hash: string | null
          piiano_encrypted_data: string | null
          recording_bucket_name: string | null
          recording_file_name: string | null
          recording_url: string | null
          results: Json | null
          results_hash: Json | null
          staged_call_id: string | null
          status: Database["public"]["Enums"]["call_status"] | null
          summary: string | null
          transcript: Json | null
          twilio_call_sid: string | null
          vonage_call_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {}
    Enums: {
      call_direction: "inbound" | "outbound"
      call_status:
        | "in_progress"
        | "completed"
        | "dropped"
        | "transferred"
        | "failed"
        | "scheduled"
        | "no_answer"
      staged_call_status:
        | "staged"
        | "scheduled"
        | "failed"
        | "in_progress"
        | "done"
      transcription_provider: "deepgram" | "azure"
      voice_provider: "elevenlabs" | "azure"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
