//This class exists entirely to house some static functions
//These functions compare piece coordinates to a grid and decide if a move is legal or not
class ChessGovernor{
  
  static checkPath = (selectedPieceName, targetCoordinates, piecesObject) => {
    let clear = false;

    let dx = targetCoordinates[0] - piecesObject[selectedPieceName].xC;
    let dy = targetCoordinates[1] - piecesObject[selectedPieceName].yC;
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
    // debugger;
    if(piecesObject[selectedPieceName].view[path] && piecesObject[selectedPieceName].view[path].includes(`${targetCoordinates[0]},${targetCoordinates[1]}`)){
      clear = true;
    }

    return clear;
  }

  //checks that a selection is correct
  // returns bool, or outputs to console on error
  //target = string, turn = bool
  //returns bool, or string if there's an error
  static checkSelectionLegality = (target, turn) => {
    if(turn){
      return /^w/.test(target);
    } else if(!turn) {
      return /^b/.test(target);
    } else {
      return console.log("something is wrong");
    }
  }
  
  //checks the legality of moving to an empty space
  //returns bool
  //selectedPieceName = string, target = int array, piecesObject = object
  static checkMoveLegality = (selectedPieceName, target, piecesObject, occupiedObject) => {
    
    let isLegal = false;
    let moveDelta = [target[0] - piecesObject[selectedPieceName].xC, target[1] - piecesObject[selectedPieceName].yC];
    
    isLegal = piecesObject[selectedPieceName].movelogic(moveDelta[0],moveDelta[1]);

    //check that the path is clear
    //only the knight is exempt
    if(!piecesObject[selectedPieceName].jump) {
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
    // debugger;

    //can't attack your own team
    if(selectedPieceName.charAt(0) === targetPieceName.charAt(0)) return isLegal;

    let attack = [piecesObject[targetPieceName].xC - piecesObject[selectedPieceName].xC, piecesObject[targetPieceName].yC - piecesObject[selectedPieceName].yC];

    //if a normal piece is attacking
    if(piecesObject[selectedPieceName].attacklogic == null){
      isLegal = piecesObject[selectedPieceName].movelogic(attack[0], attack[1]);
    
      //special case for pawn attacks
    } else if (piecesObject[selectedPieceName].attacklogic){
      return piecesObject[selectedPieceName].attacklogic(attack[0],attack[1]);
    }
    //check the path
    isLegal = this.checkPath(
      selectedPieceName, 
      [piecesObject[targetPieceName].xC, piecesObject[targetPieceName].yC], 
      piecesObject);

    return isLegal;
  }
}

export default ChessGovernor;