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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      booked_seats: {
        Row: {
          booking_id: string
          id: string
          seat_id: string
          show_date: string
          show_time: string
          theater_id: string
          title_id: string
        }
        Insert: {
          booking_id: string
          id?: string
          seat_id: string
          show_date: string
          show_time: string
          theater_id: string
          title_id: string
        }
        Update: {
          booking_id?: string
          id?: string
          seat_id?: string
          show_date?: string
          show_time?: string
          theater_id?: string
          title_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booked_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booked_at: string
          cancelled: boolean
          coupon_code: string | null
          discount: number
          fnb: Json
          format: string
          id: string
          ref: string
          screen: string
          seats: Json
          show_date: string
          show_time: string
          theater_id: string
          theater_name: string
          title_id: string
          total: number
          user_id: string
        }
        Insert: {
          booked_at?: string
          cancelled?: boolean
          coupon_code?: string | null
          discount?: number
          fnb?: Json
          format: string
          id?: string
          ref: string
          screen?: string
          seats?: Json
          show_date: string
          show_time: string
          theater_id: string
          theater_name: string
          title_id: string
          total?: number
          user_id: string
        }
        Update: {
          booked_at?: string
          cancelled?: boolean
          coupon_code?: string | null
          discount?: number
          fnb?: Json
          format?: string
          id?: string
          ref?: string
          screen?: string
          seats?: Json
          show_date?: string
          show_time?: string
          theater_id?: string
          theater_name?: string
          title_id?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
        ]
      }
      cast_members: {
        Row: {
          id: string
          initials: string
          name: string
          role: string
          sort_order: number
          title_id: string
        }
        Insert: {
          id?: string
          initials: string
          name: string
          role: string
          sort_order?: number
          title_id: string
        }
        Update: {
          id?: string
          initials?: string
          name?: string
          role?: string
          sort_order?: number
          title_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cast_members_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          name: string
          sort_order: number
        }
        Insert: {
          name: string
          sort_order?: number
        }
        Update: {
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          discount: number
          label: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          code: string
          discount: number
          label: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          code?: string
          discount?: number
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      fnb_items: {
        Row: {
          category: string
          description: string
          emoji: string
          id: string
          name: string
          price: number
          sort_order: number
        }
        Insert: {
          category: string
          description?: string
          emoji?: string
          id: string
          name: string
          price: number
          sort_order?: number
        }
        Update: {
          category?: string
          description?: string
          emoji?: string
          id?: string
          name?: string
          price?: number
          sort_order?: number
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          id: string
          image_key: string
          sort_order: number
          subtitle: string
          tag: string
          title: string
          title_id: string
        }
        Insert: {
          id: string
          image_key: string
          sort_order?: number
          subtitle: string
          tag: string
          title: string
          title_id: string
        }
        Update: {
          id?: string
          image_key?: string
          sort_order?: number
          subtitle?: string
          tag?: string
          title?: string
          title_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hero_slides_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      seat_tiers: {
        Row: {
          cols: number
          name: string
          price: number
          seat_rows: string[]
          sort_order: number
        }
        Insert: {
          cols: number
          name: string
          price: number
          seat_rows: string[]
          sort_order?: number
        }
        Update: {
          cols?: number
          name?: string
          price?: number
          seat_rows?: string[]
          sort_order?: number
        }
        Relationships: []
      }
      shows: {
        Row: {
          format: string
          id: string
          price: number
          sort_order: number
          status: string
          theater_id: string
          time_label: string
        }
        Insert: {
          format: string
          id?: string
          price: number
          sort_order?: number
          status: string
          theater_id: string
          time_label: string
        }
        Update: {
          format?: string
          id?: string
          price?: number
          sort_order?: number
          status?: string
          theater_id?: string
          time_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "shows_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theaters: {
        Row: {
          amenities: string[]
          area: string
          cancellable: boolean
          distance: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          amenities?: string[]
          area: string
          cancellable?: boolean
          distance?: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          amenities?: string[]
          area?: string
          cancellable?: boolean
          distance?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      titles: {
        Row: {
          backdrop_key: string
          category: string
          certification: string
          created_at: string
          date_label: string | null
          duration: string
          formats: string[]
          genres: string[]
          id: string
          kind: string
          languages: string[]
          name: string
          poster_key: string
          price_from: number
          rating: number
          release_label: string
          sort_order: number
          synopsis: string
          venue: string | null
          votes: string
        }
        Insert: {
          backdrop_key: string
          category: string
          certification?: string
          created_at?: string
          date_label?: string | null
          duration?: string
          formats?: string[]
          genres?: string[]
          id: string
          kind: string
          languages?: string[]
          name: string
          poster_key: string
          price_from?: number
          rating?: number
          release_label?: string
          sort_order?: number
          synopsis?: string
          venue?: string | null
          votes?: string
        }
        Update: {
          backdrop_key?: string
          category?: string
          certification?: string
          created_at?: string
          date_label?: string | null
          duration?: string
          formats?: string[]
          genres?: string[]
          id?: string
          kind?: string
          languages?: string[]
          name?: string
          poster_key?: string
          price_from?: number
          rating?: number
          release_label?: string
          sort_order?: number
          synopsis?: string
          venue?: string | null
          votes?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
