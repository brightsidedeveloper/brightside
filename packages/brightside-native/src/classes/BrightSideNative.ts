import WebView from 'react-native-webview'
import { ZodSchema } from 'zod'

export default class BrightSideNative {
  postToWebView(key: string, data: unknown, webview: WebView) {
    webview.injectJavaScript(`
      window.postMessage(${JSON.stringify({ key, data })}, '*')
    `)
  }

  listenToWebView<T>(key: string, data: string, callback: (data: T) => void, schema: ZodSchema<T>) {
    const { key: eventKey, data: rawData } = JSON.parse(data)
    if (eventKey !== key) return
    const parsedData = schema.parse(rawData)
    callback(parsedData)
  }
}
