import { createContext } from 'react'
import { WebViewContextType } from './WebViewProvider'

const WebViewContext = createContext<WebViewContextType | null>(null)

export default WebViewContext
