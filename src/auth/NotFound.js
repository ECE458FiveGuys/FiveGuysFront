import React from "react";
import {Gradient} from "react-gradient";
import {gradients} from "../utils/styling";

export default class NotFound extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() { return(
        <Gradient
            className={"fill-window"}
            gradients={ gradients } // required
            property="background"
            duration={ 3000 }
            angle="45deg"
        >
            <text className={"text-info"}>Sorry, this page no longer exists.</text>
        </Gradient>
    )}
}