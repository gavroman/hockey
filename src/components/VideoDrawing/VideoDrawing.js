import React from 'react';
import {Layer, Stage} from 'react-konva';

import Button from '../Button/Button.js';
import VDArrow from '../VideoDrawing/VDArrow.js';
import VDBrush from '../VideoDrawing/VDBrush.js';
import VDPolygon from './VDPolygon.js';

import './VideoDrawing.css';

class VideoDrawing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isMouseDown: false,
            layer: React.createRef(),
            dragLayer: React.createRef(),
            selectedColor: '#f1196e',
            currentHandler: {
                draw: () => {
                },
            },
        };
        this.setInstrument = this.setInstrument.bind(this);

        this.drawArrow = this.drawArrow.bind(this);
        this.drawPolygon = this.drawPolygon.bind(this);
        this.eraseHandler = this.eraseHandler.bind(this);

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);

        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const rect = document.querySelector('.stage').getBoundingClientRect();
        // const square1 = {
        //     type: 'polygon',
        //     points: [
        //         {x: 0, y: 0},
        //         {x: 400, y: 0},
        //         {x: 400, y: 200},
        //         {x: 0, y: 200},
        //     ]
        // };
        // this.getPolygonReferencePointsIndex(square1);
        // this.state.items.push(square1);
        // const square2 = {
        //     type: 'polygon',
        //     points: [
        //         {x: 200, y: 300},
        //         {x: 600, y: 300},
        //         {x: 600, y: 500},
        //         {x: 200, y: 500},
        //     ]
        // };
        // this.getPolygonReferencePointsIndex(square2);
        // this.state.items.push(square2);
        this.setState({fieldWidth: rect.width, fieldHeight: rect.height});
    }

    setInstrument(instrument) {
        instrument = instrument || 'brush';
        this.state.currentHandler.drawingElement = instrument;
        switch (instrument) {
            case 'arrow' :
                this.setState({
                    currentHandler: {
                        draw: this.drawArrow,
                        drawingElement: instrument,
                    }
                });
                break;
            case 'erase' :
                this.setState({
                    currentHandler: {
                        draw: () => {
                        },
                        drawingElement: instrument,
                    }
                });
                break;
            case 'polygon' :
            case 'brush' :
                this.setState({
                    currentHandler: {
                        draw: this.drawPolygon,
                        drawingElement: instrument,
                    }
                });
                break;
            default:
                break;
        }
    }

    drawArrow(mouseX, mouseY) {
        let newItems = this.state.items;
        newItems[newItems.length - 1].points.splice(2, 2, mouseX, mouseY);
        this.setState({items: newItems});
    }

    drawPolygon(mouseX, mouseY) {
        let newItems = this.state.items;
        newItems[newItems.length - 1].points.push({x: mouseX, y: mouseY});
        this.setState({items: newItems});
    }

    eraseHandler(itemIndex) {
        this.state.items[itemIndex].ref.current.destroy();
        this.state.items[itemIndex] = null;
        const items = this.state.items;
        let lastItem = items[items.length - 1];
        while (lastItem === null) {
            items.pop();
            lastItem = items[items.length - 1];
        }
        this.setState({items: items});
    }

    handleMouseDown(e) {
        this.state.isMouseDown = true;
        let newItem = {
            type: this.state.currentHandler.drawingElement,
            ref: React.createRef(),
            color: this.state.selectedColor
        };
        switch (newItem.type) {
            case 'arrow' :
                newItem.points = [e.evt.layerX, e.evt.layerY, e.evt.layerX + 20, e.evt.layerY];
                break;
            case 'polygon' :
            case 'brush' :
                newItem.points = [{x: e.evt.layerX, y: e.evt.layerY}];
                break;
            case 'erase' :
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
        const items = this.state.items;
        const lastItem = items[items.length - 1];
        if (lastItem.type === 'polygon') {
            this.getPolygonReferencePointsIndex(lastItem);
            items.push({type: 'arrow', points: lastItem.mainAxisPoints});
        }
        this.setState({isMouseDown: false, items: items});

        if (this.state.items.length > 1) {
            let i;
            for (i = 0; i !== this.state.items.length; i++) {
                if (this.state.items[i].type === 'polygon') {
                    break;
                }
            }
            let j;
            for (j = i + 1; j < this.state.items.length; j++) {
                if (this.state.items[j].type === 'polygon') {
                    break;
                }
            }
            if (this.state.items[i] && this.state.items[j]) {
                const polygonTransformationSteps = 7;
                this.generatePolygonTransformation(this.state.items[i], this.state.items[j], polygonTransformationSteps);
            }
        }
    }

    handleDragEnd(e, itemIndex) {
        this.setState(state => {
            let items = state.items.map((elem, index) => {
                if (index === itemIndex) {
                    elem.x = e.target.attrs.x;
                    elem.y = e.target.attrs.y;
                }
                console.log(elem);
                return elem;
            });
            return {items};
        });
    }

    handleChangeColor(e) {
        this.setState({
            selectedColor: e.target.value
        });
    }

    getPolygonReferencePointsIndex(polygon) {
        const point1 = {x: 0, y: 0};
        for (const polygonPoint of polygon.points) {
            point1.x += polygonPoint.x;
            point1.y += polygonPoint.y;
        }
        point1.x = Math.round(point1.x / polygon.points.length);
        point1.y = Math.round(point1.y / polygon.points.length);
        let referencePointIndex = 0;
        let referencePoint = polygon.points[0];
        // polygon.points.forEach((polygonPoint, index) => {
        //     const getDistance = (p1, p2) => {
        //         return Math.round(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        //     };
        //     if (getDistance(point1, polygonPoint) > getDistance(point1, referencePoint)) {
        //         referencePoint = polygonPoint;
        //         referencePointIndex = index;
        //     }
        // });

        polygon.points.forEach((polygonPoint, index) => {
            const getDistance = (p1) => {
                return Math.round(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
            };
            if (getDistance(polygonPoint) > getDistance(referencePoint)) {
                referencePoint = polygonPoint;
                referencePointIndex = index;
            }
        });


        polygon.referencePointIndex = referencePointIndex;
        polygon.mainAxis = {p1: point1, p2: referencePoint};
        console.log(polygon.mainAxis);
        polygon.mainAxisPoints = [point1.x, point1.y, referencePoint.x, referencePoint.y];
    }

    generatePolygonTransformation(first, last, steps) {
        this.equalizePointsCount(first, last);

        for (let j = 1; j !== steps; j++) {
            const points = new Array(first.points.length);
            const d = j / steps;
            console.log('_________________________');
            for (let i = 0; i !== first.points.length; i++) {
                const index1 = (i + first.referencePointIndex < points.length)
                    ? i + first.referencePointIndex
                    : i + first.referencePointIndex - points.length;
                const index2 = (i + last.referencePointIndex < points.length)
                    ? i + last.referencePointIndex
                    : i + last.referencePointIndex - points.length;


                const point1 = first.points[index1];
                const point2 = last.points[index2];
                console.log('point1', point1, 'point2', point2);
                points[i] = {
                    x: (Math.max(point2.x, point1.x) - Math.min(point2.x, point1.x)) * d + Math.min(point2.x, point1.x),
                    y: (Math.max(point2.y, point1.y) - Math.min(point2.y, point1.y)) * d + Math.min(point2.y, point1.y),
                };
            }
            const newPolygon = {type: 'polygon', points: points};
            const updatedItems = [...this.state.items, newPolygon];
            this.setState({items: updatedItems});
        }
    }

    equalizePointsCount(first, last) {
        // console.log(this.state);
        if (last.type !== 'polygon' || first.type !== 'polygon') {
            // console.log(first);
            // console.log(last);
            return
        }
        let smallest, biggest;
        if (first.points.length < last.points.length) {
            smallest = first;
            biggest = last;
        } else {
            smallest = last;
            biggest = first;
        }
        // console.log(smallest);
        // console.log(biggest);

        let index1 = 0;
        let index2 = 1;
        while (smallest.points.length < biggest.points.length) {
            if (index1 >= smallest.points.length) {
                index1 = 0;
            }
            if (index2 >= smallest.points.length) {
                index2 = 0;
            }
            const point1 = smallest.points[index1];
            const point2 = smallest.points[index2];
            const additionalPoint = {
                x: (point1.x + point2.x) / 2,
                y: (point1.y + point2.y) / 2,
            };
            // console.log('point1', point1);
            // console.log('point2', point2);
            // console.log('additionalPoint', additionalPoint);
            smallest.points.splice(index2, 0, additionalPoint);
            index1 += 2;
            index2 += 2;
        }
    }

    renderItem(itemIndex) {
        const item = this.state.items[itemIndex];
        if (item === null) {
            return;
        }
        if (item.type === 'arrow') {
            return <VDArrow
                onDragEnd={this.handleDragEnd}
                erasing={this.state.currentHandler.drawingElement === 'erase'}
                erase={this.eraseHandler}
                key={itemIndex}
                id={itemIndex}
                ref={this.state.items[itemIndex].ref}
                x={item.x}
                y={item.y}
                points={item.points}
                color={item.color}
            />;
        }
        if (item.type === 'polygon') {
            return <VDPolygon
                onDragEnd={this.handleDragEnd}
                erasing={this.state.currentHandler.drawingElement === 'erase'}
                erase={this.eraseHandler}
                key={itemIndex}
                id={itemIndex}
                ref={this.state.items[itemIndex].ref}
                x={item.x}
                y={item.y}
                points={item.points}
                mainAxis={item.mainAxis}
                color={item.color}
            />;
        }
        if (item.type === 'brush') {
            return <VDBrush
                onDragEnd={this.handleDragEnd}
                erasing={this.state.currentHandler.drawingElement === 'erase'}
                erase={this.eraseHandler}
                key={itemIndex}
                id={itemIndex}
                ref={this.state.items[itemIndex].ref}
                x={item.x}
                y={item.y}
                points={item.points}
                color={item.color}
            />;
        }
    }

    render() {
        let selectedInstrument = this.state.currentHandler.drawingElement;
        let eraseButtonClassName = 'instrument-button';
        let arrowButtonClassName = 'instrument-button';
        let polygonButtonClassName = 'instrument-button';
        let brushButtonClassName = 'instrument-button';
        switch (selectedInstrument) {
            case 'erase' :
                eraseButtonClassName += ' selected-instrument';
                break;
            case 'arrow' :
                arrowButtonClassName += ' selected-instrument';
                break;
            case 'polygon' :
                polygonButtonClassName += ' selected-instrument';
                break;
            case 'brush' :
                brushButtonClassName += ' selected-instrument';
                break;
            default:
                break;
        }
        return (
            <div className={'video-drawing'}>
                <div className={'control-panel'}>
                    <Button className={eraseButtonClassName}
                            eventListener={() => this.setInstrument('erase')}
                            inner={'erase'}/>
                    <Button className={arrowButtonClassName}
                            eventListener={() => this.setInstrument('arrow')}
                            inner={'arrow'}/>
                    <Button className={polygonButtonClassName}
                            eventListener={() => this.setInstrument('polygon')}
                            inner={'polygon'}/>
                    <Button className={brushButtonClassName}
                            eventListener={() => this.setInstrument('brush')}
                            inner={'brush'}/>
                    <input className="color-picker"
                           type={'color'}
                           value={this.state.selectedColor}
                           onChange={this.handleChangeColor}/>
                </div>
                <Stage
                    className={'stage'}
                    width={this.state.fieldWidth}
                    height={this.state.fieldHeight}
                    onMouseMove={this.handleMouseMove}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                >
                    <Layer ref={this.state.layer} className={'layer'}>
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
