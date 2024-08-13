import { useCallback, useRef } from 'react'
import useWebView from 'src/context/useWebView'
import { ZodSchema } from 'zod'

export default function useNativeListener<T>(key: string, callback: (data: T) => void, schema: ZodSchema<T>) {
  const { brightside } = useWebView()

  const cb = useRef(callback)
  const schemaRef = useRef(schema)

  return useCallback((data: string) => brightside.listenToWebView(key, data, cb.current, schemaRef.current), [brightside, key])
}
