import { useContext } from 'react'
import WebViewContext from './WebViewContext'

export default function useWebView() {
  const context = useContext(WebViewContext)
  if (!context) throw new Error('useWebView must be used within a WebViewProvide3r')
  return context
}
