import React from 'react';

import './svg_field.css';

class PlayersRadialGradients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playersGradients: [
                {
                    color: 'blue',
                    circleGradient: [
                        {point: 0, color: '#98c2e0'},
                        {point: 0.14, color: '#92b7df'},
                        {point: 0.38, color: '#819bdb'},
                        {point: 0.68, color: '#666dd6'},
                        {point: 0.94, color: '#4d43d1'},
                        {point: 0.95, color: '#453bbf'},
                        {point: 0.98, color: '#302892'},
                        {point: 1, color: '#1b1464'}
                    ],
                    viewZoneGradient: [
                        {point: 0.58, color: '#8594f2'},
                        {point: 0.65, color: '#8998f2'},
                        {point: 0.73, color: '#96a3f4'},
                        {point: 0.81, color: '#aab5f6'},
                        {point: 0.89, color: '#c7cef9'},
                        {point: 0.97, color: '#edeffd'},
                        {point: 1, color: '#fff'}
                    ]
                },
                {
                    color: 'red',
                    circleGradient: [
                        {point: 0, color: '#fcee21'},
                        {point: 0.08, color: '#f9e322'},
                        {point: 0.21, color: '#f0c723'},
                        {point: 0.39, color: '#e39926'},
                        {point: 0.6, color: '#d05a2a'},
                        {point: 0.75, color: '#c1272d'},
                        {point: 0.86, color: '#bf272c'},
                        {point: 0.9, color: '#b8272b'},
                        {point: 0.92, color: '#ad2628'},
                        {point: 0.95, color: '#9c2523'},
                        {point: 0.97, color: '#86241d'},
                        {point: 0.98, color: '#6a2316'},
                        {point: 1, color: '#4b210d'},
                        {point: 1, color: '#42210b'}
                    ],
                    viewZoneGradient: [
                        {point: 0.58, color: '#ffa78f'},
                        {point: 0.66, color: '#ffaa93'},
                        {point: 0.74, color: '#ffb4a0'},
                        {point: 0.82, color: '#ffc4b4'},
                        {point: 0.9, color: '#ffdbd1'},
                        {point: 0.98, color: '#fff8f7'},
                        {point: 1, color: '#fff'}
                    ]
                },
                {
                    color: 'yellow',
                    circleGradient: [
                        {point: 0, color: '#fcee21'},
                        {point: 0.18, color: '#fbe321'},
                        {point: 0.48, color: '#fac720'},
                        {point: 0.87, color: '#f7991e'},
                        {point: 0.92, color: '#f7931e'},
                        {point: 0.94, color: '#e6811d'},
                        {point: 0.98, color: '#bb541a'},
                        {point: 1, color: '#a83f19'}
                    ],
                    viewZoneGradient: [
                        {point: 0.58, color: '#f7c77e'},
                        {point: 0.7, color: '#f7c881'},
                        {point: 0.77, color: '#f8cc89'},
                        {point: 0.83, color: '#f9d297'},
                        {point: 0.88, color: '#fadbac'},
                        {point: 0.93, color: '#fbe6c6'},
                        {point: 0.97, color: '#fdf4e6'},
                        {point: 1, color: '#fff'}
                    ]
                }
            ],
            interactivePosition: {
                circleGradient: [
                    {point: 0, color: '#98c2e0'},
                    {point: 0.14, color: '#92b7df'},
                    {point: 0.38, color: '#819bdb'},
                    {point: 0.68, color: '#666dd6'},
                    {point: 0.94, color: '#4d43d1'},
                    {point: 0.95, color: '#453bbf'},
                    {point: 0.98, color: '#302892'},
                    {point: 1, color: '#1b1464'}
                ],
            }
        }
    }

    render() {
        return (
            <g id={'playersGradients'}>
                {this.state.playersGradients.map((gradient, gradientIndex) => {
                    return <g key={gradientIndex}>
                        <radialGradient
                            id={'player-circle-gradient-' + gradient.color}
                            cx={'137'} cy={'149.3'} r={'70'}
                            gradientUnits={'userSpaceOnUse'}>
                            {gradient.circleGradient.map((elem, index) => {
                                return <stop key={gradientIndex + index} offset={elem.point} stopColor={elem.color}/>
                            })}
                        </radialGradient>
                        <radialGradient
                            id={'view-zone-' + gradient.color}
                            cx={'138'} cy={'140.39'} r={'142.58'}
                            gradientTransform={'translate(-7.62 278.39) rotate(-90) scale(1 1.04)'}
                            gradientUnits={'userSpaceOnUse'}>
                            {gradient.viewZoneGradient.map((elem, index) => {
                                return <stop
                                    key={gradientIndex + index}
                                    offset={elem.point}
                                    stopColor={elem.color}/>
                            })}
                        </radialGradient>
                    </g>
                })}
                <radialGradient
                    id={'interactive-player-position-gradient'}
                    cx={'138'} cy={'140.39'} r={'142.58'}
                    gradientUnits={'userSpaceOnUse'}>
                    {this.state.interactivePosition.circleGradient.map((elem, index) => {
                        return <stop
                            key={index}
                            offset={elem.point}
                            stopColor={elem.color}/>
                    })}
                </radialGradient>
            </g>
        )
    }
}

export default PlayersRadialGradients;
