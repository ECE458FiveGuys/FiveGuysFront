import ModelFields from "../../../utils/enums";
import {MDBIcon} from "mdbreact";
import React from "react";

class HTPIcon extends React.Component{

    constructor(props) {
        super(props);
    }
    render() {
        return (<a target="_blank" href={this.props.link}>
            <MDBIcon size={"2x"}
                     icon="file-alt"/>
        </a>)
    }
}