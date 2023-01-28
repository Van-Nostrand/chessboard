import { useState, useEffect } from 'react'

/**
 * use to set permanent console logs to aid in development
 */
export default function useDevLogger () {
  const [dev, setDev] = useState(false)

  function logger (...args: any[]) {
    if (dev) {
      console.log(...args)
    }
  }

  useEffect(() => {
    setDev(process.env.NODE_ENV === 'development')
  }, [])

  return logger
}
