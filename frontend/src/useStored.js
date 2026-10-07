import { useEffect, useState } from "react"
import { scoped, schedulePush } from "./storage.js"

export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(scoped(key))
      return saved ? JSON.parse(saved) : initial
    } catch (error) {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(scoped(key), JSON.stringify(value))
      schedulePush()
    } catch (error) {
      /* storage unavailable */
    }
  }, [key, value])

  return [value, setValue]
}