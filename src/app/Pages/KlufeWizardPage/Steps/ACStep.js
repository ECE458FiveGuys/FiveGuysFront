import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../../../Common/Stepper/HTPStepper";
import {User} from "../../../../utils/dtos";
import FunctionalCheckStep from "../../../Common/Stepper/FunctionalCheckSteps/FunctionalCheckStep";
import FlukeAC from "../../../../assets/FlukeAC.png"
import DescriptionWithIcon from "./StepComponents/DescriptionWithIcon";
import TestVoltageSubStep from "./StepComponents/TestVoltageSubStep";
import {TestVoltageStepKeys, VoltageTestStepNamesToKeys} from "../step_utils";
import {AC_STEP_NAMES_LIST} from "./StepEnums/ac_step_enums";

/*
A stepper within a stepper
 */

export default class ACStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
            modal : false,
        }
    }

    // functions for stepper inside this step

    renderSteps = () => {
        let steps = []
        steps.push((stepperState, updateStepperState, markReadyToSubmit) =>
                <FunctionalCheckStep functionDescription={DescriptionWithIcon(FlukeAC, "On the Model 87, select the ", " button.", "flukeAC", 20)}
                                     markReadyToSubmit={markReadyToSubmit}/>)
        TestVoltageStepKeys.forEach(key => {
            if (key != TestVoltageStepKeys[0]) {
                steps.push(
                    (stepperState, updateStepperState, markReadyToSubmit) =>
                        <TestVoltageSubStep testVoltageStepKey={key}
                                            stepperState={stepperState}
                                            stepType={"AC"}
                                            updateStepperState={updateStepperState}
                                            markReadyToSubmit={markReadyToSubmit}/>)
            }
        })
        return steps
    }

    buildStepSubmitFunctions = () => {
        let functions = []
        functions.push((stepperState, successCallBack) => {successCallBack()})
        AC_STEP_NAMES_LIST.forEach(stepName => {
            if (stepName != AC_STEP_NAMES_LIST[0]) {
                functions.push(
                    (stepperState, successCallBack, errorMessageCallBack) =>
                        TestVoltageSubStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack, stepName)
                )
            }
        })
        return functions
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {user, token} = this.props
        return (<div style={{display: "flex", flex: 1, flexDirection: "column", width : "100%", alignItems: "center", justifyContent: 'center', marginBottom : 30}}>
            <h1 className={"h2-responsive"}>{`Now, let's test with AC voltage.`}</h1>
            <HTPStepper user={user}
                        token={token}
                        ref={el => this.internalStepperRef = el}
                        stepContent={this.renderSteps()}
                        onStepSubmit={this.buildStepSubmitFunctions()}
                        stepNames={AC_STEP_NAMES_LIST}
                        orientation={'vertical'}
                        resetOptionOnError={true}
                        onAllStepsComplete={this.props.markReadyToSubmit} //when the last load current step is complete, mark ready to proceed to the next step
                        updateMasterState={(stepperState) => {
                            this.props.updateStepperState(stepperState)  // when all voltages have been recorded in this step, add them all to the outer stepper state
                        }}
                        completeButtonLabel={"Proceed"}
                        finishButtonLabel={"Conclude AC Calibration"}
            />
        </div>)
    }

}

ACStep.propTypes = {
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    updateStepperState : PropTypes.func.isRequired
}