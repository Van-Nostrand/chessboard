import KingClass from "./KingClass";
import QueenClass from "./QueenClass";
import RookClass from "./RookClass";
import PawnClass from "./PawnClass";
import BishopClass from "./BishopClass";
import KnightClass from "./KnightClass";

export default function classSwitch(request){
  switch(request.name.charAt(1)){
    case "P": return PawnClass.switchboard(request);
      break;
    case "K": return KingClass.switchboard(request);
      break;
    case "Q": return QueenClass.switchboard(request);
      break;
    case "N": return KnightClass.switchboard(request);
      break;
    case "R": return RookClass.switchboard(request);
      break;
    case "B": return BishopClass.switchboard(request);
      break;
    default: console.log("something went wrong");
  }

}