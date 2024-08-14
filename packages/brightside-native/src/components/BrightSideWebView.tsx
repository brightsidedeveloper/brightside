import React from 'react'
import { WebView } from 'react-native-webview'
import useBrightSideContext from 'src/context/brightside/useBrightSideContext'
import useSendPushToken from 'src/hooks/useSendPushToken'

interface BrightSideWebViewProps extends React.ComponentProps<typeof WebView> {
  url: string
}

export default function BrightSideWebView({ url, ...props }: BrightSideWebViewProps) {
  const { webviewRef, handleMessage, handleLoadEnd } = useBrightSideContext()
  useSendPushToken()
  return <WebView {...props} ref={webviewRef} source={{ uri: url }} onMessage={handleMessage} onLoadEnd={handleLoadEnd} />
}
