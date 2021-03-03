import React from "react";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import {MDBCol} from "mdbreact";
import PropTypes from "prop-types";
import {IdealCurrents} from "./step_enums";

export default class LoadStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    static percentErrorLessThan = (decimal, ideal, actual) => {
        return ((actual - ideal) / ideal) < decimal
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack, stepName) => {
        let idealCurrent = IdealCurrents[stepName]
        if (idealCurrent == 0) {
            if (stepperState.CR > 0) {
                errorCallBack("Display error current is nonzero with no load, repair/replace load cell")
            } else if (stepperState.CA > 0) {
                errorCallBack("Shunt meter current error is nonzero with no load, adjust ppm setting to fix")
            }

        }
        if (LoadStep.percentErrorLessThan(.03, idealCurrent, stepperState.recordedCurrents[stepName].CR)) {
            errorCallBack("Display current error is greater than 3%, repair/replace load cell")
        } else if (LoadStep.percentErrorLessThan(.05, idealCurrent, stepperState.recordedCurrents[stepName].CA)) {
            errorCallBack("Shunt meter current error is greater than 5%, adjust ppm setting to fix")
        } else {
            successCallBack()
        }
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
    onChange = (value, currentType) => {
        let {stepperState, updateStepperState, stepName} = this.props
        if (!stepperState.recordedCurrents) {
            stepperState.recordedCurrents = {}
        }
        stepperState.recordedCurrents[stepName][currentType] = value
        updateStepperState({recordedCurrents : stepperState.recordedCurrents}, this.shouldEnableSubmit)
    }


    render() {
        return(<div>
                    {`Ideal current: ${IdealCurrents[this.props.stepName]}`}
                <div style={{display : "flex", flexDirection : "row"}}>
                    <MDBCol size={2}>
                        <HTPInput label={"Current Displayed on Load Bank (CR)" }
                                  onChange={value => this.onChange(value, "CR")}
                                  placeholder={"Current"}/>
                    </MDBCol>
                    <MDBCol size={2}>
                        <HTPInput label={"Actual Current from Shunt Meter (CA)"}
                                  onChange={value => this.onChange(value, "CA")}
                                  placeholder={"Current"}/>
                    </MDBCol>
                </div>
        </div>)
    }

}

LoadStep.propTypes = {
    idealCurrent : PropTypes.string.isRequired,
    updateStepperState : PropTypes.func.isRequired,
    stepperState : PropTypes.object.isRequired,
    stepName : PropTypes.string.isRequired
}
