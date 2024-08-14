import { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'

export default class BrightSidePush {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async sendPushNotification(title: string, body: string, data: Record<string, unknown>, recipients: string[]) {
    const { data: response, error } = await this.supabase.functions.invoke('send_push_notification', {
      body: {
        title,
        body,
        data,
        recipients,
      },
    })
    if (error) throw new Error(error.message)
    return response
  }

  async getPushToken() {
    // @ts-expect-error This is injected by the native side
    const post = window.ReactNativeWebView?.postMessage
    if (!post) return Promise.resolve({ token: null })

    const promise = new Promise<PushToken>((resolve) => {
      const listener = (event: MessageEvent) => {
        const { key: eventKey, data } = event.data
        if (eventKey !== 'getPushToken') return
        const parsedData = PushTokenSchema.parse(data)
        resolve(parsedData)
      }

      window.addEventListener('message', listener)
    })

    post(JSON.stringify({ key: 'getPushToken', data: {} }))

    return promise
  }
}

const PushTokenSchema = z.object({
  token: z.string().nullable(),
})

type PushToken = z.infer<typeof PushTokenSchema>
