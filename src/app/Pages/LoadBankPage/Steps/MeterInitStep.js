import React from "react";
import {Checkbox, Divider, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import HTPInput from "../../../Common/Inputs/HTPInput";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import ModelFields from "../../../../utils/enums";
import {dateColors, parseDate} from "../../../utils";
import {UserError} from "../../../../controller/exceptions";

export default class MeterInitStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    static getInstrument = (token, assetTag, modelNumber, meterType, successCallBack, errorCallBack) => {
        InstrumentRequests.getInstruments(token,
            (json) => {
                if (!json[0]) {
                    throw new UserError(`No such ${meterType} exists.`)
                }
                let mostRecentCalibration = json[0][ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]
                if (mostRecentCalibration === "Noncalibratable") {
                    throw new UserError(`This ${meterType} is marked as noncalibratable.`)
                }
                if (parseDate(mostRecentCalibration) != dateColors.RED) {
                    throw new UserError(`The calibration for this ${meterType} has expired.`)
                } else {
                    successCallBack()
                }
            },
            (errorMessage) => errorCallBack(errorMessage),
            undefined,
            assetTag,
            undefined,
            modelNumber)
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack) => {
        this.getInstrument(token, stepperState.voltmeterAssetTag, stepperState.voltmeterModelNum, "voltmeter", successCallBack, errorCallBack)
        this.getInstrument(token, stepperState.shuntMeterAssetTag, stepperState.shuntMeterModelNum, "shunt meter", successCallBack, errorCallBack)
    }

    shouldEnableSubmit = () => {
        let {voltmeterModelNum, voltmeterAssetTag, shuntMeterModelNum, shuntMeterAssetTag} = this.props.stepperState
        let {ready} = this.state
        if (voltmeterModelNum && voltmeterAssetTag && shuntMeterModelNum && shuntMeterAssetTag && !ready) {
            this.setState({ready : true}, this.props.markReadyToSubmit)
        } else if ((!voltmeterModelNum || !voltmeterAssetTag || !shuntMeterModelNum || !shuntMeterAssetTag) && ready) {
            this.setState({ready : false}, this.props.markReadyToSubmit)
        }
    }

    render() {
        let {updateStepperState} = this.props
        return (<div style={{flex: 1, display: "flex", flexDirection: "row", width : "100%", alignItems: "center", justifyContent: 'space-between', marginBottom : 30}}>
                    <div style={{display: "inline-flex", flex: 1, width: "100%", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                        <p  className={"h3-responsive"}
                            style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                            Locate a valid voltmeter:
                        </p>
                        <HTPInput
                                  label={"Voltmeter Model Number"}
                                  onChange={(value) => updateStepperState({voltmeterModelNum : value}, this.shouldEnableSubmit)}
                                  placeholder={"Model Number"}/>
                        <HTPInput label={"Voltmeter Asset Tag"}
                                  onChange={(value) => updateStepperState({voltmeterAssetTag : value}, this.shouldEnableSubmit)}
                                  placeholder={"Asset Tag"}/>
                    </div>
                    <Divider flexItem={true} orientation={"vertical"}/>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                        <p className={"h3-responsive"}
                            style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                            Locate a valid shunt meter:
                        </p>
                        <HTPInput label={"Shunt Meter Model Number"}
                                  onChange={(value) => updateStepperState({shuntMeterModelNum : value}, this.shouldEnableSubmit)}
                                  placeholder={"Model Number"}/>
                        <HTPInput label={"Shunt Meter Asset Tag"}
                                  onChange={(value) => updateStepperState({shuntMeterAssetTag : value}, this.shouldEnableSubmit)}
                                  placeholder={"Asset Tag"}/>
                    </div>
        </div>)
    }

}

MeterInitStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    updateStepperState : PropTypes.func.isRequired
}