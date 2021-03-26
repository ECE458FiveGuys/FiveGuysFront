import React from "react";
import PropTypes from "prop-types";
import {
    VoltageTestErrorMargins,
    VoltageTestErrorMessages,
    VoltageTestExpectedReadings, VoltageTestInputFrequencies, VoltageTestInputVoltages,
    VoltageTestStepNamesToKeys
} from "../../step_utils";
import {percentErrorGreaterThan} from "../../../LoadBankPage/Steps/LoadBankStepSteps/step_utils";
import {isNumeric} from "../../../LoadBankPage/utils";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import HTPButton from "../../../../Common/HTPButton";
import Step from "../../../../Common/Text/Step";
import {DC_STEP_NAMES} from "../StepEnums/dc_step_enums";
import KlufeRequests from "../../../../../controller/requests/klufe_requests";
import {getToken} from "../../../../../auth/auth_utils";

export default class TestVoltageSubStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
            readingReady : false
        }
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack, stepName) => {
        let testVoltageStepKey = VoltageTestStepNamesToKeys[stepName]
        let idealVoltage = VoltageTestExpectedReadings[testVoltageStepKey]
        let reading = stepperState[stepName == DC_STEP_NAMES.TEST_VOLTAGE ? "DCreadings" : "ACreadings"][testVoltageStepKey]
        if (!isNumeric(reading)) {
            errorCallBack("Voltage must be a number")
            return
        }
        reading = parseFloat(reading)
        let error = []
        if (percentErrorGreaterThan(VoltageTestErrorMargins[testVoltageStepKey]/idealVoltage, idealVoltage, reading)) {
            error.push(VoltageTestErrorMessages[testVoltageStepKey])
        }
        if (error.length == 0) {
            KlufeRequests.off(getToken())
            successCallBack()
        } else errorCallBack(error)
    }

    /*
     function called after the CR or CA input changes. Checks to see if both inputs have been written.
     If so, marks the step as ready to submit and advance to the next load step
     */

    shouldEnableSubmit = () => {
        let {stepperState, markReadyToSubmit, testVoltageStepKey, stepType} = this.props
        let reading = stepperState[stepType + "readings"][testVoltageStepKey]
        let {ready} = this.state
        if (reading && !ready) {
            this.setState({ready : true}, markReadyToSubmit)
        } else if (!reading  && ready) {
            this.setState({ready : false}, markReadyToSubmit)
        }
    }

    onChange = (value) => {
        let {stepperState, updateStepperState, testVoltageStepKey, stepType} = this.props
        if (!stepperState[stepType + "readings"]) {
            stepperState[stepType + "readings"] = {}
        }
        stepperState[stepType + "readings"][testVoltageStepKey] = value
        updateStepperState({[stepType + "readings"] : stepperState[stepType + "readings"]}, this.shouldEnableSubmit)
    }

    onVoltageSet = () => {
        let {stepType, testVoltageStepKey} = this.props
        let inputVoltage = VoltageTestInputVoltages[testVoltageStepKey]
        let inputFrequency = VoltageTestInputFrequencies[testVoltageStepKey]
        if (!this.state.readingReady) {
            KlufeRequests.on(getToken())
            stepType == "DC" ? KlufeRequests.setDC(getToken(), inputVoltage) : KlufeRequests.setAC(getToken(), inputVoltage, inputFrequency)
            this.setState({readingReady: true})
        } else {
            stepType == "DC" ? KlufeRequests.setDC(getToken(), 0) : KlufeRequests.setAC(getToken(), 0,0)
            KlufeRequests.off(getToken())
            this.setState({readingReady: false})
        }
    }

    render() {
        let {stepperState, stepType, testVoltageStepKey} = this.props
        let {readingReady} = this.state
        let inputVoltage = VoltageTestInputVoltages[testVoltageStepKey]
        let inputFrequency = VoltageTestInputFrequencies[testVoltageStepKey]
        return(<div style={{display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center"}}>
                    <div style={{marginTop : 20, marginBottom : 20}}>
                        <Step stepNumber={1}
                              stepText={`Permit system to set Klufe voltage to ${inputVoltage} V${inputFrequency ? ` and frequency to ${inputFrequency}` : ""}`}  />
                    </div>
                    <HTPButton label={!readingReady ? `Allow` : `Turn off ${stepType}`}
                               color={readingReady ? 'red' : 'green'}
                               onSubmit={this.onVoltageSet}/>
                    <div style={{marginTop : 20, marginBottom : 20}}>
                        <Step stepNumber={2}
                              stepText={`Now, input the voltage from your Fluke 87`}  />
                    </div>
                        <HTPInput label={`Expected: ${VoltageTestExpectedReadings[testVoltageStepKey]} V`}
                                  onChange={value => this.onChange(value)}
                                  //value = {stepperState.readings}
                                  disabled = {!readingReady}
                                  // defaultValue={(stepperState.readings &&
                                  //     stepperState.readings[testVoltageStepKey]) ?
                                  //     stepperState.readings[testVoltageStepKey] : ""}
                                  placeholder={"Voltage (V)"}/>
                </div>)
    }

}

TestVoltageSubStep.propTypes = {
    testVoltageStepKey : PropTypes.string.isRequired,
    updateStepperState : PropTypes.func.isRequired,
    stepperState : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    stepType : PropTypes.string.isRequired //AC or DC
}
