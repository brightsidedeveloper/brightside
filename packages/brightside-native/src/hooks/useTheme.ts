import { useMemo } from 'react'
import useBrightSideContext from 'src/context/private/useBrightSideContext'

export default function useTheme() {
  const { theme } = useBrightSideContext()
  return useMemo(() => theme, [theme])
}
