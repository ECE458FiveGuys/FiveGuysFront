import React from "react";
import {Checkbox, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";

export default class FunctionalCheckStep extends React.Component {

    constructor(props) {
        super(props);
        props.markReadyToSubmit()
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack, stepName) => {
        successCallBack()
    }

    render() {
        return (<div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                {this.props.functionDescription}
            </div>)
    }

}

FunctionalCheckStep.propTypes = {
    functionDescription : PropTypes.func.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired
}