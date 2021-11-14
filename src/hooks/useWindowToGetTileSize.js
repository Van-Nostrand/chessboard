import { useState, useEffect } from 'react'
const BASETILESIZE = 96

export default function useWindowToGetTileSize () {

  const [ tileSize, setTileSize ] = useState(BASETILESIZE)
  const [ windowSize, setWindowSize ] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      if (tileSize !== (BASETILESIZE * 0.75) && window.innerWidth > 1800) {
        setTileSize(BASETILESIZE * 0.75)
        setWindowSize('large')
      }
      //desktop
      else if (tileSize !== (BASETILESIZE * 0.625) && window.innerWidth > 1200 && window.innerWidth <= 1800) {
        setTileSize(BASETILESIZE * 0.625)
        setWindowSize('desktop')
      }
      //tablet landscape
      else if ( tileSize !== (BASETILESIZE * 0.5625) && window.innerWidth <= 1200 && window.innerWidth > 900) {
        setTileSize(BASETILESIZE * 0.5625)
        setWindowSize('tab-land')
      }
      //tablet portrait
      else if (tileSize !== (BASETILESIZE * 0.5) && window.innerWidth <= 900 && window.innerWidth > 600) {
        setTileSize(BASETILESIZE * 0.5)
        setWindowSize('tab-portrait')
      }
      //phone
      else if (tileSize !== (BASETILESIZE * 0.4) && window.innerWidth <= 600) {
        setTileSize(BASETILESIZE * 0.4)
        setWindowSize('small')
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
