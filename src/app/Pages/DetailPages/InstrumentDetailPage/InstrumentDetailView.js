import React, { Component } from "react";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";

import HTPNavBar from "../../../Common/HTPNavBar";
import {Divider} from "@material-ui/core";
import ActionSection from "../Common/ActionSection";
import CalibrationSection from "./Sections/Calibration/CalibrationSection";
import PropTypes from "prop-types";
import {User} from "../../../../utils/dtos";
import {instrumentCalibratable} from "./utils";
import InstrumentSection from "./Sections/InstrumentSection";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import HTPButton from "../../../Common/HTPButton";
import {handleNavClick} from "../../../utils";
import {SHORTEN_LABELS} from "../../CreateFunctions/CreateUser";

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
                    <div style={{flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: 'center',
                                marginLeft: 100,
                                marginRight: 100}}>
                        <div style={{textAlign : 'center'}}>
                            <h1 style={{marginTop: 25, marginBottom: 20}}
                                className={"h1-responsive"}>
                                Instrument Details
                            </h1>
                        </div>
                            <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                                <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'flex-start'}}>
                                    {InstrumentSection(instrument)}
                                    {user.groups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT) || user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR) &&
                                    <div style={{marginTop : 30}}>
                                        <ActionSection token={token}
                                                       hasText={false}
                                                       hasLogo={false}
                                                       subject={instrument}
                                                       updatePageState={this.updatePageState}
                                                       history={history}
                                                       type={Instrument.TYPE}
                                                       deleteFunction={InstrumentRequests.deleteInstruments}/>
                                    </div>}
                                    <div style={{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}}>
                                        <text className={"h4-responsive"} style={{marginBottom : 20, marginTop : 30}}>
                                            Visit the model for this instance:
                                        </text>
                                        <HTPButton
                                            onSubmit={() => handleNavClick("/models/" + instrument.model.pk , history)}
                                            color={"blue"}
                                            label={"Go to Model"}
                                            className={"form-control"}/>
                                    </div>
                                </div>
                                {instrumentCalibratable(instrument) &&
                                <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 400, marginTop : 100}}
                                         orientation={"vertical"}
                                         flexItem={true}/>}
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