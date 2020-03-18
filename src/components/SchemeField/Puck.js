import React from 'react';

class Puck extends React.Component {
    render() {
        let r = this.props.r;
        if (this.props.ident) {
            r += 5;
        }
        return (
            <g
                onMouseEnter={() => this.props.identMe(true)}
                onMouseLeave={() => this.props.identMe(false)}
            >
                <circle onMouseDown={(e) => this.props.startMove(e, "pu")}
                    cx={this.props.x} cy={this.props.y} r={r}
                />
            </g>
        )
    }
}

export default Puck;