export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_texts: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string | null
          content_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          participants: number | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          participants?: number | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          participants?: number | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          editable: boolean | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          editable?: boolean | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          editable?: boolean | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          address: string | null
          age_groups: Database["public"]["Enums"]["age_group"][]
          available_dates: Json | null
          booking_required: boolean | null
          category_id: string | null
          city: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          email: string | null
          featured: boolean | null
          featured_image: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          max_participants: number | null
          modality: Database["public"]["Enums"]["modality"]
          payment_type: string | null
          phone: string | null
          price_from: number | null
          price_to: number | null
          provider_id: string | null
          published: boolean | null
          purchasable: boolean | null
          stripe_price_id: string | null
          title: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          age_groups?: Database["public"]["Enums"]["age_group"][]
          available_dates?: Json | null
          booking_required?: boolean | null
          category_id?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          email?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_participants?: number | null
          modality?: Database["public"]["Enums"]["modality"]
          payment_type?: string | null
          phone?: string | null
          price_from?: number | null
          price_to?: number | null
          provider_id?: string | null
          published?: boolean | null
          purchasable?: boolean | null
          stripe_price_id?: string | null
          title: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          age_groups?: Database["public"]["Enums"]["age_group"][]
          available_dates?: Json | null
          booking_required?: boolean | null
          category_id?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          email?: string | null
          featured?: boolean | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_participants?: number | null
          modality?: Database["public"]["Enums"]["modality"]
          payment_type?: string | null
          phone?: string | null
          price_from?: number | null
          price_to?: number | null
          provider_id?: string | null
          published?: boolean | null
          purchasable?: boolean | null
          stripe_price_id?: string | null
          title?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          content_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          booking_date: string | null
          content_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          participants: number | null
          payment_method: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_date?: string | null
          content_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          participants?: number | null
          payment_method?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_date?: string | null
          content_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          participants?: number | null
          payment_method?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          address: string | null
          business_name: string
          city: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_name: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          content_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          title: string | null
          user_id: string | null
          validated: boolean | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          comment?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          title?: string | null
          user_id?: string | null
          validated?: boolean | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          comment?: string | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          title?: string | null
          user_id?: string | null
          validated?: boolean | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      create_category: {
        Args: {
          category_name: string
          category_slug: string
          category_description?: string
          category_icon?: string
          category_color?: string
        }
        Returns: string
      }
      get_contents_within_radius: {
        Args: { center_lat: number; center_lon: number; radius_km?: number }
        Returns: {
          id: string
          title: string
          description: string
          city: string
          latitude: number
          longitude: number
          distance_km: number
        }[]
      }
      update_app_text: {
        Args: { text_key: string; new_value: string }
        Returns: undefined
      }
      update_category: {
        Args: {
          category_id: string
          category_name: string
          category_slug: string
          category_description?: string
          category_icon?: string
          category_color?: string
          category_active?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      age_group: "0-12m" | "1-3a" | "3-6a" | "6-10a"
      content_type: "corso" | "servizio" | "evento" | "centro" | "campo_estivo"
      modality: "online" | "presenza" | "ibrido"
      user_role: "genitore" | "provider" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_group: ["0-12m", "1-3a", "3-6a", "6-10a"],
      content_type: ["corso", "servizio", "evento", "centro", "campo_estivo"],
      modality: ["online", "presenza", "ibrido"],
      user_role: ["genitore", "provider", "admin"],
    },
  },
} as const
