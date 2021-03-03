import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../HTPStepper";
import {User} from "../../../../utils/dtos";
import {IdealCurrents, StepNames} from "./LoadStepSteps/step_enums";
import LoadStep from "./LoadStepSteps/LoadStep";

/*
A stepper within a stepper
 */

export default class LoadStepsStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    // callbacks for outer stepper




    // functions for stepper inside this step

    renderLoadSteps = () => {
        let LoadSteps = Object.keys(StepNames).map(stepNameKey => {
            return (stepperState, updateStepperState, markReadyToSubmit) =>
                <LoadStep idealCurrent={IdealCurrents[stepNameKey]}
                          updateStepperState={updateStepperState}
                          stepperState={stepperState}
                          stepName={StepNames[stepNameKey]}
                          markReadyToSubmit={markReadyToSubmit}/>
        })
        return LoadSteps
    }

    buildStepSubmitFunctions = () => {
        let StepSubmitFunctions = Object.keys(StepNames).map(stepNameKey => {
            return (stepperState, successCallBack, errorMessageCallBack) => {
                    LoadStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack, StepNames[stepNameKey])
                }
        })
        return StepSubmitFunctions
    }


    render() {
        let {user, token} = this.props
        return (<div style={{flex: 1, display: "flex", flexDirection: "row", width : "100%", alignItems: "center", justifyContent: 'space-between', marginBottom : 30}}>
            <HTPStepper user={user}
                        token={token}
                        stepContent={this.renderLoadSteps()}
                        onStepSubmit={this.buildStepSubmitFunctions()}
                        stepNames={Object.values(StepNames)}
                        orientation={'vertical'}/>
        </div>)
    }

}

LoadStepsStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}