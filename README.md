# Chess!
This is a project that has haunted me since College. I originally tried to do it in Java but never finished it. I figured I'd try to finish it in react  

### November 28 2021  
altering how context is used  
* moved some functions to context/actions.js which is now imported with state  
* simplified graveyards - now just one graveyard prop in state which gets split into two separate graveyards at render  

## Todo
* pawn promotion menu is not working right now, needs svg and logic update   
* move functions from ChessGame into separate files - it's too monolithic  
* test if rendering svg's is more performant than that one png, or if it even matters  

### Where it's at (August 31 2020)  
the game functions! Huzzah!  

### Future Todos
* implement "click and drag to move" for pieces  
* implement an optional "possible moves" overlay for selected pieces  
* add a timer  
* experiment with changing piece references to actual chess notation (not something I'm well versed in...)  
* add a system for players and player names, scorekeeping  
* reviewable game history  
* try refactoring it as an electron app  
* try refactoring it as an android app  
* changeable color schemes  
