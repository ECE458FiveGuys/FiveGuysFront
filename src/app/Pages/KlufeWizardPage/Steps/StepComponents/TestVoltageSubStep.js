import React from "react";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import PropTypes from "prop-types";
import {IdealCurrents, percentErrorGreaterThan} from "./step_utils";
import {isNumeric} from "../../utils";

export default class TestVoltageSubStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack, stepName) => {
        let idealCurrent = IdealCurrents[stepName]
        let {CR, CA} = stepperState.recordedCurrents[stepName]
        if (!isNumeric(CR) || !isNumeric(CA)) {
            errorCallBack("Currents must be numbers")
            return
        }
        CR = parseInt(CR)
        CA = parseInt(CA)
        let error = []
        if (idealCurrent == 0) {
            if (CR != 0) {
                error.push(<li>Display error current is nonzero with no load, repair/replace load cell</li>)
            }
            if (CA != 0) {
                error.push(<li>Shunt meter current error is nonzero with no load, adjust ppm setting to fix</li>)
            }

        } else {
            if (percentErrorGreaterThan(.03, idealCurrent, CR)) {
                error.push(<li>Display current error is greater than 3%, repair/replace load cell</li>)
            }
            if (percentErrorGreaterThan(.05, idealCurrent, CA)) {
                error.push(<li>Shunt meter current error is greater than 5%, adjust ppm setting to fix</li>)
            }
        }
        error.length == 0 ?
            successCallBack() :
            errorCallBack(error)
    }

    /*
     function called after the CR or CA input changes. Checks to see if both inputs have been written.
     If so, marks the step as ready to submit and advance to the next load step
     */

    shouldEnableSubmit = () => {
        let {stepName, stepperState, markReadyToSubmit} = this.props
        let {CR, CA} = stepperState.recordedCurrents[stepName]
        let {ready} = this.state
        if (CR && CA && !ready) {
            this.setState({ready : true}, markReadyToSubmit)
        } else if ((!CR || !CA)  && ready) {
            this.setState({ready : false}, markReadyToSubmit)
        }
    }


    // currentType : CR or CA
    onChange = (value) => {
        let {stepperState, updateStepperState, stepName} = this.props
        if (!stepperState.recordedCurrents[stepName]) {
            stepperState.recordedCurrents[stepName] = {}
        }
        stepperState.recordedCurrents[stepName][currentType] = value
        updateStepperState({recordedCurrents : stepperState.recordedCurrents}, this.shouldEnableSubmit)
    }

    render() {
        // let Inputs = this.renderInputs()
        let {stepperState, stepName} = this.props
        if (stepperState.reset) {
            if (this.CRref.current) this.CRref.current.setValue('')
            if (this.CAref.current) this.CAref.current.setValue('')
            this.setState({ready : false})
        }
        return(<div>
            <text style={{marginTop : 20, marginBottom: 20}}>{`Ideal current: ${IdealCurrents[stepName]} A`}</text>
            <div style={{display : "flex", flexDirection : "row"}}>
                <HTPInput style={{marginRight : 20}}
                          label={"Resulting Voltage on Fluke 87" }
                          onChange={value => this.onChange(value, "CR")}
                          ref = {this.CRref}
                          value = {stepperState.reset ? undefined : stepperState.recordedCurrents}
                          defaultValue={(stepperState.recordedCurrents &&
                              stepperState.recordedCurrents[stepName]) ?
                              stepperState.recordedCurrents[stepName].CR : ""}
                          placeholder={"Current (A)"}/>
            </div>
        </div>)
    }

}

LoadBankCurrentStep.propTypes = {
    idealCurrent : PropTypes.string.isRequired,
    updateStepperState : PropTypes.func.isRequired,
    stepperState : PropTypes.object.isRequired,
    stepName : PropTypes.string.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired
}
