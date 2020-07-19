LOGIC PSEUDOCODE

KING IN CHECK LOGIC
create a copy of piece state
  call it proposedNewState
if you just moved a piece:
  reflect the move in the new state
  build a new cell map based on that state
  determine the name of current teams king
  check if that king is now in check
  