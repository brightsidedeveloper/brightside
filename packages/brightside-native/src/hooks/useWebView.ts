import { useMemo } from 'react'
import useBrightSideContext from 'src/context/private/useBrightSideContext'

export default function useWebView() {
  const { webviewRef, loaded, sendMessage } = useBrightSideContext()
  return useMemo(() => ({ webviewRef, loaded, sendMessage }), [webviewRef, sendMessage])
}
