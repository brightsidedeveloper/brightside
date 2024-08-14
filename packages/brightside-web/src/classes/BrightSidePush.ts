import { SupabaseClient } from "@supabase/supabase-js"

export default class BrightSidePush {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async sendPushNotification(
    title: string,
    body: string,
    data: Record<string, unknown>,
    recipients: string[]
  ) {
    const { data: response, error } = await this.supabase.functions.invoke(
      "send_push_notification",
      {
        body: {
          title,
          body,
          data,
          recipients,
        },
      }
    )
    if (error) throw new Error(error.message)
    return response
  }
}
