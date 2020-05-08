import React from 'react';
import {Arrow} from 'react-konva';

class VDArrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
            x : this.props.x || 0,
            y : this.props.y || 0,
            points : this.props.points || [],
            pointerLength : this.props.pointerLength || 10,
            pointerWidth : this.props.pointerWidth || 6,
            fill : this.props.color || '#5ac314',
            stroke : this.props.color || '#5ac314',
            strokeWidth : this.props.strokeWidth || 2,
            shadowColor: this.props.shadowColor ||  'green',
            shadowBlur: this.props.shadowBlur ||  10,
            shadowOffset: this.props.shadowOffset ||  { x: 5, y: 5 },
            shadowOpacity: 0,
            arrowRef : React.createRef(),
        };
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    handleMouseOver(e) {
        if (!e.evt.buttons) {
            this.setState({
                pointerLength : this.state.pointerLength + 2,
                pointerWidth : this.state.pointerWidth + 2,
                strokeWidth : this.state.strokeWidth * 2,
                shadowOpacity : 0.4,
                highlighted : true,
            });
        } else if (this.props.erasing) {
            this.props.erase(this.state.id);
        }
    }

    handleMouseOut(e) {
        if (this.state.highlighted) {
            this.setState({
                pointerLength : this.state.pointerLength - 2,
                pointerWidth : this.state.pointerWidth - 2,
                strokeWidth : this.state.strokeWidth / 2,
                shadowOpacity : 0,
                highlighted : false,
            });
        }
    }

    destroy() {
        this.state.arrowRef.current.destroy();
    }

    render() {
        return (
            <Arrow
                onMouseOver = {this.handleMouseOver}
                onMouseOut = {this.handleMouseOut}
                onMouseDown = { (e) => {e.cancelBubble = true;} }
                onDragEnd = { (e) => {this.props.onDragEnd(e, this.state.id)}}
                ref = {this.state.arrowRef}
                x = {this.state.x}
                y = {this.state.y}
                points = {this.state.points}
                pointerLength = {this.state.pointerLength}
                pointerWidth = {this.state.pointerWidth}
                fill = {this.state.fill}
                stroke = {this.state.stroke}
                strokeWidth = {this.state.strokeWidth}
                shadowColor = {this.state.shadowColor}
                shadowBlur = {this.state.shadowBlur}
                shadowOffset = {this.state.shadowOffset}
                shadowOpacity = {this.state.shadowOpacity}
                draggable = {true}
            />
        )
    }
}

export default VDArrow;
