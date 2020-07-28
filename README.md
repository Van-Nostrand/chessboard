# Chess!
This is a project that has haunted me since College. I originally tried to do it in Java but screwed it up at the time. After, I was too busy to get around to finishing it. I've thought about it many times over the years so I figured I'd try to finish it for fun.

### Where it's at (July 28 2020)
I've implemented pawn promotion, so now the game mostly works. While implementing I discovered bugs: pawns don't see kings as valid attack targets, and king inCheck methods don't correctly report on tiles which SHOULD be attacked by pawns.

### Todo: for now
* fix the pawn-king attack relationship
* optimize code: it's a disorganized mess
* change how dead pieces are displayed

### Todo: in the future
* implement "click and drag to move" for pieces
* implement an optional "possible moves" overlay for selected pieces
* make it look nice
  * add a timer
  * try my hand at svg... eliminate the need for the piece png files
  * implement changeable color schemes
* change piece references to actual chess notation
* add a system for players and player names, scorekeeping
* try refactoring it as an electron app
* try refactoring it as an android app
