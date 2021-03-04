import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../../../Common/HTPStepper";
import {FunctionCheckDescriptions, FunctionCheckStepNames} from "./FunctionalCheckSteps/step_utils";
import FunctionalCheckStep from "./FunctionalCheckSteps/FunctionalCheckStep";

export default class FunctionalChecksStep extends React.Component {

    constructor(props) {
        super(props);
    }

    renderFunctionCheckSteps = () => {
        let LoadSteps = Object.values(FunctionCheckStepNames).map(stepName => {
            return (stepperState, updateStepperState, markReadyToSubmit) =>
                <FunctionalCheckStep functionDescription={FunctionCheckDescriptions[stepName]}
                                     markReadyToSubmit={markReadyToSubmit}
                />
        })
        return LoadSteps
    }

    buildFunctionCheckSubmitFunctions = () => {
        let StepSubmitFunctions = Object.values(FunctionCheckStepNames).map(stepName => {
            return (stepperState, successCallBack, errorMessageCallBack) => {
                FunctionalCheckStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack)
            }
        })
        return StepSubmitFunctions
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack) => {

    }

    render() {
        let {user, token} = this.props
        return (<div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                <h1 className={"h2-responsive"}>{`You're in the final stretch, ${user.username}!`}</h1>
                <h1 className={"h4-responsive"}>{`Let's just check the core functions.`}</h1>
                <HTPStepper user={user}
                            token={token}
                            ref={el => this.internalStepperRef = el}
                            stepContent={this.renderFunctionCheckSteps()}
                            onStepSubmit={this.buildFunctionCheckSubmitFunctions()}
                            stepNames={Object.values(FunctionCheckStepNames)}
                            orientation={'vertical'}
                            onAllStepsComplete={this.props.markReadyToSubmit} //when the last load current step is complete, mark ready to proceed to the next step
                            updateMasterState={(stepperState) => {
                                this.props.updateStepperState(stepperState)  // when all currents have been recorded in this step, add them all to the outer stepper state
                            }}
                />
            </div>)
    }

}

FunctionalChecksStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    stepperState: PropTypes.object.isRequired,
    updateStepperState : PropTypes.func.isRequired
}