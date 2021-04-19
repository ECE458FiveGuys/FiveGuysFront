import React from "react";
import HTPButton from "../../Common/HTPButton";
import DataTable from "../../Common/Tables/DataTable";
import ModelFields from "../../../utils/enums";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";
import {getToken} from "../../../auth/auth_utils";
import HTPMultiLineInput from "../../Common/Inputs/HTPMultiLineInput";
import HTPPopup from "../../Common/HTPPopup";
import CalibrationRequests from "../../../controller/requests/calibration_requests";
import HTPNavBar from "../../Common/HTPNavBar";
import {createCertificate} from "../DetailPages/InstrumentDetailPage/Sections/Calibration/certificate_writer";
import InstrumentRequests from "../../../controller/requests/instrument_requests";

const APPROVED = "approved"
const REJECTED = "rejected"

export default class PendingCalibrations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.getPendingApproval()
    }

    onViewData = (calibration, pk) => {
        let finalCallBack = (inst) => (calib) => {
            createCertificate(inst, this.props.user,
                calib, this.props.token, false, true)
        }
        let callBack = (inst) => {
            CalibrationRequests.retreiveCalibrationEvent(this.props.token, calibration.pk, finalCallBack(inst), (e) => alert(e))
        }
        InstrumentRequests.retrieveInstrument(this.props.token, pk, callBack, (e) => alert(e))
    }

    parseColumns(pendingApproval) {
        return pendingApproval.map(calibration => {
                let instPk = calibration.instrument.pk
                calibration["options"] = this.renderApprovalOptions(calibration.pk)
                calibration["view_data"] = <a style={{color : "blue"}}
                                                onClick={() => this.onViewData(calibration, instPk)}>{"View Data"}</a>
                delete calibration.instrument.pk
                Object.assign(calibration, calibration.instrument)
                return calibration
            })
    }

    getPendingApproval = () => {
        MiscellaneousRequests.getPendingApproval(getToken(),
            (json) => this.setState({pendingApprovalCols : this.parseColumns(json)}),
            (error) => alert(error))
    }

    handleCalibration(mode, pk) {
        let {token, user} = this.props
        let {comment} = this.state
        CalibrationRequests.handleCalibration(token, mode, pk, user.id, comment, () => {
            this.toggleModal()
            this.getPendingApproval()
        }, (e) => alert(e))
    }

    renderApprovalOptions(calibrationEventPK) {
        return <div>
                    <HTPButton
                        label={"Accept"}
                        size={"sm"}
                        onSubmit={() => {
                            CalibrationRequests.retreiveCalibrationEvent(getToken(), calibrationEventPK,
                                (event) => this.toggleModal(APPROVED, event),
                                (error) => alert(error))
                        }}/>
                    <HTPButton
                        label={"Reject"}
                        color={"red"}
                        size={"sm"}
                        onSubmit={() => {
                            CalibrationRequests.retreiveCalibrationEvent(getToken(), calibrationEventPK,
                                (event) => this.toggleModal(REJECTED, event),
                                (error) => alert(error))
                        }}/>
                </div>
    }

    toggleModal = (mode, event) => {
        this.setState({
            modal: !this.state.modal,
            comment : undefined,
            mode : mode ? mode == REJECTED ? REJECTED : APPROVED : undefined,
            calibrationEvent : event
        })
    }

    render() {
        let {modal, calibrationEvent, pendingApprovalCols, mode} = this.state
        return  <div>
                    <HTPNavBar user={this.props.user}
                               location={this.props.location}
                               pendingApprovalNum={pendingApprovalCols ? pendingApprovalCols.length : undefined}
                    />
                    <div style={{marginTop : 20, marginRight : 100, marginLeft : 100}}>
                        <div style={{marginLeft : -15}}>
                            <header className={"h2-responsive"} style={{marginLeft : 15, marginBottom: 10}}>
                                {`Approve/Reject Calibrations`}
                            </header>
                        </div>
                        <div style={{marginTop : -10, marginBottom : -20, cursor: "pointer"}}>
                            <DataTable  disableRetreatAfterSorting={true}
                                        columns={PENDING_CALIB_COLS}
                                        rows={pendingApprovalCols}/>
                            <HTPPopup toggleModal={this.toggleModal}
                                      message={<HTPMultiLineInput placeholder={"Your thoughts (optional)"}
                                                                  label={"Leave a Comment"}
                                                                  onChange={(event) => this.setState({comment : event.target.value})}/>}
                                      title={mode == APPROVED ? "Approve Calibration" : "Reject Calibration"}
                                      isOpen={modal}
                                      additionalButtons={<HTPButton label={mode == APPROVED ? "Approve" : "Reject"}
                                                                    onSubmit={() => this.handleCalibration(mode, calibrationEvent.pk)}
                                      />}/>
                        </div>
                    </div>
                </div>
    }
}

const PENDING_CALIB_COLS = [
    {
        label: 'Asset Tag',
        field: ModelFields.InstrumentFields.ASSET_TAG,
        sort: 'asc',
        width: 150
    },
    {
        label: 'Serial Number',
        field: ModelFields.InstrumentFields.SERIAL_NUMBER,
        sort: 'asc',
        width: 150
    },
    {
        label: 'Data',
        field: 'view_data',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Options',
        field: 'options',
        sort: 'asc',
        width: 150
    },
]