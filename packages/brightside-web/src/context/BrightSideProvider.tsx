import React, { useMemo } from 'react'
import BrightSideContext from './BrightSideContext'
import BrightSideWeb from '../classes/BrightSideWeb'

interface BrightSideProviderProps {
  brightside: BrightSideWeb
  children: React.ReactNode
}

export default function BrightSideProvider({ brightside, children }: BrightSideProviderProps) {
  const context = useBrightSide(brightside)
  return <BrightSideContext.Provider value={context}>{children}</BrightSideContext.Provider>
}

function useBrightSide(brightside: BrightSideWeb) {
  return useMemo(() => ({ brightside }), [brightside])
}

export type BrightSideContextType = ReturnType<typeof useBrightSide>
