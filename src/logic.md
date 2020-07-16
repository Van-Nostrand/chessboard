LOGIC PSEUDOCODE

bishop / rook / queen logic:
get array of paths
create an object to store cells
  for each path: iterate over all cells
    let blockedFlag equal false
    if cell in path contains piece
      if piece is enemy
        if enemy has not been found in this path yet
          create key/value "coordinates": "a"
          set blockedFlag to true
        else, enemy has been found in path
          create key/value "coordinates": "b" (for blocked)
      if piece is ally
        create key/value "coordinates": "b"
        set blockedFlag to true
    else cell is empty
      if blockedFlag is false
        create key/value "coordinates": "m"
      else this cell must be blocked by something
        create key/value "coordinates": "b"
return object