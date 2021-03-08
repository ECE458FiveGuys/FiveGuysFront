import React, { Component } from "react";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";

import HTPNavBar from "../../../Common/HTPNavBar";
import {Divider} from "@material-ui/core";
import ActionSection from "../Common/ActionSection";
import CalibrationSection from "./Sections/Calibration/CalibrationSection";
import PropTypes from "prop-types";
import {User} from "../../../../utils/dtos";
import {instrumentCalibratable} from "./utils";
import MainView from "../../MainPage/MainView";
import ModelSection from "../Common/ModelSection";
import InstrumentSection from "./Sections/InstrumentSection";
import ModelFields from "../../../../utils/enums";

const DIVIDER_MARGINS = 100

export default class InstrumentDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

     componentDidMount() {
        let {token, id} = this.props
        let retrieveInstrumentCallback = (instrument) => {
            this.setState({instrument : instrument, calibrations : instrument['calibration_history']});
        }
        let retrieveInstrumentError = (e) => {
            alert("RETRIEVE ERROR:" + e)
        }
        InstrumentRequests.retrieveInstrument(token, id, retrieveInstrumentCallback, retrieveInstrumentError);
    }

    updatePageState = (state) => {
        this.setState(state)
    }

    render() {
        let {instrument, calibrations} = this.state
        let {token, history, user, location} = this.props
        if (instrument) {
            return (
                <div>
                    <HTPNavBar user={user}
                               location={location}/>
                    <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'space-evenly', alignItems : 'center', marginLeft : 100, marginRight : 100}}>
                        <h1 style={{marginTop : 30, marginBottom : 40}}
                            className={"h1-responsive"}>
                            Instrument Details
                        </h1>
                        <Divider orientation={'horizontal'}
                                 flexItem={true}/>
                        <div style={{flex : 1, display : "flex", flexDirection : "row", justifyContent : 'space-between'}}>
                            {ModelSection(instrument.model, "You are viewing an instance of the following model:", history, true)}
                                <Divider style={{marginRight : DIVIDER_MARGINS, marginLeft : DIVIDER_MARGINS}}
                                            orientation={"vertical"}
                                            flexItem={true}/>
                            {InstrumentSection(instrument)}
                            {user.is_staff &&
                                <Divider style={{marginRight : DIVIDER_MARGINS, marginLeft : DIVIDER_MARGINS}}
                                         flexItem={true}
                                         orientation={"vertical"}/>}
                            {user.is_staff &&
                                <ActionSection token={token}
                                               subject={instrument}
                                               updatePageState={this.updatePageState}
                                               history={history}
                                               type={ModelFields.ModelTypes.INSTRUMENT}
                                                deleteFunction={InstrumentRequests.deleteInstruments}/>}
                        </div>
                    </div>
                        {instrumentCalibratable(instrument) &&
                            <CalibrationSection token={token}
                                                user={user}
                                                instrument={instrument}
                                                history={history}
                                                calibrations={calibrations}
                            />}
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}

InstrumentDetailView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    history : PropTypes.object.isRequired,
    id : PropTypes.number.isRequired
}