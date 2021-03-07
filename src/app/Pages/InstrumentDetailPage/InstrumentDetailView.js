import React, { Component } from "react";
import InstrumentRequests from "../../../controller/requests/instrument_requests";

import HTPNavBar from "../../Common/HTPNavBar";
import {Divider} from "@material-ui/core";
import ModelSection from "./Sections/ModelSection";
import InstrumentSection from "./Sections/InstrumentSection";
import ActionSection from "./Sections/ActionSection";
import CalibrationSection from "./Sections/CalibrationSection";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import {instrumentCalibratable} from "./utils";

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
        let {token, history, user} = this.props
        if (instrument) {
            return (
                <div>
                    <HTPNavBar user={this.props.user}></HTPNavBar>
                    <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'space-evenly', alignItems : 'center', marginLeft : 100, marginRight : 100}}>
                        <h1 style={{marginTop : 20, marginBottom : 30}}
                            className={"h1-responsive"}>
                            Instrument Details
                        </h1>
                        <Divider orientation={'horizontal'}
                                 flexItem={true}/>
                        <div style={{flex : 1, display : "flex", flexDirection : "row", justifyContent : 'space-between'}}>
                            {ModelSection(instrument)}
                                <Divider style={{marginRight : 30, marginLeft : 30}}
                                            orientation={"vertical"}
                                            flexItem={true}/>
                            {InstrumentSection(instrument, history)}
                            {user.is_staff &&
                                <Divider style={{marginRight : 30, marginLeft : 30}}
                                         flexItem={true}
                                         orientation={"vertical"}/>}
                            {user.is_staff &&
                                <ActionSection token={token}
                                               instrument={instrument}
                                               updatePageState={this.updatePageState}
                                               history={history}/>}
                        </div>
                    </div>
                        {instrumentCalibratable(instrument) &&
                            <Divider style={{marginTop: 30, marginBottom: 30}}
                                         orientation={"horizontal"}/>}
                        {instrumentCalibratable(instrument) &&
                            <CalibrationSection token={token}
                                                user={user}
                                                instrument={instrument}
                                                history={history}
                                                calibrations={calibrations}
                            />}
                </div>


            );
        }
        else {
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