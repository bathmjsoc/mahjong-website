export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      attendance: {
        Row: {
          locked: boolean;
          player_id: string;
          registered: boolean;
          session_id: string;
        };
        Insert: {
          locked: boolean;
          player_id: string;
          registered: boolean;
          session_id: string;
        };
        Update: {
          locked?: boolean;
          player_id?: string;
          registered?: boolean;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      keep_alive: {
        Row: {
          id: number;
          timestamp: string;
        };
        Insert: {
          id?: number;
          timestamp?: string;
        };
        Update: {
          id?: number;
          timestamp?: string;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          disabled: boolean;
          faan: number | null;
          hand_type: string | null;
          id: string;
          loser_ids: string[];
          other_ids: string[];
          session_id: string;
          timestamp: string;
          tournament_id: string;
          win_type: Database["public"]["Enums"]["winType"];
          winner_ids: string[];
        };
        Insert: {
          disabled?: boolean;
          faan?: number | null;
          hand_type?: string | null;
          id?: string;
          loser_ids: string[];
          other_ids: string[];
          session_id: string;
          timestamp?: string;
          tournament_id: string;
          win_type: Database["public"]["Enums"]["winType"];
          winner_ids: string[];
        };
        Update: {
          disabled?: boolean;
          faan?: number | null;
          hand_type?: string | null;
          id?: string;
          loser_ids?: string[];
          other_ids?: string[];
          session_id?: string;
          timestamp?: string;
          tournament_id?: string;
          win_type?: Database["public"]["Enums"]["winType"];
          winner_ids?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "logs_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "logs_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
        ];
      };
      players: {
        Row: {
          id: string;
          name: string;
          tournament_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          tournament_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          tournament_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "players_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          id: string;
          number: number;
          start_date: string;
          tournament_id: string;
        };
        Insert: {
          id?: string;
          number: number;
          start_date?: string;
          tournament_id: string;
        };
        Update: {
          id?: string;
          number?: number;
          start_date?: string;
          tournament_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_tournament_id_fkey";
            columns: ["tournament_id"];
            isOneToOne: false;
            referencedRelation: "tournaments";
            referencedColumns: ["id"];
          },
        ];
      };
      tables: {
        Row: {
          east_id: string | null;
          id: string;
          north_id: string | null;
          number: number;
          saved: boolean;
          session_id: string;
          south_id: string | null;
          west_id: string | null;
        };
        Insert: {
          east_id?: string | null;
          id?: string;
          north_id?: string | null;
          number: number;
          saved?: boolean;
          session_id: string;
          south_id?: string | null;
          west_id?: string | null;
        };
        Update: {
          east_id?: string | null;
          id?: string;
          north_id?: string | null;
          number?: number;
          saved?: boolean;
          session_id?: string;
          south_id?: string | null;
          west_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tables_east_id_fkey";
            columns: ["east_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tables_north_id_fkey";
            columns: ["north_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tables_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tables_south_id_fkey";
            columns: ["south_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tables_west_id_fkey";
            columns: ["west_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      tournaments: {
        Row: {
          hand_types: string[];
          id: string;
          last_updated: string;
          name: string;
          player_count: number;
          scoring_rules: Json[];
          user_id: string;
        };
        Insert: {
          hand_types: string[];
          id?: string;
          last_updated?: string;
          name: string;
          player_count?: number;
          scoring_rules: Json[];
          user_id?: string;
        };
        Update: {
          hand_types?: string[];
          id?: string;
          last_updated?: string;
          name?: string;
          player_count?: number;
          scoring_rules?: Json[];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      winType: "打出" | "自摸" | "包自摸" | "詐糊";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      winType: ["打出", "自摸", "包自摸", "詐糊"],
    },
  },
} as const;
