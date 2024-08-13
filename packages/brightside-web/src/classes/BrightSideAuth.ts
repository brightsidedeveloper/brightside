import { SupabaseClient } from "@supabase/supabase-js"

export default class BrightSideAuth {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw new Error(error.message)
    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)
    return data
  }

  async signOut() {
    await this.supabase.auth.signOut()
  }
}
