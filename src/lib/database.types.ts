export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          frame: Json
          size: Json
          image_url: string
          total_price: number
          status: string
          shipping_address: Json
          assigned_vendor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          frame: Json
          size: Json
          image_url: string
          total_price: number
          status?: string
          shipping_address: Json
          assigned_vendor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          frame?: Json
          size?: Json
          image_url?: string
          total_price?: number
          status?: string
          shipping_address?: Json
          assigned_vendor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          status: string
          username: string
          password: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: string
          username: string
          password: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: string
          username?: string
          password?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}