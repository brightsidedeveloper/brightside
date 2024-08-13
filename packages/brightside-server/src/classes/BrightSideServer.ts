import BrightSideAI from './BrightSideAI'

export default class BrightSideServer {
  public ai: BrightSideAI

  constructor(keys: { openaiApiKey: string; elevenlabsApiKey: string }) {
    this.ai = new BrightSideAI(keys)
  }
}
