import BrightSideNative from './BrightSideNative'
import BrightSideTheme from './BrightSideTheme'

export default class BrightSideWeb {
  public theme: BrightSideTheme
  public native: BrightSideNative

  constructor() {
    this.theme = new BrightSideTheme()
    this.native = new BrightSideNative()
  }
}
