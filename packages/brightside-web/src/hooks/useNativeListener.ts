import { useEffect, useRef } from 'react'
import useNative from 'src/context/useNative'
import { ZodSchema } from 'zod'

export default function useNativeListener<T>(key: string, callback: (data: T) => void, schema: ZodSchema<T>) {
  const { brightside } = useNative()

  const cb = useRef(callback)
  const schemaRef = useRef(schema)

  useEffect(() => brightside.native.listenToNative(key, cb.current, schemaRef.current), [brightside, key])
}
