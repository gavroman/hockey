import React from 'react';
import {Line} from 'react-konva';

class VDPolygon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            x : this.props.x || 0,
            y : this.props.y || 0,
            fill : this.props.color || '#5ac314',
            stroke : 'black',
            opacity : 0.5,
            strokeWidth : this.props.strokeWidth || 2,
            shadowColor: this.props.shadowColor ||  'green',
            shadowBlur: this.props.shadowBlur ||  10,
            shadowOffset: this.props.shadowOffset ||  { x: 5, y: 5 },
            shadowOpacity: 0,
            polygonRef : React.createRef(),
            points : this.props.points || [],
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    handleMouseOver(e) {
        if (!e.evt.buttons) {
            this.setState({
                strokeWidth : this.state.strokeWidth + 2,
                shadowOpacity: 0.4,
                highlighted : true,
            });
        } else if (this.props.erasing) {
            this.props.erase(this.state.id);
        }
    }

    handleMouseOut(e) {
        if (this.state.highlighted) {
            this.setState({
                strokeWidth : this.state.strokeWidth - 2,
                shadowOpacity: 0,
                highlighted : false,
            });
        }
    }

    destroy() {
        this.state.polygonRef.current.destroy();
    }

    forceUpdate() {
        this.state.polygonRef.current.draw();
    }

    render() {
        const points = [];
        this.state.points.forEach(point => {
              points.push(point.x, point.y);
        });
        return (
            <Line
                onMouseOver = {this.handleMouseOver}
                onMouseOut = {this.handleMouseOut}
                onMouseDown = { (e) => {e.cancelBubble = true;} }
                onDragEnd = { (e) => {this.props.onDragEnd(e, this.state.id)}}
                ref = {this.state.polygonRef}
                x = {this.state.x}
                y = {this.state.y}
                points = {points}
                fill = {this.state.fill}
                opacity = {this.state.opacity}
                stroke = {this.state.stroke}
                strokeWidth = {this.state.strokeWidth}
                shadowColor = {this.state.shadowColor}
                shadowBlur = {this.state.shadowBlur}
                shadowOffset = {this.state.shadowOffset}
                shadowOpacity = {this.state.shadowOpacity}
                draggable = {true}
                closed = {true}
            />
        )
    }
}

export default VDPolygon;
