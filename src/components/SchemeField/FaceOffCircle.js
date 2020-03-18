import React from 'react';

import './svg_field.css';
import FaceOffOuterCircle from "./FaceOffOuterCircle.js";

class FaceOffCircle extends React.Component {
    renderOuterCircle() {
        if (this.props.outerCircle) {
            return (
                <FaceOffOuterCircle
                    x={this.props.x} y={this.props.y}
                    linesDisable={this.props.linesDisable}
                    highlighted={this.props.highlighted}
                />
            )
        }
    }

    renderPlayersPositions() {
        if (this.props.playersPositions) {
            let playersPositionsArray = this.props.playersPositions;
            return (
                <g>
                    {playersPositionsArray.map((elem, index) => {
                        if (elem.highlighted) {
                            return <circle key={index} className={"interactive-player-position"} cx={elem.x} cy={elem.y} r={15}/>
                        }
                        return null;
                    })}
                </g>
            )
        }
    }

    render() {
        let x = this.props.x - 95;
        let y = this.props.y - 106.98;
        let r = this.props.r || 3;
        //let poses = this.props.playersPosition;
        //console.log(poses);
        let highlightingClassName = this.props.highlighted ? "small-circle-gradient" : "hidden";
        return (
            <g>
                {this.renderOuterCircle()}
                {this.renderPlayersPositions()}
                <g transform={"translate(" + x  + " " + y + ")"}>
                    <circle className={highlightingClassName} cx={95} cy={106.98} r={10}/>
                    <circle className={"small-circle"} cx={95} cy={106.98} r={r}/>
                    <radialGradient id={"grad1"} cx={95} cy={106.98} r={10} gradientUnits={"userSpaceOnUse"}>
                        <stop offset={"0.54"} stopColor={"#c1272d"}/>
                        <stop offset={"0.59"} stopColor={"#c5363b"}/>
                        <stop offset={"0.69"} stopColor={"#d05c61"}/>
                        <stop offset={"0.82"} stopColor={"#e29b9e"}/>
                        <stop offset={"0.97"} stopColor={"#fbf0f1"}/>
                        <stop offset={"1"} stopColor={"#fff"}/>
                    </radialGradient>
                </g>
            </g>
        )
    }
}

export default FaceOffCircle;