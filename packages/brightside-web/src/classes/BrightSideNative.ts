import { ZodSchema } from 'zod'

export default class BrightSideNative {
  sendMessage(key: string, data: unknown) {
    // @ts-expect-error This is injected by the native side
    const post = window.ReactNativeWebView?.postMessage
    if (!post) return console.log('postMessage not available because window.ReactNativeWebView is not defined')
    post(JSON.stringify({key, data}))
  }

  listenToNative<T>(
    key: string,
    callback: (data: T) => void,
    schema: ZodSchema<T>,
    parser: (data: unknown) => T = (data) => schema.parse(data)
  ) {
    const listener = (event: MessageEvent) => {
      const { key: eventKey, data } = event.data
      if (eventKey !== key) return
      const parsedData = parser(data)
      callback(parsedData)
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }
}
