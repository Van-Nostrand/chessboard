//This class exists entirely to house some static functions
//These functions compare piece coordinates to a grid and decide if a move is legal or not
class ChessGovernor{
  
  static checkPath = (selectedPieceName, targetCoordinates, piecesObject) => {
    let clear = false;

    //TODO - I ALREADY HAVE delta x/y from checkMoveLegality
    let dx = targetCoordinates[0] - piecesObject[selectedPieceName].x;
    let dy = targetCoordinates[1] - piecesObject[selectedPieceName].y;
    let xSign = Math.sign(dx);
    let ySign = Math.sign(dy);

    let path = "";

    //an exception for knights
    //it's beginning to look like I'm just going to have to move all of this logic into the pieces...
    if(selectedPieceName.charAt(1) === "N"){
      path = `${dx},${dy}`;
    } else{
      path = `${xSign},${ySign}`;
    }
    if(piecesObject[selectedPieceName].view[path] && piecesObject[selectedPieceName].view[path].includes(`${targetCoordinates[0]},${targetCoordinates[1]}`)){
      clear = true;
    }

    return clear;
  }

  //checks that a selection is correct
  // returns bool, or outputs to console on error
  //target = string, turn = bool
  static checkSelectionLegality = (target, turn) => {
    if(turn){
      return /^w/.test(target);
    } else if(!turn) {
      return /^b/.test(target);
    } else {
      return console.log("something is wrong");
    }
  }
  
  static newCheckMoveLegality = (selectedPieceName, target, piecesObject, occupiedObject) => {
    if(piecesObject[selectedPieceName].newview[target]){
      return true;
    }
    else {
      return false;
    }
  }
    //checks the legality of moving to an empty space
  //returns bool
  //selectedPieceName = string, target = int array, piecesObject = object
  static checkMoveLegality = (selectedPieceName, target, piecesObject, occupiedObject) => {
    // debugger;
    let isLegal = false;
    let moveDelta = [target[0] - piecesObject[selectedPieceName].x, target[1] - piecesObject[selectedPieceName].y];
    
    isLegal = piecesObject[selectedPieceName].movelogic(moveDelta[0],moveDelta[1]);

    //check that the path is clear
    //only the knight is exempt
    // if(!piecesObject[selectedPieceName].jump) {
    if(!selectedPieceName.charAt(1) === "N") {

      isLegal = this.checkPath(
        selectedPieceName, 
        target,
        piecesObject
      );
    }
    return isLegal;
  }

  //checks the legality of attacks
  //returns bool
  static checkAttackLegality = (selectedPieceName, targetPieceName, piecesObject, occupiedObject) => {
    
    let isLegal = false;

    //can't attack your own team
    if(selectedPieceName.charAt(0) === targetPieceName.charAt(0)) return isLegal;

    let attack = [piecesObject[targetPieceName].x - piecesObject[selectedPieceName].x, piecesObject[targetPieceName].y - piecesObject[selectedPieceName].y];

    //if a normal piece is attacking
    if(!piecesObject[selectedPieceName].attacklogic){
      isLegal = piecesObject[selectedPieceName].movelogic(attack[0], attack[1]);
    
      //special case for pawn attacks
    } else if (piecesObject[selectedPieceName].attacklogic){
      return piecesObject[selectedPieceName].attacklogic(attack[0],attack[1]);
    }
    //check the path
    isLegal = this.checkPath(
      selectedPieceName, 
      [piecesObject[targetPieceName].x, piecesObject[targetPieceName].y], 
      piecesObject);

    return isLegal;
  }

  static areKingsInCheck = () => {
    
  }
}

export default ChessGovernor;