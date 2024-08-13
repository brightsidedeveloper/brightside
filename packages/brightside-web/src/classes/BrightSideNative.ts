import { ZodSchema } from 'zod'

export default class BrightSideNative {
  postToNative(key: string, data: unknown) {
    // @ts-expect-error This is injected by the native side
    const post = window.ReactNativeWebView?.postMessage
    if (!post) throw new Error('postMessage not available because window.ReactNativeWebView is not defined')
    post(JSON.stringify(data))
  }

  listenToNative<T>(
    key: string,
    callback: (data: T) => void,
    schema: ZodSchema<T>,
    parser: (data: unknown) => T = (data) => schema.parse(data)
  ) {
    const listener = (event: MessageEvent) => {
      const { key: eventKey, data } = JSON.parse(event.data)
      if (eventKey !== key) return
      const parsedData = parser(data)
      callback(parsedData)
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }
}
