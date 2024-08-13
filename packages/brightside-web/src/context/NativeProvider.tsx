import BrightSideWeb from 'src/classes/BrightSideWeb'
import NativeContext from './NativeContext'
import React, { useMemo } from 'react'

interface NativeProviderProps {
  brightside: BrightSideWeb
  children: React.ReactNode
}

export default function NativeProvider({ brightside, children }: NativeProviderProps) {
  const context = useNative(brightside)
  return <NativeContext.Provider value={context}>{children}</NativeContext.Provider>
}

function useNative(brightside: BrightSideWeb) {
  return useMemo(
    () => ({
      brightside,
    }),
    [brightside]
  )
}

export type NativeContextType = ReturnType<typeof useNative>
