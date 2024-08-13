import { useContext } from 'react'
import NativeContext from './NativeContext'

export default function useNative() {
  const context = useContext(NativeContext)
  if (!context) throw new Error('useNative must be used within a NativeProvider')
  return context
}
