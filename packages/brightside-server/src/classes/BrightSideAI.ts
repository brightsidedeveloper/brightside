import debug from 'debug'
import OpenAI from 'openai'

const log = debug('brightside:ai')

export default class BrightSideAI {
  private openai: OpenAI
  private elevenlabsApiKey: string

  constructor({ openaiApiKey, elevenlabsApiKey }: { openaiApiKey: string; elevenlabsApiKey: string }) {
    this.openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true,
    })
    this.elevenlabsApiKey = elevenlabsApiKey
  }

  async createThread() {
    const thread = await this.openai.beta.threads.create()
    log('Created thread: %o', thread)
    return thread.id
  }

  async generateText(prompt: string, threadId: string, assistant_id: string) {
    const start = Date.now()
    if (!prompt) throw new Error('No prompt to generate text')
    if (!threadId) throw new Error('No threadId to generate text')
    if (!assistant_id) throw new Error('No assistant_id to generate text')

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt,
    })

    await this.openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id,
    })

    const messages = await this.openai.beta.threads.messages.list(threadId)
    const res = messages.data[0].content[0]

    log('Generated text in %dms: %o', Date.now() - start, res)
    if ('text' in res) return res.text.value
    return 'There was an error with the AI response.'
  }

  async speechToText(mp4Blob: Blob) {
    const start = Date.now()
    if (!mp4Blob) throw new Error('No audio to transcribe')
    if (mp4Blob.type !== 'audio/mp4') throw new Error('Invalid audio type')
    const wavBlob = await this.convertMp4ToWav(mp4Blob)
    if (!wavBlob) throw new Error('Failed to convert audio to WAV')
    const response = await this.openai.audio.transcriptions.create({
      file: new File([wavBlob], 'audio.wav', { type: wavBlob.type }),
      model: 'whisper-1',
    })
    log('Transcribed audio in %dms: %o', Date.now() - start, response)
    return response.text
  }

  async textToSpeech(text: string, voice_id: string) {
    const start = Date.now()
    if (!text) throw new Error('No text to convert to speech')
    if (!voice_id) throw new Error('No voice_id to convert to speech')
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice_id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenlabsApiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })
    if (!response.ok) {
      const errorDetails = await response.text()
      throw new Error(`Fetch not ok! status: ${errorDetails}`)
    }

    log('Converted text to speech in %dms: %o', Date.now() - start, response)
    return response.blob()
  }

  private async convertMp4ToWav(mp4Blob: Blob): Promise<Blob> {
    const arrayBuffer = await mp4Blob.arrayBuffer()
    const audioContext = new AudioContext()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    return this.audioBufferToWavBlob(audioBuffer)
  }

  private audioBufferToWavBlob(audioBuffer: AudioBuffer): Blob {
    const numberOfChannels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const format = 1 // PCM
    const bitDepth = 16

    const resultBuffer = new ArrayBuffer(44 + audioBuffer.length * numberOfChannels * 2)
    const view = new DataView(resultBuffer)

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF')
    /* file length */
    view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true)
    /* RIFF type */
    this.writeString(view, 8, 'WAVE')
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ')
    /* format chunk length */
    view.setUint32(16, 16, true)
    /* sample format (raw) */
    view.setUint16(20, format, true)
    /* channel count */
    view.setUint16(22, numberOfChannels, true)
    /* sample rate */
    view.setUint32(24, sampleRate, true)
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * numberOfChannels * 2, true)
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numberOfChannels * 2, true)
    /* bits per sample */
    view.setUint16(34, bitDepth, true)
    /* data chunk identifier */
    this.writeString(view, 36, 'data')
    /* data chunk length */
    view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true)

    /* PCM samples */
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i]
        const value = Math.max(-1, Math.min(1, sample))
        view.setInt16(44 + i * 2 * numberOfChannels + channel * 2, value < 0 ? value * 0x8000 : value * 0x7fff, true)
      }
    }

    return new Blob([view], { type: 'audio/wav' })
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
}
