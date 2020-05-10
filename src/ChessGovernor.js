//This class exists entirely to house some static functions
//These functions compare piece coordinates to a grid and decide if a move is legal or not
class ChessGovernor{
  
  //checks that pathing is correct
  //returns bool
  //pieceCoordinates = int array, targetCoordinates = int array, grid = object
  static checkPath = (pieceCoordinates, targetCoordinates, grid) => {
    let clear = true;
    let xSign = 1 * Math.sign(targetCoordinates[0]);
    let ySign = 1 * Math.sign(targetCoordinates[1]);
    for(
      let x = xSign, y = ySign; 
      xSign === 1 ? x < targetCoordinates[0] : x > targetCoordinates[0], 
      ySign === 1 ? y < targetCoordinates[1] : y > targetCoordinates[1]; 
      x = x + (1 * xSign), 
      y = y + (1 * ySign)){
      
        if(grid[`${x + pieceCoordinates[0]},${y + pieceCoordinates[1]}`]) clear = false;
    }   

    return clear;
  }
  
  //checks the legality of moving to an empty space
  //returns bool
  //selectedpc = string, target = int array, pieceLedger = object
  static checkMoveLegality = (selectedpc, target, pieceLedger) => {
    
    let isLegal = false;
    let move = [target[0] - pieceLedger[selectedpc].xC, target[1] - pieceLedger[selectedpc].yC];
    
    isLegal = pieceLedger[selectedpc].rules.movelogic(move[0],move[1]);

    //check that the path is clear
    if(!pieceLedger[selectedpc].rules.jump) {
      isLegal = this.checkPath([pieceLedger[selectedpc].xC,pieceLedger[selectedpc].yC], move, pieceLedger);
    }
    else{

    }
    
    return isLegal;
  }

  //checks the legality of attacks
  //returns bool
  //selectedpc = string, targetpc = string, pieceLedger = object
  //TODO - Knights can't attack
  static checkAttackLegality = (selectedpc, targetpc, pieceLedger) => {
    
    let isLegal = false;
    
    //can't attack your own team
    if(selectedpc.charAt(0) === targetpc.charAt(0)) return isLegal;

    let attack = [pieceLedger[targetpc].xC - pieceLedger[selectedpc].xC, pieceLedger[targetpc].yC - pieceLedger[selectedpc].yC];

    //if a normal piece is attacking
    if(pieceLedger[selectedpc].rules.attacklogic == null){
      isLegal = pieceLedger[selectedpc].rules.movelogic(attack[0], attack[1]);
    
      //special case for pawn attacks
    } else if (pieceLedger[selectedpc].rules.attacklogic){
      return pieceLedger[selectedpc].rules.attacklogic(attack[0],attack[1]);
    }

    //check the path
    isLegal = this.checkPath([pieceLedger[selectedpc].xC, pieceLedger[selectedpc].yC], [pieceLedger[targetpc].xC, pieceLedger[targetpc].yC]);

    return isLegal;
  }

}

export default ChessGovernor;