import React from 'react';
import {Stage, Layer} from 'react-konva';

import Button from "../Button/Button.js";
import VDArrow from "../VideoDrawing/VDArrow.js";
import VDPoligon from "../VideoDrawing/VDPoligon.js";
import VDBrush from "../VideoDrawing/VDBrush.js";

import './VideoDrawing.css';

class VideoDrawing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldWidth: this.props.width || 800,
            fieldHeight: this.props.height || 500,
            items : [],
            isMouseDown : false,
            layer : React.createRef(),
            dragLayer : React.createRef(),
            selectedColor : "#f1196e",
            currentHandler : {
                draw : () => {},
            },
        }
        this.setInstrument = this.setInstrument.bind(this);

        this.drawArrow = this.drawArrow.bind(this);
        this.drawPoligon = this.drawPoligon.bind(this);
        this.eraseHandler = this.eraseHandler.bind(this);

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);

        this.renderItem = this.renderItem.bind(this);
    }

    setInstrument(instrument) {
        instrument = instrument || "brush";
        this.state.currentHandler.drawingElement = instrument;
        switch (instrument) {
            case "arrow" :
                this.setState({ currentHandler : {
                    draw : this.drawArrow,
                    drawingElement : instrument,
                }});
                break;
            case "erase" :
                this.setState({ currentHandler : {
                    draw : () => {},
                    drawingElement : instrument,
                }});
                break;
            case "poligon" :
            case "brush" :
                this.setState({ currentHandler : {
                    draw : this.drawPoligon,
                    drawingElement : instrument,
                }});
                break;
            default:
                break;
        }
    }

    drawArrow(mouseX, mouseY) {
        let newItems = this.state.items;
        newItems[newItems.length - 1].points.splice(2, 2, mouseX, mouseY);
        this.setState({items : newItems});
    }

    drawPoligon(mouseX, mouseY) {
        let newItems = this.state.items;
        newItems[newItems.length - 1].points.push(mouseX, mouseY);
        this.setState({items : newItems});
    }

    eraseHandler(itemIndex) {
        this.state.items[itemIndex].ref.current.destroy();
        this.state.items[itemIndex].destroyed = true;
    }

    handleMouseDown(e) {
        this.state.isMouseDown = true;
        let newItem = {
            type : this.state.currentHandler.drawingElement,
            ref : React.createRef(),
            color : this.state.selectedColor
        }
        switch (newItem.type) {
            case "arrow" :
                newItem.points = [e.evt.layerX, e.evt.layerY, e.evt.layerX + 20, e.evt.layerY];
                break;
            case "poligon" :
            case "brush" :
                newItem.points = [e.evt.layerX, e.evt.layerY];
                break;
            case "erase" :
                return;
            default:
                break;
        }
        this.state.items.push(newItem);
    }

    handleMouseMove(e) {
        if (this.state.isMouseDown) {
            this.state.currentHandler.draw(e.evt.layerX, e.evt.layerY);
            this.state.layer.current.draw();
        }
    }

    handleMouseUp(e) {
        this.setState({isMouseDown : false});
    }

    handleDragEnd(e, itemIndex) {
        this.setState(state => {
            let items = state.items.map((elem, index) => {
                if (index === itemIndex) {
                    elem.x = e.target.attrs.x;
                    elem.y = e.target.attrs.y;
                }
                return elem;
            });
            return {items};
        });
    }

    handleChangeColor(e) {
        this.setState({
            selectedColor : e.target.value
        });
    }

    renderItem(itemIndex) {
        const item = this.state.items[itemIndex];
        if (item.type === "arrow") {
            return <VDArrow
                onDragEnd = {this.handleDragEnd}
                erasing = {this.state.currentHandler.drawingElement === "erase"}
                erase = {this.eraseHandler}
                key = {itemIndex}
                id = {itemIndex}
                ref = {this.state.items[itemIndex].ref}
                x = {item.x}
                y = {item.y}
                points = {item.points}
                color = {item.color}
            />;
        }
        if (item.type === "poligon") {
            return <VDPoligon
                onDragEnd = {this.handleDragEnd}
                erasing = {this.state.currentHandler.drawingElement === "erase"}
                erase = {this.eraseHandler}
                key = {itemIndex}
                id = {itemIndex}
                ref = {this.state.items[itemIndex].ref}
                x = {item.x}
                y = {item.y}
                points = {item.points}
                color = {item.color}
            />;
        }
        if (item.type === "brush") {
            return <VDBrush
                onDragEnd = {this.handleDragEnd}
                erasing = {this.state.currentHandler.drawingElement === "erase"}
                erase = {this.eraseHandler}
                key = {itemIndex}
                id = {itemIndex}
                ref = {this.state.items[itemIndex].ref}
                x = {item.x}
                y = {item.y}
                points = {item.points}
                color = {item.color}
            />;
        }
    }

    render() {
        let selectedInstrument = this.state.currentHandler.drawingElement;
        let eraseButtonClassName = "instrument-button";
        let arrowButtonClassName = "instrument-button";
        let poligonButtonClassName = "instrument-button";
        let brushButtonClassName = "instrument-button";
        switch (selectedInstrument) {
            case "erase" :
                eraseButtonClassName += " selected-instrument";
                break;
            case "arrow" :
                arrowButtonClassName += " selected-instrument";
                break;
            case "poligon" :
                poligonButtonClassName += " selected-instrument";
                break;
            case "brush" :
                brushButtonClassName += " selected-instrument";
                break;
            default:
                break;
        }
        return (
            <div>
                <div className={"control-panel"}>
                    <Button className={eraseButtonClassName} eventListener = {() => this.setInstrument("erase")} inner = {"erase"}/>
                    <Button className={arrowButtonClassName} eventListener = {() => this.setInstrument("arrow")} inner = {"arrow"}/>
                    <Button className={poligonButtonClassName} eventListener = {() => this.setInstrument("poligon")} inner = {"poligon"}/>
                    <Button className={brushButtonClassName} eventListener = {() => this.setInstrument("brush")} inner = {"brush"}/>
                    <input className="color-picker" type={"color"} value={this.state.selectedColor} onChange={this.handleChangeColor}/>
                </div>
                <Stage
                    width = {this.state.fieldWidth}
                    height = {this.state.fieldHeight}
                    onDragStart = {this.handleStageDragStart}
                    onMouseMove = {this.handleMouseMove}
                    onMouseDown = {this.handleMouseDown}
                    onMouseUp = {this.handleMouseUp}
                >
                    <Layer ref = {this.state.layer}>
                        {this.state.items.map((elem, index) => {
                            return this.renderItem(index);
                        })}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default VideoDrawing;