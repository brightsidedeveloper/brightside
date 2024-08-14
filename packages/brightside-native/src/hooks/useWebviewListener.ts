import { useEffect } from 'react'
import useBrightSideContext from 'src/context/private/useBrightSideContext'
import { ZodSchema } from 'zod'

export default function useWebViewListener<T>(key: string, callback: (data: T) => void, schema: ZodSchema<T>) {
  const { addListener, removeListener } = useBrightSideContext()

  useEffect(() => {
    addListener(key, (data: unknown) => {
      try {
        const parsedData = schema.parse(data)
        callback(parsedData)
      } catch (e) {
        console.error(`Error parsing data for key: ${key}`, e)
      }
    })

    return () => {
      removeListener(key)
    }
  }, [])
}
