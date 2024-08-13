import { useContext } from "react"
import NativeContext from "./BrightSideContext"

export default function useBrightSide() {
  const context = useContext(NativeContext)
  if (!context)
    throw new Error("useBrightSide must be used within a BrightSideProvider")
  return context
}
