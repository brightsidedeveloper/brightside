import { SupabaseClient } from "@supabase/supabase-js"

export default class BrightSideAI {
  private supabase: SupabaseClient

  private threadId: string | null = null
  private assistantId: string | null = null

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async createThread() {
    const { data, error } = await this.supabase.functions.invoke(
      "create_thread",
      {
        body: {},
      }
    )
    if (error) throw new Error(error.message)
    this.threadId = data?.id
    return this.threadId
  }

  async setAssistantId(assistantId: string) {
    this.assistantId = assistantId
  }

  async generateText(input: string) {
    if (!this.threadId)
      throw new Error("Thread ID not set - first run createThread()")
    if (!this.assistantId)
      throw new Error(
        "Assistant ID not set - first run setAssistantId(id: string)"
      )
    const { data, error } = await this.supabase.functions.invoke(
      "generate_text",
      {
        body: {
          input,
          threadId: this.threadId,
          assistantId: this.assistantId,
        },
      }
    )
    if (error) throw new Error(error.message)
    return data?.text
  }

  async speechToText(mp4AudioBlob: Blob) {
    if (!mp4AudioBlob) throw new Error("No audio to transcribe")
    if (mp4AudioBlob.type !== "audio/mp4") throw new Error("Invalid audio type")
    const { data, error } = await this.supabase.functions.invoke(
      "speech_to_text",
      {
        body: mp4AudioBlob,
        headers: {
          "Content-Type": "audio/mp4",
        },
      }
    )
    if (error) throw new Error(error.message)
    return data?.text
  }

  async textToSpeech(text: string) {
    if (!text) throw new Error("No text to convert to speech")
    const { data, error } = await this.supabase.functions.invoke(
      "text_to_speech",
      {
        body: text,
      }
    )
    if (error) throw new Error(error.message)
    return data as Blob
  }
}
