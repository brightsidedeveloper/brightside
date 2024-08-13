import BrightSideWebView from "./BrightSideWebView"

export default class BrightSideNative {
  public webview: BrightSideWebView

  constructor() {
    this.webview = new BrightSideWebView()
  }
}
