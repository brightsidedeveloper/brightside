import { useMemo } from 'react'
import useBrightSideContext from 'src/context/useBrightSideContext'

export default function useTheme() {
  const { theme } = useBrightSideContext()
  return useMemo(() => theme, [theme])
}
