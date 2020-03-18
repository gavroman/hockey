import React from 'react';

import './svg_field.css';

class Gate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x : this.props.x,
            y : this.props.y,
            angle : this.props.angle || 0,
            action : this.props.action
        }
    }

    render() {
        let highlightingClassName = this.props.highlighted ? "gate-gradient" : "hidden";
        let x = this.props.x - 256.29 + 221 ;
        let y = this.props.y - 337.7 + 160.72 ;
        let angle = this.props.angle;
        return (
            <g onMouseEnter={this.props.action} onMouseLeave={this.props.action}
                transform={"translate(" + x  + " " + y + ") rotate(" + angle + " 35.29 176.68)"}>
                <radialGradient id={"grad3"} cx={"256.29"} cy={"337.7"} r={"29.11"} gradientUnits={"userSpaceOnUse"}>
                    <stop offset={"0.67"} stopColor={"#c1272d"}/>
                    <stop offset={"0.75"} stopColor={"#d56b6f"}/>
                    <stop offset={"0.84"} stopColor={"#e7aaad"}/>
                    <stop offset={"0.91"} stopColor={"#f4d8d9"}/>
                    <stop offset={"0.97"} stopColor={"#fcf4f5"}/>
                    <stop offset={"1"} stopColor={"#fff"}/>
                </radialGradient>
                <path className={highlightingClassName} d={"M256,311.5v52a26,26,0,0,0,0-52Z"} transform={"translate(-221 -161.02)"}/>
                <path className={"gate"} d={"M256,319.5v36a18,18,0,0,0,0-36Z"} transform={"translate(-221 -161.02)"}/>
            </g>
        )
    }
}

export default Gate;