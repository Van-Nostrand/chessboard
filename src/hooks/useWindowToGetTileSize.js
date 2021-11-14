import { useState, useEffect } from 'react'
const BASETILESIZE = 96

export default function useWindowToGetTileSize () {

  const [ tileSize, setTileSize ] = useState(BASETILESIZE)
  useEffect(() => {
    const handleResize = () => {
      if (tileSize !== (BASETILESIZE * 0.75) && window.innerWidth > 1800) {
        setTileSize(BASETILESIZE * 0.75)
      }
      //desktop
      else if (tileSize !== (BASETILESIZE * 0.625) && window.innerWidth > 1200 && window.innerWidth <= 1800) {
        setTileSize(BASETILESIZE * 0.625)
      }
      //tablet landscape
      else if ( tileSize !== (BASETILESIZE * 0.5625) && window.innerWidth <= 1200 && window.innerWidth > 900) {
        setTileSize(BASETILESIZE * 0.5625)
      }
      //tablet portrait
      else if (tileSize !== (BASETILESIZE * 0.5) && window.innerWidth <= 900 && window.innerWidth > 600) {
        setTileSize(BASETILESIZE * 0.5)
      }
      //phone
      else if (tileSize !== (BASETILESIZE * 0.4) && window.innerWidth <= 600) {
        setTileSize(BASETILESIZE * 0.4)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return tileSize
}

// const checkResize = () => {
//   const currentWidth = window.innerWidth
//   let newScreenType

//   switch (true) {
//   case currentWidth > 1800:
//     newScreenType = 'big'
//     break
//   case currentWidth <= 1800 && currentWidth > 1200:
//     newScreenType = 'desktop'
//     break
//   case currentWidth <= 1200 && currentWidth > 900:
//     newScreenType = 'tab-land'
//     break
//   case currentWidth <= 900 && currentWidth > 600:
//     newScreenType = 'tab-port'
//     break
//   case currentWidth <= 600:
//     newScreenType = 'phone'
//     break
//   default: console.log('ERROR IN HANDLE RESIZE')
//   }
//   if (newScreenType !== chessGameState.screenType) {
//     dispatch({
//       type: 'screenBreakpoint',
//       screenType: newScreenType,
//       windowSize: currentWidth
//     })
//   }
//   else {
//     dispatch({
//       type: 'windowWidthChange',
//       windowSize: currentWidth
//     })
//   }
// }
