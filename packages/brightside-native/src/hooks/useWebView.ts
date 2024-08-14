import { useCallback, useMemo } from 'react'
import useBrightSideContext from '../context/useBrightSideContext'

export default function useWebView() {
  const { webviewRef, loaded } = useBrightSideContext()

  const sendMessage = useCallback(
    (key: string, data: unknown) => {
      if (!webviewRef.current) throw new Error('webviewRef from useNative must be attached to Webview')
      webviewRef.current.injectJavaScript(`
              window.postMessage(${JSON.stringify({ key, data })}, '*')
            `)
    },
    [webviewRef]
  )

  return useMemo(() => ({ webviewRef, loaded, sendMessage }), [webviewRef, sendMessage])
}
