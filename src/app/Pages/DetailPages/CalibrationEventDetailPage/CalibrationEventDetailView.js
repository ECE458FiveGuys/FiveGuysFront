import React, { Component } from "react";
import CalibrationRequests from "../../../../controller/requests/calibration_requests";
import HTPNavBar from "../../../Common/HTPNavBar";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {Divider} from "@material-ui/core";
import * as PropTypes from "prop-types";
import {User} from "../../../../utils/dtos";
import CalibrationEventSection from "./Section/CalibrationEventSection";
import {getUser} from "../../../../auth/auth_utils";
import UserRequests from "../../../../controller/requests/user_requests";
import InstrumentSection from "../Common/InstrumentSection";
import ModelFields from "../../../../utils/enums";
import ApprovalSection from "./Section/ApprovalSection";


const DIVIDER_MARGINS = 100
const APPROVED = "approved"
const REJECTED = "rejected"
const PENDING = "pending approval"

export default class CalibrationEventDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.barRef = React.createRef()
    }

    componentDidMount() {
        this.loadCalibration()
    }

    loadCalibration = () => {
        let {token, id} = this.props
        let retrieveUserCallBack = (user) => {
            this.state.calibrationEvent.user = user
            this.setState({calibrationEvent: this.state.calibrationEvent})
        }
        let retrieveInstrumentCallback = (instrument) => {
            this.state.calibrationEvent.instrument = instrument
            this.setState({calibrationEvent: this.state.calibrationEvent})
            UserRequests.retrieveUser(token, this.state.calibrationEvent.user.pk, retrieveUserCallBack, (e) => alert(e))
        }
        let retrieveEventCallback = (event) => {
            this.setState({calibrationEvent : event, calibratedWith: event[ModelFields.CalibrationFields.CalibratedWith]}, () => {
                InstrumentRequests.retrieveInstrument(token, event.instrument.pk, retrieveInstrumentCallback, (e) => alert(e));
            });
        }
        CalibrationRequests.retreiveCalibrationEvent(token, id, retrieveEventCallback, (e) => alert(e));
    }

    updatePageState = (state) => {
        this.setState(state)
    }

    approvalRequired = () => {
        let calibrationEvent = this.state.calibrationEvent
        return calibrationEvent && calibrationEvent.instrument && calibrationEvent.instrument.model &&
            this.state.calibrationEvent.instrument.model[ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED]
    }

    render() {
        let {calibrationEvent, calibratedWith} = this.state
        let {token, history, user, location} = this.props
        if (calibrationEvent && calibrationEvent.instrument.pk) {
            let approvalData = calibrationEvent[ModelFields.CalibrationFields.ApprovalData]
            const approvalStatus = approvalData ? approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? APPROVED : REJECTED : PENDING
            return (
                <div style={{height : "100%"}}>
                    <HTPNavBar user={user}
                               ref={this.barRef}
                               location={location}/>
                    {this.approvalRequired() && approvalStatus != APPROVED && <div style={{backgroundColor : approvalStatus == REJECTED ? "red" : "orange", opacity : .8, display : "flex", height : 50, alignItems : "center"}}>
                        <text style={{color : "white", marginLeft : 20}}>{approvalStatus == REJECTED ? "This calibration has been rejected" : "This calibration requires approval"}</text>
                    </div>}
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
                                {CalibrationEventSection(calibrationEvent, history)}
                                {this.approvalRequired() && <Divider style={{marginTop : 30}}
                                                                      orientation={"horizontal"}
                                                                      />}
                                {this.approvalRequired() &&
                                    <ApprovalSection calibrationEvent = {calibrationEvent}
                                                     reloadCalibration = {this.loadCalibration}
                                                    user={user}
                                                     barRef={this.barRef}
                                                    token={token}/>}
                            </div>
                            <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 400, marginTop : 100}}
                                     orientation={"vertical"}
                                     flexItem={true}/>
                            <InstrumentSection instruments={calibratedWith}
                                               token={token}
                                               history={history}
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