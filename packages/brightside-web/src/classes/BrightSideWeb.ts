import { createClient, SupabaseClient } from "@supabase/supabase-js"
import BrightSideAI from "./BrightSideAI"
import BrightSideNative from "./BrightSideNative"
import BrightSideTheme from "./BrightSideTheme"
import BrightSidePush from "./BrightSidePush"
import BrightSideAuth from "./BrightSideAuth"

interface BrightSideWebConstructor {
  supabaseUrl: string
  supabaseAnonKey: string
}
export default class BrightSideWeb {
  public theme: BrightSideTheme
  public native: BrightSideNative
  public ai: BrightSideAI
  public supabase: SupabaseClient
  public push: BrightSidePush
  public auth: BrightSideAuth

  constructor({ supabaseUrl, supabaseAnonKey }: BrightSideWebConstructor) {
    this.theme = new BrightSideTheme()
    this.native = new BrightSideNative()
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
    this.ai = new BrightSideAI(this.supabase)
    this.push = new BrightSidePush(this.supabase)
    this.auth = new BrightSideAuth(this.supabase)
  }
}
