import React, {Component} from 'react';
import './Piece.css';

class Piece extends Component{

  render(){
    let x = 62 * this.props.xC + 12;
    let y = 62 * this.props.yC + 12;

    let style = {
      width: this.props.clicked? "56px" : "62px",
      height: this.props.clicked? "56px" : "62px",
      background: this.props.source,
      backgroundSize: "370px",
      backgroundPosition: this.props.pngPos,
      backgroundOrigin: "border-box",
      position: "absolute",
      border: this.props.clicked ? "3px solid red" : "0px",
      left: x + "px",
      top: y + "px"
    }
    return(
      <div
        className="piece"
        style={style}
        name={this.props.name}
        onClick={this.props.onClick}></div>
    );
  }

};

export default Piece;
