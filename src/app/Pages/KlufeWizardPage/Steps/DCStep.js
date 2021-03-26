import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../../../Common/Stepper/HTPStepper";
import {User} from "../../../../utils/dtos";
import FunctionalCheckStep from "../../../Common/Stepper/FunctionalCheckSteps/FunctionalCheckStep";
import FlukeConnect from "../../../../assets/FlukeConnect.png"
import FlukeDC from "../../../../assets/FlukeDC.png"
import {DC_STEP_NAMES} from "./StepEnums/dc_step_enums";
import DescriptionWithIcon from "./StepComponents/DescriptionWithIcon";
import TestVoltageSubStep from "./StepComponents/TestVoltageSubStep";
import {TestVoltageStepKeys} from "../step_utils";
import KlufeRequests from "../../../../controller/requests/klufe_requests";
import {getToken} from "../../../../auth/auth_utils";

/*
A stepper within a stepper
 */

export default class DCStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
            modal : false,
        }
    }

    // functions for stepper inside this step

    renderSteps = () => {
         return [
             (stepperState, updateStepperState, markReadyToSubmit) =>
                <FunctionalCheckStep functionDescription={"The system will now set the VDC of the Klufe K5700 to 0. Proceed?"}
                                     markReadyToSubmit={markReadyToSubmit}/>,
             (stepperState, updateStepperState, markReadyToSubmit) =>
                 <FunctionalCheckStep functionDescription={DescriptionWithIcon(FlukeDC, "On the Model 87, select the ", " button.", "flukeDC", 20)}
                                      markReadyToSubmit={markReadyToSubmit}/>,
             (stepperState, updateStepperState, markReadyToSubmit) =>
                 <FunctionalCheckStep functionDescription={DescriptionWithIcon(FlukeConnect, "Connect the Klufe K5700 to the Model 87 ", " and COM inputs.", "flukeConnect", 60)}
                                      markReadyToSubmit={markReadyToSubmit}/>,
             (stepperState, updateStepperState, markReadyToSubmit) =>
                 <TestVoltageSubStep  testVoltageStepKey = {TestVoltageStepKeys[0]}
                                      stepperState = {stepperState}
                                      stepType={"DC"}
                                      updateStepperState = {updateStepperState}
                                      markReadyToSubmit={markReadyToSubmit}/>
        ]
    }

    buildStepSubmitFunctions = () => {
        return [
            (stepperState, successCallBack) => {
                KlufeRequests.on(getToken())
                KlufeRequests.setDC(getToken(), 0)
                successCallBack()
            },
            (stepperState, successCallBack) => {successCallBack()},
            (stepperState, successCallBack) => {successCallBack()},
            (stepperState, successCallBack, errorMessageCallBack) =>
                TestVoltageSubStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack, DC_STEP_NAMES.TEST_VOLTAGE)
        ]
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {user, token} = this.props
        let stepNames = Object.values(DC_STEP_NAMES)
        return (<div style={{display: "flex", flex: 1, flexDirection: "column", width : "100%", alignItems: "center", justifyContent: 'center', marginBottom : 30}}>
                    <h1 className={"h2-responsive"}>{`Now, let's test with DC voltage.`}</h1>
                    <HTPStepper user={user}
                                token={token}
                                ref={el => this.internalStepperRef = el}
                                stepContent={this.renderSteps()}
                                onStepSubmit={this.buildStepSubmitFunctions()}
                                stepNames={stepNames}
                                orientation={'vertical'}
                                resetOptionOnError={true}
                                onAllStepsComplete={this.props.markReadyToSubmit} //when the last load current step is complete, mark ready to proceed to the next step
                                updateMasterState={(stepperState) => {
                                    this.props.updateStepperState(stepperState)  // when all voltages have been recorded in this step, add them all to the outer stepper state
                                }}
                                completeButtonLabel={"Proceed"}
                                finishButtonLabel={"Conclude DC Calibration"}
                    />
                </div>)
    }

}

DCStep.propTypes = {
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    updateStepperState : PropTypes.func.isRequired
}