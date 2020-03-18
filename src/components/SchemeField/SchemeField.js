import React from 'react';

import './SchemeField.css';
import './svg_field.css';

import FaceOffCircle from "./FaceOffCircle.js";
import Gate from "./Gate.js";
import HockeyPlayer from "./HockeyPlayer.js";
import PlayersRadialGradients from "./PlayersRadialGradients.js";
import Puck from "./Puck.js";

class SchemeField extends React.Component {
    constructor(props) {
        super(props);
        let staticDir = 'public/static/';
        this.state = {
            logoSRC : staticDir + "logo.svg",
            width : props.width || 612,
            type : props.type || "full",
            svgTransform : "rotate(0 0 0) translate(0 0)",
            //svgViewBox : "0 0 " + (props.width || 612) + " " + (props.width || 612) / 1.7,
            svgViewBox : "0 0 612 360",

            faceOffCircles : [
                {x : 305, y : 176.98, r : 4.5,  outerCircle : true, linesDisable : true},
                {x : 95,  y : 106.98,  outerCircle : true},
                {x : 95,  y : 246.98,  outerCircle : true},
                {x : 515, y : 106.98,  outerCircle : true},
                {x : 515, y : 246.98,  outerCircle : true},
                {x : 380, y : 106.98,},
                {x : 230, y : 106.98,},
                {x : 380, y : 246.98,},
                {x : 230, y : 246.98,},
            ],
            gates: [
                {x : 35.3  , y : 176.98, angle : 0, hasGoalKeeper : false},
                {x : 574.7 , y : 176.98, angle : 180, hasGoalKeeper : false}
            ],
            players: [
                {ref : React.createRef(), x : 150, y : 176, text : "01", stickAngle : 123, viewZoneAngle :  19, color : "blue"},
                {ref : React.createRef(), x : 100, y :  60, text : "02", stickAngle :  90, viewZoneAngle : 180, color : "blue"},
                {ref : React.createRef(), x : 100, y : 120, text : "03", stickAngle : 180, viewZoneAngle :  90, color : "blue"},
                {ref : React.createRef(), x : 100, y : 180, text : "04", stickAngle : 270, viewZoneAngle :   0, color : "blue"},
                {ref : React.createRef(), x : 100, y : 240, text : "05", stickAngle : -54, viewZoneAngle : 134, color : "blue"},
                {ref : React.createRef(), x : 100, y : 300, text : "17", stickAngle : -54, viewZoneAngle : 134, color : "blue"},

                {ref : React.createRef(), x : 450, y : 176, text : "10", stickAngle : -54, viewZoneAngle : 134, color : "red"},
                {ref : React.createRef(), x : 500, y :  60, text : "20", stickAngle :  90, viewZoneAngle : 180, color : "red"},
                {ref : React.createRef(), x : 500, y : 120, text : "30", stickAngle : 180, viewZoneAngle :  90, color : "red"},
                {ref : React.createRef(), x : 500, y : 180, text : "40", stickAngle : 270, viewZoneAngle :   0, color : "red"},
                {ref : React.createRef(), x : 500, y : 240, text : "50", stickAngle : -54, viewZoneAngle : 134, color : "red"},
                {ref : React.createRef(), x : 500, y : 300, text : "60", stickAngle : -54, viewZoneAngle : 134, color : "red"},
            ],
            puck : {x : 308, y : 220, r : 7},

            gatesRadialHighlightOffset : 900, // real offset = sqrt(gatesRadialHighlightOffset)
            gatesLinearHighlightOffset : 12,
            playersPositionsHighlightOffset : 400, // real offset = sqrt(playersPositionsHighlightOffset)
            faceOffCirclesHighlightOffset : 196, // real offset = sqrt(faceOffCirclesHighlightOffset)


            prevMousePosition : { x : 0, y : 0},
            mouseDelta : { dx : 0, dy : 0},
            scaleCoeff : (props.width / 612) || 1,

            currentHandler : {
                movingElement: "none",
                index : null,
                moving : false,
                move : null
            },
        }

        for (var i = 0; i < this.state.faceOffCircles.length; i++) {
            let interactivePlayersPositions = this.getInteractivePlayersPositions(this.state.faceOffCircles[i]);
            this.state.faceOffCircles[i].interactivePlayersPositions = interactivePlayersPositions;
        }

        this.changeSchemeType = this.changeSchemeType.bind(this);

        this.click = this.click.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.identPlayer = this.identPlayer.bind(this);

        this.startMoveComponent = this.startMoveComponent.bind(this);
        this.endMoveComponent = this.endMoveComponent.bind(this);

        this.getNearestElement = this.getNearestElement.bind(this);

        this.movePlayer = this.movePlayer.bind(this);
        this.handlePlayerGateApproach = this.handlePlayerGateApproach.bind(this);
        this.handlePlayerCircleApproach = this.handlePlayerCircleApproach.bind(this);
        this.getInteractivePlayersPositions = this.getInteractivePlayersPositions.bind(this);

        this.movePuck = this.movePuck.bind(this);

        this.rotatePlayerElement = this.rotatePlayerElement.bind(this);
    }

    componentDidMount() {
        for (let i = 0; i !== this.state.players.length; i++) {
            let node = this.state.players[i].ref.current;

            let childsNodes = {
                player : node.getElementsByTagName('g')[0],
                viewZone : node.getElementsByTagName('g')[1]
            }
            childsNodes.player.addEventListener('wheel', (e) => {this.handleScroll(e, i)}, { passive: false });
            childsNodes.viewZone.addEventListener('wheel', (e) => {this.handleScroll(e, i)}, { passive: false });
        }
    }

    changeSchemeType() {
        // if (this.state.type == "full") {
        //     this.state.svgTransform = "rotate(90 0 0) translate(0 -334)";
        //     this.state.svgViewBox = "0 0 612 305.5",
        //     this.setState({type: "half"});
        // } else {
        //     this.state.svgTransform = "rotate(0 0 0) translate(0 0)";
        //     this.state.svgViewBox = "0 0 612 334",
        //     this.setState({type: "full"});
        // }
    }

    click(e) {
        // let rect = this.refs.self.getBoundingClientRect();;
        // let coords = {
        //     x : e.pageX - this.state.prevMousePosition.x,
        //     y : e.pageY - this.state.prevMousePosition.y,
        // };
        // this.setState({
        //     prevMousePosition : {
        //         x : e.pageX,
        //         y : e.pageY,
        //     }
        // });
        // console.log(coords);
    }

    handleMouseMove(e) {
        if (this.state.currentHandler.moving) {
            this.setState({
                mouseDelta : {
                    dx : (e.pageX - this.state.prevMousePosition.x) / this.state.scaleCoeff,
                    dy : (e.pageY - this.state.prevMousePosition.y) / this.state.scaleCoeff
                },
                prevMousePosition : {
                    x : e.pageX,
                    y : e.pageY,
                },
            });
            this.state.currentHandler.move();
        }
    }

    handleScroll(e, index) {
        e.preventDefault();  // block page scroll
        this.state.currentHandler.index = index;
        let target = e.target.className.baseVal;
        let rotatingElement = (target === "fake-circle" || target.startsWith("player-view-zone")) ? "viewZone" : "stick";
        this.rotatePlayerElement(e.deltaY, index, rotatingElement);
    }

    identPlayer(ident, playerIndex) {
        if (!this.state.currentHandler.moving) {
            this.state.players[playerIndex].ident = ident;
            if (ident) {
                let tmp = this.state.players[playerIndex];
                this.state.players[playerIndex] = this.state.players[this.state.players.length - 1];
                this.state.players[this.state.players.length - 1] = tmp;
            }
            this.setState({fake : 0});
        }
    }

    identPuck(ident) {
        if (!this.state.currentHandler.moving) {
            this.state.puck.ident = ident;
        }
        this.setState({fake : 0});
    }

    startMoveComponent(e, movingPlayerIndex, component) {
        this.state.prevMousePosition = {
            x : e.pageX,
            y : e.pageY,
        }
        this.state.currentHandler.moving = true;
        this.state.currentHandler.movingElement = component;
        switch (component) {
            case "pu": {  // puck
                if (this.state.puck.prevFaceOffCircleIndex !== undefined) {
                    let circle = this.state.faceOffCircles[this.state.puck.prevFaceOffCircleIndex];
                    circle.hasPuck = false;
                    for (let i = 0; i !== circle.interactivePlayersPositions.length; i++) {
                        circle.interactivePlayersPositions.hasPlayer = false;
                    }
                }
                this.state.currentHandler.move = this.movePuck;
                this.state.puck.ident = false;
                break;
            }
            case "pl": {  // player
                if (this.state.players[movingPlayerIndex].prevGateIndex !== undefined) {
                    this.state.gates[this.state.players[movingPlayerIndex].prevGateIndex].hasGoalKeeper = false;
                }
                if (this.state.players[movingPlayerIndex].prevInteractivePositionIndex !== undefined) {
                    let circleWithPuck = this.state.faceOffCircles[this.state.puck.prevFaceOffCircleIndex];
                    if (circleWithPuck) {
                        let nearestPositionIndex = this.state.players[movingPlayerIndex].prevInteractivePositionIndex;
                        circleWithPuck.interactivePlayersPositions[nearestPositionIndex].hasPlayer = false;
                    }
                }
                this.state.currentHandler.move = this.movePlayer;
                this.state.players[movingPlayerIndex].ident = false;
                this.state.currentHandler.index = movingPlayerIndex;
                break;
            }
            default:
                break;
        }
    }

    endMoveComponent() {
        switch (this.state.currentHandler.movingElement) {
            case "pu": {
                let i = this.state.puck.faceOffCircleIndex;
                let prevI = this.state.puck.prevFaceOffCircleIndex;
                if (i !== undefined && i !== prevI) {
                    let nearestCircle = this.state.faceOffCircles[i];
                    this.state.puck.x = nearestCircle.x;
                    this.state.puck.y = nearestCircle.y;
                    this.state.puck.inCircle = true
                    this.state.puck.prevFaceOffCircleIndex = i;
                    this.state.puck.faceOffCircleIndex = undefined;
                    this.state.faceOffCircles[i].highlighted = false;
                    nearestCircle.hasPuck = true;
                } else {
                    this.state.puck.inCircle = false;
                }
                break;
            }
            case "pl": {
                let player = this.state.players[this.state.currentHandler.index];
                let gateIndex = player.gateIndex;
                let prevGateIndex = player.prevGateIndex;
                if (gateIndex !== undefined && gateIndex !== prevGateIndex) {
                    let nearestGate = this.state.gates[gateIndex];
                    player.x = nearestGate.x;
                    player.y = nearestGate.y;
                    if (nearestGate.angle === 0) {
                        player.x += 10;
                        player.stickAngle = 90;
                        player.viewZoneAngle = 90;
                    } else {
                        player.x -= 10;
                        player.stickAngle = -90;
                        player.viewZoneAngle = -90;
                    }
                    player.inGate = true;
                    player.prevGateIndex = gateIndex;
                    player.gateIndex = undefined;
                    nearestGate.highlighted = false;
                    nearestGate.hasGoalKeeper = true;
                } else {
                    player.inGate = false;
                }

                let iPosIndex = player.interactivePositionIndex;
                let prevIPosIndex = player.prevInteractivePositionIndex;
                let circleWithPuck = this.state.faceOffCircles[this.state.puck.prevFaceOffCircleIndex];
                if (circleWithPuck !== undefined && iPosIndex !== undefined && iPosIndex !== prevIPosIndex) {
                    let nearestInteractivePosition = circleWithPuck.interactivePlayersPositions[iPosIndex];
                    player.x = nearestInteractivePosition.x;
                    player.y = nearestInteractivePosition.y;
                    switch (nearestInteractivePosition.type) {
                        case "lt":
                        case "rt": {
                            player.stickAngle = 180;
                            player.viewZoneAngle = 180;
                            break;
                        }
                        case "ld":
                        case "rd": {
                            player.stickAngle = 0;
                            player.viewZoneAngle = 0;
                            break;
                        }
                        case "lc": {
                            player.stickAngle = 90;
                            player.viewZoneAngle = 90;
                            break;
                        }
                        case "rc": {
                            player.stickAngle = -90;
                            player.viewZoneAngle = -90;
                            break;
                        }
                        default:
                            break;
                    }
                    player.prevInteractivePositionIndex = iPosIndex;
                    player.interactivePositionIndex = undefined;
                    player.inFaceOff = true;
                    nearestInteractivePosition.highlighted = false;
                    nearestInteractivePosition.hasPlayer = true;
                    circleWithPuck.highlighted = false;
                } else {
                    player.inFaceOff = false;
                }
                break;
            }
            default:
                break;
        }
        this.setState({
            currentHandler : {
                movingElement: null,
                moving: false,
                move: null,
                index: null
            }
        })
    }

    calculateDistanceSquare(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    getNearestElement(movingPoint, arrayOfStaticPoints) {
        let distances = [];
        for (let i = 0; i !== arrayOfStaticPoints.length; i++) {
            let currentStaticPoint = arrayOfStaticPoints[i];
            currentStaticPoint.highlighted = false;
            let p1 = {
                x : movingPoint.x,
                y : movingPoint.y
            };
            let p2 = {
                x : currentStaticPoint.x,
                y : currentStaticPoint.y
            };
            distances.push(this.calculateDistanceSquare(p1, p2));
        }
        let minDistanceSquare = Math.min(...distances);

        return {
            distanceSquare : minDistanceSquare,
            index : distances.indexOf(minDistanceSquare),
        }
    }

    getInteractivePlayersPositions(circle) {
        let returnValue = [
            {type : "lt", x : circle.x - 13, y : circle.y - 52},
            {type : "rt", x : circle.x + 13, y : circle.y - 52},
            {type : "lc", x : circle.x - 23, y : circle.y},
            {type : "rc", x : circle.x + 23, y : circle.y},
            {type : "ld", x : circle.x - 13, y : circle.y + 52},
            {type : "rd", x : circle.x + 13, y : circle.y + 52}
        ]
        return returnValue;
    }

    handlePlayerGateApproach(player) {
        let nearestGateData = this.getNearestElement(player, this.state.gates);
        let nearestGate = this.state.gates[nearestGateData.index];
        if (nearestGate.hasGoalKeeper) {
            return;
        }
        let playerInLeftGateFront = nearestGate.x - this.state.gatesLinearHighlightOffset < player.x;
        let playerInRightGateFront = nearestGate.x + this.state.gatesLinearHighlightOffset > player.x;
        let chooseLeftGate = (nearestGate.angle === 0) && playerInLeftGateFront;
        let chooseRightGate = (nearestGate.angle === 180) && playerInRightGateFront;
        if ((chooseLeftGate || chooseRightGate) && nearestGateData.distanceSquare < this.state.gatesRadialHighlightOffset) {
            player.gateIndex = nearestGateData.index;
        } else {
            player.prevGateIndex = player.gateIndex;
            player.gateIndex = undefined;
        }
        if (player.prevGateIndex !== player.gateIndex) {
            nearestGate.highlighted = true;
        }
    }

    handlePlayerCircleApproach(player) {
        if(!this.state.puck.inCircle) {
            return;
        }
        let circleWithPuck = this.state.faceOffCircles[this.state.puck.prevFaceOffCircleIndex];
        let nearestPosition = this.getNearestElement(player, circleWithPuck.interactivePlayersPositions);
        if (circleWithPuck.interactivePlayersPositions[nearestPosition.index].hasPlayer) {
            return;
        }

        if (nearestPosition.distanceSquare < this.state.playersPositionsHighlightOffset) {
            player.interactivePositionIndex = nearestPosition.index;
        }
        else {
            player.prevInteractivePositionIndex = player.interactivePositionIndex;
            player.interactivePositionIndex = undefined;
        }
        if (player.prevInteractivePositionIndex !== player.interactivePositionIndex) {
            circleWithPuck.interactivePlayersPositions[nearestPosition.index].highlighted = true;
            circleWithPuck.highlighted = true;
        } else {
            circleWithPuck.highlighted = false;
        }
    }

    movePlayer() {
        let player = this.state.players[this.state.currentHandler.index];
        player.x += this.state.mouseDelta.dx;
        player.y += this.state.mouseDelta.dy;

        this.handlePlayerGateApproach(player);
        this.handlePlayerCircleApproach(player);
    }

    handlePuckCircleApproach() {
        let nearestCircleData = this.getNearestElement(this.state.puck, this.state.faceOffCircles);
        if (nearestCircleData.distanceSquare < this.state.faceOffCirclesHighlightOffset) {
            this.state.puck.faceOffCircleIndex = nearestCircleData.index;
        } else {
            this.state.puck.prevFaceOffCircleIndex = this.state.puck.faceOffCircleIndex;
            this.state.puck.faceOffCircleIndex = undefined;
        }
        if (this.state.puck.prevFaceOffCircleIndex !== this.state.puck.faceOffCircleIndex) {
            this.state.faceOffCircles[nearestCircleData.index].highlighted = true;
        }
    }

    movePuck() {
        this.state.puck.x += this.state.mouseDelta.dx;
        this.state.puck.y += this.state.mouseDelta.dy;

        this.handlePuckCircleApproach();
    }

    rotatePlayerElement(scrollValue, playerIndex, element) {
        this.setState(state => {
            let players = state.players.map((elem, index) => {
                if (index === playerIndex) {
                    if (element === "stick") {
                        elem.stickAngle += scrollValue / 5;
                    } else {
                        elem.viewZoneAngle += scrollValue / 5;
                    }
                }
                return elem;
            });
            return {players};
        });
    }

    render() {
        return ( <div>
                {/* <Button
                    inner = {"Change scheme type"}
                    eventListener = {this.changeSchemeType}
                />*/}
                <svg ref="self"
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.endMoveComponent}
                    xmlns={"http://www.w3.org/2000/svg"}
                    viewBox={this.state.svgViewBox}
                    style={{
                        width: this.state.width + "px",
                        height: this.state.height + "px"
                    }}>
                    <PlayersRadialGradients />
                    <g transform={this.state.svgTransform}>
                        {this.state.faceOffCircles.map((elem, index) => {
                            return <FaceOffCircle
                                key={index} id={index}
                                x={elem.x} y={elem.y} r={elem.r}
                                outerCircle={elem.outerCircle}
                                linesDisable={elem.linesDisable}
                                hasPlayer={elem.hasPlayer}
                                playersPositions={elem.interactivePlayersPositions}
                                highlighted={elem.highlighted}
                            />
                        })}
                        <line className={"gate-line"} x1={"35"} y1={"28.98"} x2={"35"} y2={"323.98"} />
                        <line className={"gate-line"} x1={"575"} y1={"28.98"} x2={"575"} y2={"325.98"} />
                        <line className={"center-line"} x1={"305.25"} y1={"26.48"} x2={"304.75"} y2={"326.98"} />
                        <line className={"blue-line"} x1={"395"} y1={"26.98"} x2={"395"} y2={"326.98"} />
                        <line className={"blue-line"} x1={"215"} y1={"26.98"} x2={"215"} y2={"326.98"} />
                        <path className={"outer-circle"} d="M556,487.5c0-.33,0-.66,0-1a30,30,0,0,0-60,0c0,.34,0,.67,0,1Z" transform="translate(-221 -161.02)"/>
                        <rect className={"field-box"} x={"1"} y={"26.98"} width={"610"} height={"300"} rx={"48"} />
                        {this.state.gates.map((elem, index) => {
                            return <Gate
                                key={index} id={index}
                                x={elem.x} y={elem.y} angle={elem.angle}
                                highlighted={elem.highlighted}
                            />
                        })}
                        {this.state.players.map((elem, index) => {
                            return <HockeyPlayer key={index}
                                reference={elem.ref}
                                x={elem.x} y={elem.y} text={elem.text} ident={elem.ident} color={elem.color}
                                stickAngle = {elem.stickAngle}
                                viewZoneAngle={elem.viewZoneAngle}
                                startMove = {(e, player) => this.startMoveComponent(e, index, player)}
                                identMe={(ident) => this.identPlayer(ident, index)}
                            />
                        })}
                        <Puck x={this.state.puck.x} y={this.state.puck.y} r={this.state.puck.r}
                            startMove = {(e, puck) => this.startMoveComponent(e, null, puck)}
                            identMe={(ident) => this.identPuck(ident)}
                            ident={this.state.puck.ident}
                        />
                    </g>
                </svg>
            </div>
        )
    }
}

export default SchemeField;
