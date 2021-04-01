import React from "react";
import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields, {MiscellaneousEnums} from "../../../../../utils/enums";
import {buildEvidenceElement} from "../../Common/utils";
import HTPButton from "../../../../Common/HTPButton";
import HTPPopup from "../../../../Common/HTPPopup";
import HTPInput from "../../../../Common/Inputs/HTPInput";
import {FormEnums} from "../../../../Common/Forms/form_enums";
import HTPMultiLineInput from "../../../../Common/Inputs/HTPMultiLineInput";
import CalibrationRequests from "../../../../../controller/requests/calibration_requests";
import * as PropTypes from "prop-types";
import {User} from "../../../../../utils/dtos";

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
                    {approvalStatus == REJECTED || approvalStatus == PENDING &&
                    <HTPButton
                        label={"Accept"}
                        onSubmit={() => this.toggleModal(APPROVED)}/>}
                    {approvalStatus == APPROVED || approvalStatus == PENDING &&
                        <HTPButton
                            label={"Reject"}
                            color={"red"}
                            onSubmit={() => this.toggleModal(REJECTED)}/>}
                </div>
    }

    handleCalibration(mode) {
        let {token, user, calibrationEvent} = this.props
        let {comment} = this.state
        CalibrationRequests.handleCalibration(token, mode, calibrationEvent.pk, user.pk, comment, this.toggleModal, (e) => alert(e))
    }

    toggleModal = (mode) => {
        this.setState({
            modal: !this.state.modal,
            comment : undefined,
            mode : mode ? mode == REJECTED ? REJECTED : APPROVED : undefined
        })
    }

    render() {
        let {calibrationEvent} = this.props
        let {modal, mode} = this.state
        let approvalData = calibrationEvent[ModelFields.CalibrationFields.ApprovalData]
        const approvalStatus = approvalData ? approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? APPROVED : REJECTED : PENDING
        return <div style={{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}}>
                    <text className={"h4-responsive"} style={{marginBottom : 20, marginTop : 20}}>
                        Approval Status
                    </text>
                    {ModelDisplay(
                        ["Approved?", "Approver", "Approval Date", "Approval Comment", "Options"],
                        [
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? "approved" : "rejected" : "pending approval",
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.APPROVER] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.DATE] : undefined,
                            approvalData ? approvalData[ModelFields.ApprovalDataFields.COMMENT] : undefined,
                            this.renderApprovalOptions(approvalStatus)
                        ])}
                    <HTPPopup toggleModal={this.toggleModal}
                              message={<HTPMultiLineInput placeholder={"Your thoughts (optional)"}
                                                          label={"Leave a Comment"}
                                                          onChange={(text) => this.setState({comment : text})}/>}
                              title={mode == APPROVED ? "Approve Calibration" : "Reject Calibration"}
                              isOpen={modal}
                              additionalButtons={<HTPButton label={mode == APPROVED ? "Approve" : "Reject"}
                                                            onSubmit={() => this.handleCalibration(mode)}
                                                />}/>
                </div>
    }
}

ApprovalSection.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    calibrationEvent : PropTypes.object.isRequired
}