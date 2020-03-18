import React from 'react';

import './svg_field.css';

class HockeyPlayer extends React.Component {
    render() {
        let scale = (this.props.ident) ? 0.165 : 0.15;
        let x = this.props.x - 137 * scale;
        let y = this.props.y - 149.3 * scale;
        let color = this.props.color;
        let stickAngle = this.props.stickAngle;
        let viewZoneAngle = this.props.viewZoneAngle;
        let text = this.props.text;
        let reference = this.props.reference;
        let fakeCircleClassName = (this.props.ident) ? "fake-circle" : "hidden";
        return (
            <g
                ref={reference}
                transform={"translate(" + x + " " + y + ") scale(" + scale + " " + scale + ")"}>
                <g

                    transform={"rotate(" + viewZoneAngle + " 137 149.3)"}
                >
                    <path
                        onMouseEnter={() => this.props.identMe(true)}
                        className={"player-view-zone-" + color}
                        transform={"translate(-1 -0.7)"}
                        d={"M275,90.9A147.69,147.69,0,0,0,1.63,94.12c-.22.55-.42,1.1-.63,1.66L138.33,150.1Z"}
                    />
                    <circle className={fakeCircleClassName}
                        onMouseLeave={() => this.props.identMe(false)}
                        cx={"137"} cy={"149.3"} r={"147"}
                    />
                </g>
                <rect
                    transform={"rotate(" + stickAngle + " 137 149.3)"}
                    className={"hockey-stick"}
                    x={"129"} y={"13.3"} width={"16"} height={"136"}>
                </rect>
                <g
                    onMouseEnter={() => this.props.identMe(true)}
                    onMouseLeave={() => this.props.identMe(false)}
                    onMouseDown={(e) => this.props.startMove(e, "pl")}
                >
                    <circle
                        className={"player-circle-" + color}
                        cx={"137"} cy={"149.3"} r={"70"}
                    />
                    <text
                        className={"player-number-text"}
                        transform={"translate(99.75 172.85) scale(0.87 1)"}
                    >
                        {text}
                    </text>
                </g>
            </g>
        );
    }
}

export default HockeyPlayer;
