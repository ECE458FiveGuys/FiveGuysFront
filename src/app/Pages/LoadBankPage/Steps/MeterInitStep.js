import React from "react";
import {Checkbox, Divider, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import HTPInput from "../../../Common/Inputs/HTPInput";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import ModelFields, {MiscellaneousEnums} from "../../../../utils/enums";
import {dateColors, parseDate} from "../../../utils";
import {UserError} from "../../../../controller/exceptions";
import {EquipmentModel, Instrument, Models} from "../../../../utils/ModelEnums";
import {isNumeric} from "../utils";
import {PaginatedResponseFields} from "../../../Common/Tables/TableUtils/pagination_utils";
import RequestUtils from "../../../../controller/requests/request_utils";
import MiscellaneousRequests from "../../../../controller/requests/miscellaneous_requests";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";


export default class MeterInitStep extends React.Component {

    static VOLTMETER = "voltmeter"
    static SHUNT_METER = "shuntMeter"

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    componentDidMount() {
        InstrumentRequests.getInstrumentsByCategory(this.props.token, {name : MiscellaneousEnums.KNOWN_CATEGORIES.SHUNT_METER},
            (json) => this.setState({shuntMeterOptions : this.makeAssetTagArray(json)}),
            (error) => alert(error),
            Models.EQUIPMENT_MODEL.TYPE)
        InstrumentRequests.getInstrumentsByCategory(this.props.token, {name : MiscellaneousEnums.KNOWN_CATEGORIES.VOLTMETER},
            (json) => this.setState({voltmeterOptions : this.makeAssetTagArray(json)}),
            (error) => alert(error), Models.EQUIPMENT_MODEL.TYPE)
    }

    makeAssetTagArray(json) {
        return json[PaginatedResponseFields.RESULTS].length > 0 ? json[PaginatedResponseFields.RESULTS].map(entry => entry[Instrument.FIELDS.ASSET_TAG].toString()) : []
    }

    static getInstrument = (token, modelNumber, assetTag, meterType, successCallBack, errorCallBack) => {
        if (!isNumeric(assetTag)) {
            errorCallBack(`${meterType} asset tag number must be numeric.`)
            return
        }
        InstrumentRequests.getInstruments(token,
            (json) => {
                json = json[PaginatedResponseFields.RESULTS]
                if (!json[0]) {
                    throw new UserError(`No such ${meterType} exists.`)
                }
                let mostRecentCalibration = json[0][ModelFields.InstrumentFields.EXPIRATION_DATE]
                if (mostRecentCalibration === "Not Calibratable") {
                    throw new UserError(`This ${meterType} is marked as not calibratable.`)
                }
                if (parseDate(mostRecentCalibration) == dateColors.RED) {
                    throw new UserError(`The calibration for this ${meterType} has expired.`)
                }
                successCallBack(json[0])
            },
            (errorMessage) => errorCallBack(errorMessage),
            undefined,
            parseInt(assetTag),
            undefined,
            modelNumber)
    }

    static onSubmit = (stepperState, token, successCallBack, errorCallBack) => {
        let errorMessages = []
        let multiErrorCallBack = (errorMessage) => {
            errorMessages.push(<li>{errorMessage}</li>)
            callBackLogic()
        }
        let instruments = []
        let multiSuccessCallBack = (instrument) => {
            instruments.push(instrument)
            callBackLogic()
        }

        let callBackLogic = () => {
            if (instruments.length + errorMessages.length >= 2) {
                if (errorMessages.length > 0) {
                    errorCallBack(errorMessages)
                } else {
                    successCallBack()
                }
            }
        }

        this.getInstrument(token, stepperState.meters[MeterInitStep.VOLTMETER][EquipmentModel.FIELDS.MODEL_NUMBER],
            stepperState.meters[MeterInitStep.VOLTMETER][Instrument.FIELDS.ASSET_TAG],
            "voltmeter", multiSuccessCallBack, multiErrorCallBack)
        this.getInstrument(token, stepperState.meters[MeterInitStep.SHUNT_METER][EquipmentModel.FIELDS.MODEL_NUMBER],
            stepperState.meters[MeterInitStep.SHUNT_METER][Instrument.FIELDS.ASSET_TAG],
            "shunt meter", multiSuccessCallBack, multiErrorCallBack)
    }

    shouldEnableSubmit = () => {
        let {voltmeter, shuntMeter} = this.props.stepperState.meters
        let voltmeterAssetTag = voltmeter ? voltmeter[Instrument.FIELDS.ASSET_TAG] : undefined
        let shuntMeterAssetTag = shuntMeter ? shuntMeter[Instrument.FIELDS.ASSET_TAG] : undefined
        let {ready} = this.state
        if (voltmeterAssetTag && shuntMeterAssetTag && !ready) {
            this.setState({ready : true}, this.props.markReadyToSubmit)
        } else if ((!voltmeterAssetTag || !shuntMeterAssetTag) && ready) {
            this.setState({ready : false}, this.props.markReadyToSubmit)
        }
    }

    handleChange = (meterType, fieldType, value) => {
        let {stepperState, updateStepperState} = this.props
        if (!stepperState.meters) stepperState.meters = {}
        if (!stepperState.meters[meterType]) stepperState.meters[meterType] = {}
        stepperState.meters[meterType][fieldType] = value
        updateStepperState({meters : stepperState.meters}, this.shouldEnableSubmit)
    }

    render() {
        let {voltmeterOptions, shuntMeterOptions} = this.state
        return (<div style={{flex: 1, display: "flex", flexDirection: "row", width : "100%", alignItems: "center", justifyContent: 'space-between', marginBottom : 30}}>
                    <div style={{display: "inline-flex", flex: 1, width: "100%", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                        <p  className={"h3-responsive"}
                            style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                            Locate a valid voltmeter:
                        </p>
                        <HTPAutoCompleteInput label={"Voltmeter Asset Tag"}
                                              options={voltmeterOptions}
                                              wrapped={false}
                                              onChange={(value) => this.handleChange(MeterInitStep.VOLTMETER, ModelFields.InstrumentFields.ASSET_TAG, value)}
                                              placeholder={"Asset Tag"}/>
                    </div>
                    <Divider flexItem={true} orientation={"vertical"}/>
                    <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                        <p className={"h3-responsive"}
                            style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                            Locate a valid shunt meter:
                        </p>
                        <HTPAutoCompleteInput label={"Shunt Meter Asset Tag"}
                                              options={shuntMeterOptions}
                                              wrapped={false}
                                              onChange={(value) => this.handleChange(MeterInitStep.SHUNT_METER, ModelFields.InstrumentFields.ASSET_TAG, value)}
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