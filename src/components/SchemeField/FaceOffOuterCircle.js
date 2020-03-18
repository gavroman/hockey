import React from 'react';

import './svg_field.css';

class FaceOffOuterCircle extends React.Component {
    constructor(props) {
        super(props);
        this.renderLines = this.renderLines.bind(this);
    }

    renderLines() {
        if (this.props.linesDisable) {
            return <g/>
        }
        return (
            <g>
                <line className={"face-off-line"} x1={"86.5"} y1={"56.98"} x2={"86.5"} y2={"62.98"}/>
                <line className={"face-off-line"} x1={"103.5"} y1={"56.98"} x2={"103.5"} y2={"62.98"}/>
                <line className={"face-off-line"} x1={"103.5"} y1={"150.98"} x2={"103.5"} y2={"156.98"}/>
                <line className={"face-off-line"} x1={"86.5"} y1={"150.98"} x2={"86.5"} y2={"156.98"}/>
                <polyline className={"face-off-line"} points={"89 95.23 89 104.23 77 104.23"}/>
                <polyline className={"face-off-line"} points={"89 118.23 89 109.23 77 109.23"}/>
                <polyline className={"face-off-line"} points={"101 118.23 101 109.23 113 109.23"}/>
                <polyline className={"face-off-line"} points={"101 95.23 101 104.23 113 104.23"}/>
            </g>
        )
    }

    render() {
        let x = this.props.x - 95;
        let y = this.props.y - 106.98;
        let highlightingClassName = this.props.highlighted ? "outer-circle-gradient" : "hidden";
        return (
            <g  onMouseEnter={this.props.action} onMouseLeave={this.props.action}
                transform={"translate(" + x  + " " + y + ")"}>
                <circle className={highlightingClassName} cx={"95"} cy={"106.98"} r={"52"}/>
                <radialGradient id={"grad2"} cx={"95"} cy={"106.98"} r={"58.5"} gradientUnits={"userSpaceOnUse"}>
                    <stop offset={"0"} stopColor={"#c1272d"}/>
                    <stop offset={"0.1"} stopColor={"#c32d33"}/>
                    <stop offset={"0.24"} stopColor={"#c83f44"}/>
                    <stop offset={"0.4"} stopColor={"#d05c60"}/>
                    <stop offset={"0.58"} stopColor={"#dc8487"}/>
                    <stop offset={"0.77"} stopColor={"#eab7b9"}/>
                    <stop offset={"0.97"} stopColor={"#fcf6f6"}/>
                    <stop offset={"1"} stopColor={"#fff"}/>
                </radialGradient>
                <circle className={"outer-circle"} cx={"95"} cy={"106.98"} r={"45"}/>
                {this.renderLines()}
                {/*<FaceOffSmallCircle x={x + 95} y={y + 106.98} r={3} highlighted={this.props.highlighted} inBigCircle/>*/}
            </g>
        )
    }
}

export default FaceOffOuterCircle;
