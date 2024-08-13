import BrightSideNative from 'src/classes/BrightSideNative'
import WebViewContext from './WebViewContext'
import React, { useCallback, useMemo, useRef } from 'react'
import WebView from 'react-native-webview'

interface WebViewProviderProps {
  brightside: BrightSideNative
  children: React.ReactNode
}

export default function WebViewProvider({ brightside, children }: WebViewProviderProps) {
  const context = useWebview(brightside)
  return <WebViewContext.Provider value={context}>{children}</WebViewContext.Provider>
}

function useWebview(brightside: BrightSideNative) {
  const webviewRef = useRef<WebView>(null)

  const postToWebView = useCallback(
    (key: string, data: unknown) => {
      if (!webviewRef.current) throw new Error('webviewRef from useNative must be attached to Webview')
      brightside.postToWebView(key, data, webviewRef.current)
    },
    [brightside]
  )

  return useMemo(
    () => ({
      webviewRef,
      brightside,
      postToWebView,
    }),
    [brightside, postToWebView]
  )
}

export type WebViewContextType = ReturnType<typeof useWebview>
