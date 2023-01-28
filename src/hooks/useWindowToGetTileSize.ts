import { useState, useEffect, useRef } from 'react'

const MAX_TILE_SIZE = 64
const TILE_SIZE_RATIO = 0.065
const MOBILE_TILE_SIZE_RATIO = 0.11

export default function useWindowToGetTileSize (): [ts: number, mw: boolean] {

  const [tileSize, setTileSize] = useState<number>(MAX_TILE_SIZE)
  const [mobileWindow, setMobileWindow] = useState(false)
  const _mobileWindow = useRef(false)

  useEffect(() => {
    const handleResize = () => {
      setMobileWindow(window.innerWidth < 600)
      _mobileWindow.current = window.innerWidth < 600
      setTileSize(Math.min(Math.round(window.innerWidth * (_mobileWindow.current ? MOBILE_TILE_SIZE_RATIO : TILE_SIZE_RATIO)), MAX_TILE_SIZE))
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return [tileSize, mobileWindow]
}
