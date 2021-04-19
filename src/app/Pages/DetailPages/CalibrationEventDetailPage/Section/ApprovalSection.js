import React from "react";
import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields, {MiscellaneousEnums} from "../../../../../utils/enums";
import HTPButton from "../../../../Common/HTPButton";
import HTPPopup from "../../../../Common/HTPPopup";
import HTPMultiLineInput from "../../../../Common/Inputs/HTPMultiLineInput";
import CalibrationRequests from "../../../../../controller/requests/calibration_requests";
import * as PropTypes from "prop-types";
import {User} from "../../../../../utils/dtos";
import {SHORTEN_LABELS} from "../../../CreateFunctions/CreateUser";

const APPROVED = "approved"
const REJECTED = "rejected"
const PENDING = "pending approval"

export default class ApprovalSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    renderApprovalOptions(approvalStatus) {
        return <div>
                    {(approvalStatus == REJECTED || approvalStatus == PENDING) &&
                        <HTPButton
                            label={"Accept"}
                            onSubmit={() => this.toggleModal(APPROVED)}/>}
                    {(approvalStatus == APPROVED || approvalStatus == PENDING) &&
                        <HTPButton
                            label={"Reject"}
                            color={"red"}
                            onSubmit={() => this.toggleModal(REJECTED)}/>}
                </div>
    }

    handleCalibration(mode, currentData) {
        let {token, user, calibrationEvent} = this.props
        let {comment} = this.state
        CalibrationRequests.handleCalibration(token, mode, calibrationEvent.pk, user.id, comment, () => {
            this.toggleModal()
                this.props.reloadCalibration()
                this.props.barRef.current.getPendingApproval()
        }, (e) => console.log(e), currentData, currentData ? currentData.pk : undefined)
    }

    toggleModal = (mode) => {
        this.setState({
            modal: !this.state.modal,
            comment : undefined,
            mode : mode ? mode == REJECTED ? REJECTED : APPROVED : undefined
        })
    }

    render() {
        let {calibrationEvent, user} = this.props
        let {modal, mode} = this.state
        let approvalData = calibrationEvent[ModelFields.CalibrationFields.ApprovalData]
        const approvalStatus = approvalData ? approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? APPROVED : REJECTED : PENDING
        return <div style={{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}}>
                    <text className={"h4-responsive"} style={{marginBottom : 20, marginTop : 20}}>
                        Approval Status
                    </text>
                    {ModelDisplay(
                        ["Approved?", "Approver Name", "Approver Username", "Approver Email", "Approval Date", "Approval Comment", "Options"],
                        [
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? "approved" : "rejected" : "pending approval",
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.APPROVER][ModelFields.UserFields.NAME] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.APPROVER][ModelFields.UserFields.USERNAME] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.APPROVER][ModelFields.UserFields.EMAIL] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.DATE] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.COMMENT] : undefined,
                            user.groups.includes(SHORTEN_LABELS.ADMINISTRATOR) || user.groups.includes(SHORTEN_LABELS.CALIBRATION_APPROVER) ?
                                this.renderApprovalOptions(approvalStatus) : undefined
                        ])}
                    <HTPPopup toggleModal={this.toggleModal}
                              message={<HTPMultiLineInput placeholder={"Your thoughts (optional)"}
                                                          label={"Leave a Comment"}
                                                          onChange={(event) => this.setState({comment : event.target.value})}/>}
                              title={mode == APPROVED ? "Approve Calibration" : "Reject Calibration"}
                              isOpen={modal}
                              additionalButtons={<HTPButton label={mode == APPROVED ? "Approve" : "Reject"}
                                                            color={mode == APPROVED ? "green" : "red"}
                                                            onSubmit={() => this.handleCalibration(mode, approvalData)}
                                                />}/>
                </div>
    }
}

ApprovalSection.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    calibrationEvent : PropTypes.object.isRequired
}