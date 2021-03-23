import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../../../Common/Stepper/HTPStepper";
import {User} from "../../../../utils/dtos";
import FunctionalCheckStep from "../../../Common/Stepper/FunctionalCheckSteps/FunctionalCheckStep";
import FlukeConnect from "../../../../assets/FlukeConnect.png"
import FlukeDC from "../../../../assets/FlukeDC.png"
import {DC_STEP_NAMES} from "./StepEnums/DC_step_enums";
import DescriptionWithIcon from "./StepComponents/DescriptionWithIcon";

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
             // (stepperState, updateStepperState, markReadyToSubmit) =>
             //     <FunctionalCheckStep functionDescription={"The system will now set the VDC of the Klufe K5700 to 0. Proceed?"}
             //                          markReadyToSubmit={markReadyToSubmit}/>,


        ]
    }



    buildStepSubmitFunctions = () => {
        return [
            (stepperState, successCallBack) => {
                //function.turnOnKlufe()  TODO
                //function.setDCVoltage(0) TODO
                successCallBack()
            },
            (stepperState, successCallBack) => {successCallBack()},
            (stepperState, successCallBack) => {
                //function.turnOnKlufe()  TODO
                //function.setDCVoltage(0) TODO
                successCallBack()
            }
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
                            this.props.updateStepperState(stepperState)  // when all currents have been recorded in this step, add them all to the outer stepper state
                        }}
                        completeButtonLabel={"Proceed"}
                        finishButtonLabel={"Conclude DC Calibration"}
            />
        </div>)
    }

}

DCStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    updateStepperState : PropTypes.func.isRequired
}