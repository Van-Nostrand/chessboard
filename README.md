This is a chessboard app that has haunted me since College. I tried it in Java and never finished it. Let's see if I can finish it in React.

TODO: April 11 
- implement regex that identifies piece types - DONE
- clean up App.js constructor function - WORKED AROUND IT
- - clean up game initialization - DONE!
- implement checker tile pattern - DONE
- implement piece killing
- - implement legal moves
- - - implement turn taking
- redo how pieces report their positioning. are pixels efficient?

possible board hierarchy:

1. Game manages an abstract grid object and an abstract collection of piece data. Each piece knows its own position. Game passes cell contents to grid, then the grid handles rendering.  

piece {
    name: string,
    color: int,
    pieceImage: string,
    selectedPiece: bool,
    xCoordinate: int,
    yCoordinate: int
}

May 20th 2020 - 
decided that ChessBuilder isn't necessary: TestBoard will create a list of cells that are occupied, and the pieces now have a method called rules.vision which allows them to "see" their moves themselves. Governor will probably remain just to hold static methods. 