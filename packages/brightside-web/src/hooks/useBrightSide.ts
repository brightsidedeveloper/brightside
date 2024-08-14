import { useMemo } from 'react'
import useBrightSideContext from '../context/useBrightSideContext'

export default function useBrightSide() {
    const { brightside } = useBrightSideContext()
  return useMemo(() => brightside, [brightside])
}
