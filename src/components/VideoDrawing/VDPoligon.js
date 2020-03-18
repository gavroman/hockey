import React from 'react';
import {Line} from 'react-konva';

class VDPoligon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            x : this.props.x || 0,
            y : this.props.y || 0,
            points : this.props.points || [],
            fill : this.props.color || '#5ac314',
            stroke : 'black',
            opacity : 0.5,
            strokeWidth : this.props.strokeWidth || 2,
            shadowColor: this.props.shadowColor ||  'green',
            shadowBlur: this.props.shadowBlur ||  10,
            shadowOffset: this.props.shadowOffset ||  { x: 5, y: 5 },
            shadowOpacity: 0,
            poligonRef : React.createRef(),
        }
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    handleMouseOver(e) {
        if (!e.evt.buttons) {
            this.setState({
                strokeWidth : this.state.strokeWidth + 2,
                shadowOpacity: 0.4,
                idented : true,
            });
        } else if (this.props.erasing) {
            this.props.erase(this.state.id);
        }
    }

    handleMouseOut(e) {
        if (this.state.idented) {
            this.setState({
                strokeWidth : this.state.strokeWidth - 2,
                shadowOpacity: 0,
                idented : false,
            });
        }
    }

    destroy() {
        this.state.poligonRef.current.destroy();
    }

    forceUpdate() {
        this.state.poligonRef.current.draw();
    }

    render() {
        return (
            <Line
                onMouseOver = {this.handleMouseOver}
                onMouseOut = {this.handleMouseOut}
                onMouseDown = { (e) => {e.cancelBubble = true;} }
                onDragEnd = { (e) => {this.props.onDragEnd(e, this.state.id)}}
                ref = {this.state.poligonRef}
                x = {this.state.x}
                y = {this.state.y}
                points = {this.state.points}
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

export default VDPoligon;