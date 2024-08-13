import { createContext } from 'react'
import { NativeContextType } from './NativeProvider'

const NativeContext = createContext<NativeContextType | null>(null)

export default NativeContext
