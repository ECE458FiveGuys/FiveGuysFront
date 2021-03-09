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
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import ModelRequests from "../../../../controller/requests/model_requests";
import DataTable from "../../../Common/Tables/DataTable";
import UpdateInstrument from "../../../Common/Forms/UpdateInstrument";

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
                <div style={{height : "100%"}}>
                    <HTPNavBar user={user}
                               location={location}/>
                    <div style={{height : "100%"}}>
                        <div style={{textAlign : 'center'}}>
                            <h1 style={{marginTop: 30, marginBottom: 40}}
                                className={"h1-responsive"}>
                                Instrument Details
                            </h1>
                        </div>
                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: 'center',
                            marginLeft: 100,
                            marginRight: 100,
                            marginBottom : 50
                        }}>
                            <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                                <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                                    {InstrumentSection(instrument, history, false)}
                                    {user.is_staff &&
                                    <div style={{marginTop : 50, marginBottom : 50}}>
                                        <ActionSection token={token}
                                                       hasText={false}
                                                       hasLogo={false}
                                                       subject={instrument}
                                                       updatePageState={this.updatePageState}
                                                       history={history}
                                                       type={Instrument.TYPE}
                                                       deleteFunction={InstrumentRequests.deleteInstruments}/>
                                    </div>}
                                </div>
                                <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 300, marginTop : 100}}
                                         orientation={"vertical"}
                                         flexItem={true}/>
                                {instrumentCalibratable(instrument) &&
                                <CalibrationSection token={token}
                                                    user={user}
                                                    instrument={instrument}
                                                    history={history}
                                                    calibrations={calibrations}
                                />}
                            </div>
                        </div>
                    </div>
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