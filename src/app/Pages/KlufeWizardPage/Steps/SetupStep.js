import React from "react";
import {Checkbox, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import {MDBBadge, MDBContainer, MDBListGroup, MDBListGroupItem} from "mdbreact";
import ModelFields, {MiscellaneousEnums} from "../../../../utils/enums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import Loading from "../../../Common/Images/Loading";
import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import {dateColors, parseDate} from "../../../utils";
import InstrumentDisplay from "../../../Common/Displays/HTPInstrumentDisplay";
import {EquipmentModel, Instrument, Models} from "../../../../utils/ModelEnums";
import {PaginatedResponseFields} from "../../../Common/Tables/TableUtils/pagination_utils";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";
import {isNumeric} from "../../LoadBankPage/utils";
import {UserError} from "../../../../controller/exceptions";

export default class SetupStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false
        }
    }

    componentDidMount() {
        let {token, instrumentId} = this.props
        InstrumentRequests.getInstrumentsByCategory(this.props.token, {name : MiscellaneousEnums.KNOWN_CATEGORIES.KLUFE},
            (json) => this.setState({klufeOptions : this.makeAssetTagArray(json)}),
            (error) => alert(error),
            Models.EQUIPMENT_MODEL.TYPE)
        InstrumentRequests.retrieveInstrument(token,
            instrumentId,
            (json) => {
                this.props.updateStepperState({instrument : json})
            }
        )
    }

    static getInstrument = (token, assetTag, successCallBack, errorCallBack) => {
        if (!isNumeric(assetTag)) {
            errorCallBack(`Klufe 5700 asset tag number must be numeric.`)
            return
        }
        InstrumentRequests.getInstruments(token,
            (json) => {
                json = json[PaginatedResponseFields.RESULTS]
                if (!json[0]) {
                    throw new UserError(`No such Klufe 5700 exists.`)
                }
                let mostRecentCalibration = json[0][ModelFields.InstrumentFields.EXPIRATION_DATE]
                if (mostRecentCalibration === "Not Calibratable") {
                    throw new UserError(`This Klufe 5700 is marked as not calibratable.`)
                }
                if (!mostRecentCalibration || mostRecentCalibration == null || parseDate(mostRecentCalibration) == dateColors.RED) {
                    throw new UserError(`The calibration for this Klufe 5700 has expired or is not valid.`)
                }
                successCallBack(json[0])
            },
            (errorMessage) => errorCallBack(errorMessage),
            undefined,
            parseInt(assetTag))
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
            stepperState.klufe.fullInstrument = instrument
            callBackLogic()
        }

        let callBackLogic = () => {
            if (errorMessages.length > 0) {
                errorCallBack(errorMessages)
            } else {
                successCallBack()
            }
        }

        this.getInstrument(token, stepperState.klufe.asset_tag_number,
            multiSuccessCallBack, multiErrorCallBack)
    }

    makeAssetTagArray(json) {
        return json[PaginatedResponseFields.RESULTS].length > 0 ? json[PaginatedResponseFields.RESULTS].map(entry => entry[Instrument.FIELDS.ASSET_TAG].toString()) : []
    }

    handleChange = (value) => {
        let {updateStepperState} = this.props
        updateStepperState({klufe : {asset_tag_number : value}}, this.shouldEnableSubmit)
    }

    shouldEnableSubmit = () => {
        let {klufe} = this.props.stepperState
        let {ready} = this.state
        if (klufe && !ready) {
            this.setState({ready : true}, this.props.markReadyToSubmit)
        } else if ((!klufe) && ready) {
            this.setState({ready : false}, this.props.markReadyToSubmit)
        }
    }

    render() {
        let {user} = this.props
        let instrument = this.props.stepperState.instrument
        return instrument ?
            (<div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", marginBottom : 30}}>
                <h1 className={"h1-responsive"}>{`Hello, ${user.getFirstName()}!`}</h1>
                <p style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                    To get started, retrieve the Fluke 87 with the following properties:
                </p>
                {InstrumentDisplay(instrument)}
                <p style={{marginTop : 20, marginBottom: 30, justifyContent: "center", alignItems: 'center'}}>
                    Now, Identify the Klufe K5700 you will be using:
                </p>
                <HTPAutoCompleteInput label={"Shunt Meter Asset Tag"}
                                      options={this.state.klufeOptions}
                                      wrapped={false}
                                      onChange={(value) => this.handleChange(value)}
                                      placeholder={"Asset Tag"}/>
                <p style={{marginTop : 40, marginBottom: 10, justifyContent: "center", alignItems: 'center'}}>
                    Now, take your Fluke 87 to the Klufe K5700.
                </p>
            </div>) : <Loading/>
    }

}

SetupStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    stepperState: PropTypes.object.isRequired,
    updateStepperState : PropTypes.func.isRequired
}