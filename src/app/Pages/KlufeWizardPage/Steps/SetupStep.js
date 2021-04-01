import React from "react";
import {Checkbox, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import {MDBBadge, MDBContainer, MDBListGroup, MDBListGroupItem} from "mdbreact";
import ModelFields, {MiscellaneousEnums} from "../../../../utils/enums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import Loading from "../../../Common/Images/Loading";
import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import {parseDate} from "../../../utils";
import InstrumentDisplay from "../../../Common/Displays/HTPInstrumentDisplay";
import {Instrument, Models} from "../../../../utils/ModelEnums";
import {PaginatedResponseFields} from "../../../Common/Tables/TableUtils/pagination_utils";
import HTPAutoCompleteInput from "../../../Common/Inputs/HTPAutoCompleteInput";

export default class SetupStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false
        }
    }

    componentDidMount() {
        let {token, instrumentId} = this.props
        InstrumentRequests.retrieveInstrument(token,
            instrumentId,
            (json) => {
                this.props.updateStepperState({instrument : json})
            }
        )
    }

    componentDidMount() {
        InstrumentRequests.getInstrumentsByCategory(this.props.token, {name : MiscellaneousEnums.KNOWN_CATEGORIES.KLUFE},
            (json) => this.setState({klufeOptions : this.makeAssetTagArray(json)}),
            (error) => alert(error),
            Models.EQUIPMENT_MODEL.TYPE)
    }

    makeAssetTagArray(json) {
        return json[PaginatedResponseFields.RESULTS].length > 0 ? json[PaginatedResponseFields.RESULTS].map(entry => entry[Instrument.FIELDS.ASSET_TAG].toString()) : []
    }

    handleChange = (value) => {
        let {updateStepperState} = this.props
        updateStepperState({klufe : value}, this.shouldEnableSubmit)
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
                                      options={this.props.klufeOptions}
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