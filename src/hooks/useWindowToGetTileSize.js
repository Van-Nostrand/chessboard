import { useState, useEffect } from 'react'

const BASETILESIZE = 56
const TILE_SIZE_RATIO = 0.065

export default function useWindowToGetTileSize () {

  const [tileSize, setTileSize] = useState(BASETILESIZE)
  const [windowSize, setWindowSize] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      setTileSize(Math.min(Math.round(window.innerWidth * TILE_SIZE_RATIO), BASETILESIZE))

      switch (true) {
        case window.innerWidth > 1200 && window.innerWidth <= 1800:
          setWindowSize('desktop')
          break
        case window.innerWidth <= 1200 && window.innerWidth > 900:
          setWindowSize('tab-land')
          break
        case window.innerWidth <= 900 && window.innerWidth > 600:
          setWindowSize('tab-portrait')
          break
        case window.innerWidth <= 600:
          setWindowSize('small')
          break
        default: setWindowSize('large')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return [tileSize, windowSize]
}
