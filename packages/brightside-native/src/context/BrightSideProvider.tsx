import React, { useCallback, useMemo, useRef, useState } from 'react'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import BrightSideContext from './BrightSideContext'
import { SplashScreen } from 'expo-router'
import { useColorScheme } from 'react-native'

SplashScreen.preventAutoHideAsync()

interface BrightSideProviderProps extends UseBrightSideProps {
  children: React.ReactNode
}

export default function BrightSideProvider({ children, ...props }: BrightSideProviderProps) {
  const context = useBrightSide(props)
  return <BrightSideContext.Provider value={context}>{children}</BrightSideContext.Provider>
}

interface BrightSideTheme {
  dark: { backgroundColor: string }
  light: { backgroundColor: string }
}

interface UseBrightSideProps {
  theme?: BrightSideTheme
}

function useBrightSide({ theme: fullTheme }: UseBrightSideProps) {
  const colorScheme = useColorScheme()
  const [loaded, setLoaded] = useState(false)

  const theme = useMemo(() => {
    if (!fullTheme) return { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
    const scheme = colorScheme === 'dark' ? 'dark' : 'light'
    return fullTheme[scheme]
  }, [colorScheme, fullTheme])

  const webviewRef = useRef<WebView>(null)

  const onMessageListenersRef = useRef<Record<string, (data: unknown) => void>>({})

  const handleMessage = useCallback((e: WebViewMessageEvent) => {
    const { key, data } = JSON.parse(e.nativeEvent.data)
    onMessageListenersRef.current[key]?.(data)
  }, [])

  const addListener = useCallback((key: string, callback: (data: unknown) => void) => {
    onMessageListenersRef.current[key] = callback
  }, [])

  const removeListener = useCallback((key: string) => {
    delete onMessageListenersRef.current[key]
  }, [])

  const handleLoadEnd = useCallback(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000)
    setLoaded(true)
  }, [])

  return useMemo(
    () => ({
      webviewRef,
      loaded,
      theme,
      handleMessage,
      addListener,
      removeListener,
      handleLoadEnd,
    }),
    [loaded, theme, handleMessage, addListener, removeListener, handleLoadEnd]
  )
}

export type BrightSideContextType = ReturnType<typeof useBrightSide>
