import React, { Component } from "react";
import CalibrationRequests from "../../../../controller/requests/calibration_requests";
import HTPNavBar from "../../../Common/HTPNavBar";
import {SHORTEN_LABELS} from "../../CreateFunctions/CreateUser";
import ActionSection from "../Common/ActionSection";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {handleNavClick} from "../../../utils";
import HTPButton from "../../../Common/HTPButton";
import {Divider} from "@material-ui/core";
import * as PropTypes from "prop-types";
import {User} from "../../../../utils/dtos";
import CalibrationEventSection from "./Section/CalibrationEventSection";
import {getUser} from "../../../../auth/auth_utils";
import UserRequests from "../../../../controller/requests/user_requests";
import InstrumentSection from "../Common/InstrumentSection";
import ModelFields from "../../../../utils/enums";


const DIVIDER_MARGINS = 100

export default class CalibrationEventDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let {token, id} = this.props
        let retrieveUserCallBack = (user) => {
            this.state.calibrationEvent.user = user
            this.setState({calibrationEvent: this.state.calibrationEvent})
        }
        let retrieveInstrumentCallback = (instrument) => {
            this.state.calibrationEvent.instrument = instrument
            this.setState({calibrationEvent: this.state.calibrationEvent})
            UserRequests.retrieveUser(token, this.state.calibrationEvent.user, retrieveUserCallBack, (e) => alert(e))
        }
        let retrieveEventCallback = (event) => {
            this.setState({calibrationEvent : event, calibratedWith: event["calibrated_with"]}, () => {
                InstrumentRequests.retrieveInstrument(token, event.instrument, retrieveInstrumentCallback, (e) => alert(e));
            });
        }
        CalibrationRequests.retreiveCalibrationEvent(token, id, retrieveEventCallback, (e) => alert(e));
    }

    updatePageState = (state) => {
        this.setState(state)
    }

    approvalRequired = () => {
        let calibrationEvent = this.props.calibrationEvent
        return calibrationEvent && calibrationEvent.instrument && calibrationEvent.instrument.model &&
            this.props.calibrationEvent.instrument.model[ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED]
    }

    render() {
        let {calibrationEvent, calibratedWith} = this.state
        let {token, history, user, location} = this.props
        if (calibrationEvent) {
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
                                Calibration Event Details
                            </h1>
                        </div>
                        <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                            <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'flex-start'}}>
                                {CalibrationEventSection(calibrationEvent)}
                                {user.groups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT) &&
                                <div style={{marginTop : 30}}>
                                    <ActionSection token={token}
                                                   hasText={false}
                                                   hasLogo={false}
                                                   subject={calibrationEvent}
                                                   updatePageState={this.updatePageState}
                                                   history={history}
                                                   type={Instrument.TYPE}
                                                   deleteFunction={InstrumentRequests.deleteInstruments}/>
                                </div>}
                                {!this.approvalRequired() &&
                                    <div>
                                        <text className={"h4-responsive"} style={{marginBottom : 20, marginTop : 30}}>
                                            Approval Status
                                        </text>

                                        </div>
                                }
                                <div style={{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}}>
                                    <text className={"h4-responsive"} style={{marginBottom : 20, marginTop : 30}}>
                                        Visit the instrument for this event:
                                    </text>
                                    <HTPButton
                                        onSubmit={() => handleNavClick("/instruments/" + calibrationEvent.instrument.pk , history, undefined, true)}
                                        color={"blue"}
                                        label={"Go to Instrument"}
                                        className={"form-control"}/>
                                </div>
                            </div>
                            <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 400, marginTop : 100}}
                                     orientation={"vertical"}
                                     flexItem={true}/>
                            <InstrumentSection instruments={calibratedWith}
                                               token={token}
                                               tableSubtitle={"Instruments used to perform this calibration:"}
                                               tableTitle={"Calibrated With"}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}


CalibrationEventDetailView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    history : PropTypes.object.isRequired,
    id : PropTypes.number.isRequired
}