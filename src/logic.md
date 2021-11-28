LOGIC PSEUDOCODE  

KING IN CHECK LOGIC  
create a copy of piece state  
  call it proposedNewState  
if you just moved a piece:  
  reflect the move in the new state  
  build a new cell map based on that state  
  determine the name of current teams king  
  check if that king is now in check  
  
REWORKING MOVE LOGIC: presuppose this is a pawn  
a piece is selected and named in state  
a tile is clicked  
call tileClick()  
  determine the coordinates of the tile  
  determine if that piece is allowed to move to that tile  
  if yes, call ownKingNotInCheck("m", [x,y])  
    make a copy of state: call properCopyState()  
    determine the name of this turns king  
    assign the new x and y values to the selected piece  
    build a new cellMap  
    test the new cellMap on this teams king: call KingClass.amIChecked(newCellMap, newPieces, teamKing)  
    if any pieces are found to be attacking the king  
      this move is invalid and the state copy should be thrown out  
    else the king is not being attacked  
      call turnMaintenance(arg, newPieces, newCellMap)  
        deal with pieces who have a firstmove property (rooks, kings, pawns)  
        deal with pawns who need to have enpassant flagged  
        call updateGame(newPieces, newCellMap, selectedPiece, cell, enPassantPiece)  
          update view of each piece with updatePieceVision(newPieces, newCellMap, enPassantPiece)  
            for each piecename  
              call Class.vision()  
                Pawn.vision(cellMap, pieces, name, enPassantPiece)  
