import React from 'react'
import { WebView } from 'react-native-webview'
import useBrightSideContext from 'src/context/useBrightSideContext'

interface BrightSideWebViewProps extends React.ComponentProps<typeof WebView> {
  url: string
}

export default function BrightSideWebView({ url, ...props }: BrightSideWebViewProps) {
  const { webviewRef, handleMessage, handleLoadEnd } = useBrightSideContext()
  return <WebView {...props} ref={webviewRef} source={{ uri: url }} onMessage={handleMessage} onLoadEnd={handleLoadEnd} />
}
