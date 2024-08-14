import { useEffect, useRef } from "react"
import { ZodSchema } from "zod"
import useBrightSide from "./useBrightSide"

export default function useNativeListener<T>(
  key: string,
  callback: (data: T) => void,
  schema: ZodSchema<T>
) {
  const brightside = useBrightSide()

  const cbRef = useRef(callback)
  cbRef.current = callback
  const schemaRef = useRef(schema)
  schemaRef.current = schema

  useEffect(
    () =>
      brightside.native.listenToNative(key, cbRef.current, schemaRef.current),
    [brightside, key]
  )
}
