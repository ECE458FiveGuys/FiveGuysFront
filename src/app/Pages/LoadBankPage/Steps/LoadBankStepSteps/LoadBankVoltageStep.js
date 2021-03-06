import React from "react";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import PropTypes from "prop-types";
import {percentErrorGreaterThan} from "./step_utils";
import {isNumeric} from "../../utils";

const IDEAL_VOLTAGE = 48

export default class LoadBankVoltageStep extends React.Component {

    static StepName = "Load Bank Voltage"

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack) => {
        let {VR, VA} = stepperState.recordedVoltage
        if (!isNumeric(VR) || !isNumeric(VA)) {
            errorCallBack("Voltages must be numbers")
            return
        }
        VR = parseInt(VR)
        VA = parseInt(VA)
        let error = []
        let reset = false
        if (percentErrorGreaterThan(.01, IDEAL_VOLTAGE, VR)) {
            error.push(<li>Display voltage error is greater than 1%, adjust ppm setting to fix, then check again</li>)
            error.push(<br/>)
        }
        if (percentErrorGreaterThan(.1, IDEAL_VOLTAGE, VA)) {
            error.push(<li>Actual voltage is below 43.2V (>10% error), that’s too much sag. Check DC source and redo calibration</li>)
            error.push(<br/>)
            reset = true
        }
        error.length == 0 ?
            successCallBack() :
            errorCallBack(error, reset)
    }

    /*
     function called after the CR or CA input changes. Checks to see if both inputs have been written.
     If so, marks the step as ready to submit and advance to the next load step
     */

    shouldEnableSubmit = () => {
        let {stepperState, markReadyToSubmit} = this.props
        let {VR, VA} = stepperState.recordedVoltage
        let {ready} = this.state
        if (VR && VA && !ready) {
            this.setState({ready : true}, markReadyToSubmit)
        } else if ((!VR || !VA)  && ready) {
            this.setState({ready : false}, markReadyToSubmit)
        }
    }


    // currentType : CR or CA
    onChange = (value, voltageType) => {
        let {stepperState, updateStepperState} = this.props
        if (!stepperState.recordedVoltage) {
            stepperState.recordedVoltage = {}
        }
        if (!stepperState.recordedVoltage) {
            stepperState.recordedVoltage = {}
        }
        stepperState.recordedVoltage[voltageType] = value
        updateStepperState({recordedVoltage : stepperState.recordedVoltage}, this.shouldEnableSubmit)
    }


    render() {
        let {stepperState} = this.props
        return(<div>
            <text style={{marginTop : 20, marginBottom: 20}}>{`Ideal voltage: ${IDEAL_VOLTAGE} V`}</text>
            <div style={{display : "flex", flexDirection : "row"}}>
                <HTPInput style={{marginRight : 20}}
                          label={"Voltage Displayed on Load Bank (VR)" }
                          onChange={value => this.onChange(value, "VR")}
                          defaultValue={(stepperState.recordedCurrents &&
                              stepperState.recordedVoltage) ?
                              stepperState.recordedVoltage.VR : ""}
                          placeholder={"Voltage (V)"}/>
                <HTPInput label={"Actual Voltage from Voltmeter (VA)"}
                          onChange={value => this.onChange(value, "VA")}
                          defaultValue={(stepperState.recordedCurrents &&
                              stepperState.recordedVoltage) ?
                              stepperState.recordedVoltage.VA : ""}
                          placeholder={"Voltage (V)"}/>
            </div>
        </div>)
    }

}

LoadBankVoltageStep.propTypes = {
    updateStepperState : PropTypes.func.isRequired,
    stepperState : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired
}
