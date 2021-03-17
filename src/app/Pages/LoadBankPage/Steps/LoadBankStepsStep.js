import React from "react";
import PropTypes from "prop-types";
import HTPStepper from "../../../Common/HTPStepper";
import {User} from "../../../../utils/dtos";
import {CurrentStepNames, IdealCurrents, StepNames} from "./LoadBankStepSteps/step_utils";
import LoadBankCurrentStep from "./LoadBankStepSteps/LoadBankCurrentStep";
import HTPPopup from "../../../Common/HTPPopup";
import HTPButton from "../../../Common/HTPButton";
import LoadBankVoltageStep from "./LoadBankStepSteps/LoadBankVoltageStep";

/*
A stepper within a stepper
 */

export default class LoadBankStepsStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
            modal : false,
        }
    }

    // functions for stepper inside this step

    renderLoadSteps = () => {
        let LoadSteps = Object.keys(CurrentStepNames).map(stepNameKey => {
            return (stepperState, updateStepperState, markReadyToSubmit) =>
                <LoadBankCurrentStep idealCurrent={IdealCurrents[stepNameKey]}
                                     updateStepperState={updateStepperState}
                                     stepperState={stepperState}
                                     stepName={CurrentStepNames[stepNameKey]}
                                     markReadyToSubmit={markReadyToSubmit}/>
        })
        LoadSteps.push((stepperState, updateStepperState, markReadyToSubmit) =>
            <LoadBankVoltageStep updateStepperState={updateStepperState}
                                 stepperState={stepperState}
                                 markReadyToSubmit={markReadyToSubmit}/>)
        return LoadSteps
    }

    buildStepSubmitFunctions = () => {
        let StepSubmitFunctions = Object.keys(CurrentStepNames).map(stepNameKey => {
            return (stepperState, successCallBack, errorMessageCallBack) => {
                    LoadBankCurrentStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack, CurrentStepNames[stepNameKey])
                }
        })
        StepSubmitFunctions.push((stepperState, successCallBack, errorMessageCallBack) => {
            LoadBankVoltageStep.onSubmit(stepperState, this.props.token, successCallBack, errorMessageCallBack)
        })
        return StepSubmitFunctions
    }

    helpText = () => {
        return (<div>
            <ol>
                <li>Connect to a DC source</li>
                <li>Turn on load steps one at time:</li>
                <ul>
                    <li>10 steps of 100A</li>
                    <li>5 steps of 20A</li>
                    <li>20 steps of 1A</li>
                </ul>
                <li>Record current displayed on load bank and current measured from shunt for each load step</li>
                <ul>
                    <li>If actual current is >5% off:</li>
                    <ul>
                        <li>Check and repair/replace load cell</li>
                    </ul>
                    <li>If measured current is >3% off:</li>
                    <ul>
                        <li>Adjust ppm setting to fix, then restart</li>
                    </ul>
                    <li>Continue until all load steps are on</li>
                </ul>
                <li>Record voltage displayed on load bank and voltage measured via DMM</li>
                <ul>
                    <li>If actual voltage is below 43.2V (>10% error):</li>
                        <ul>
                            <li>That’s too much sag</li>
                            <li>Check DC source and redo calibration</li>
                        </ul>
                    <li>If measured voltage is >1% off:</li>
                        <ul>
                            <li>Adjust ppm setting to fix</li>
                            <li>Check again</li>
                        </ul>
                </ul>
            </ol>
        </div>)
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {user, token} = this.props
        let stepNames = Object.values(CurrentStepNames)
        stepNames.push(LoadBankVoltageStep.StepName)
        return (<div style={{display: "flex", flex: 1, flexDirection: "column", width : "100%", alignItems: "center", justifyContent: 'center', marginBottom : 30}}>
            <h1 className={"h2-responsive"}>{`Now, let's step through these currents`}</h1>
            <div>
                <ol>
                    <li>Connect to a DC source</li>
                    <li>Turn on load steps one at time</li>
                    <li>Record current displayed on load bank and current measured from shunt for each load step</li>
                    <li>Record voltage displayed on load bank and voltage measured via DMM</li>
                </ol>
            </div>
            <HTPButton onSubmit={this.toggleModal}
                       label={"More Info"}
                        color={"blue"}/>
            <HTPStepper user={user}
                        token={token}
                        ref={el => this.internalStepperRef = el}
                        stepContent={this.renderLoadSteps()}
                        onStepSubmit={this.buildStepSubmitFunctions()}
                        stepNames={stepNames}
                        orientation={'vertical'}
                        resetOptionOnError={true}
                        onAllStepsComplete={this.props.markReadyToSubmit} //when the last load current step is complete, mark ready to proceed to the next step
                        updateMasterState={(stepperState) => {
                                this.props.updateStepperState(stepperState)  // when all currents have been recorded in this step, add them all to the outer stepper state
                            }}
                        completeButtonLabel={"Record"}
                        finishButtonLabel={"Finish Recordings"}
            />
            <HTPPopup isOpen={this.state.modal}
                      toggleModal={this.toggleModal}
                      className={"text-info"}
                      title={"Load Step Info"}
                      message={this.helpText()}/>
        </div>)
    }

}

LoadBankStepsStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    updateStepperState : PropTypes.func.isRequired
}