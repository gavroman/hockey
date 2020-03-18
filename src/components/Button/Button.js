import React from "react";
import './Button.css';

const noneEL = () => {
};

class Button extends React.Component {
    constructor({
                    inner = "",
                    type = "default",
                    eventListener = noneEL,
                    id = "",
                    meta = "",
                } = {}) {
        super();
        this.type = type;
        this.state = {
            inner: inner,
            id: id,
            onBtnClick: eventListener,
        };
    }

    render() {
        let typeRender = "button";
        if (!this.props.className) {
            switch (this.type) {
                case "menu":
                    typeRender += " buttonMenu";
                    break;
                case "player":
                    typeRender += " buttonPlayer";
                    break;
                case "episode":
                    typeRender += " buttonEpisode";
                    break;
                case "default":
                default:
                    typeRender += " buttonDefault";
                    break;

            }
        } else {
            typeRender = this.props.className;
        }

        return (
            <div id={this.state.id} onClick={this.state.onBtnClick} className={typeRender}>
                {this.state.inner}
            </div>
        )
    }
}

export default Button;


