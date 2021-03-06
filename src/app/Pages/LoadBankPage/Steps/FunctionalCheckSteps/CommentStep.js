import React from "react";
import {Checkbox, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import HTPInput from "../../../../Common/Inputs/HTPInput";

export default class CommentStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : true
        }
        this.props.markReadyToSubmit()
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack, stepName) => {
        successCallBack()
    }

    onChange = (value) => {
        let {ready, error} = this.state
        this.props.updateStepperState({comment : value},
            () => {if (value.length > 2000 && ready) {
                      this.setState({ready : false, error : true}, () => this.props.markReadyToSubmit())
                    } else if (error && value.length < 2000) {
                        this.setState({ready : true, error : false}, () => this.props.markReadyToSubmit())
                    }
                    })
    }

    render() {
        return (<div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
            <HTPInput onChange={this.onChange}
                      invalid={this.state.error}
                      label={"Any last comments?"}
                      placeholder={"Your thoughts"}/>
            {this.state.error? <text className={"text-danger"}>{"Comment must be under 2000 characters"}</text> : <div/>}
        </div>)
    }

}

CommentStep.propTypes = {
    stepperState : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    updateStepperState : PropTypes.func.isRequired
}