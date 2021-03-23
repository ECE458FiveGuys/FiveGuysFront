import React from "react";
import {Checkbox, StepContent} from "@material-ui/core";
import PropTypes from "prop-types";
import {MDBBadge, MDBContainer, MDBListGroup, MDBListGroupItem} from "mdbreact";
import ModelFields from "../../../../utils/enums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import Loading from "../../../Common/Images/Loading";
import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import {parseDate} from "../../../utils";
import InstrumentDisplay from "../../../Common/Displays/HTPInstrumentDisplay";

export default class SetupStep extends React.Component {

    constructor(props) {
        super(props);
        props.markReadyToSubmit()
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
                <p style={{marginTop : 40, marginBottom: 10, justifyContent: "center", alignItems: 'center'}}>
                    Now, take it to the Klufe K5700.
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