import React from "react";
import CalibrationRequests from "../../../controller/requests/calibration_requests";
import {getCurrentDate} from "../../utils";
import VisualCheckStep from "../LoadBankPage/Steps/VisualCheckStep";
import {Header} from "semantic-ui-react";
import HTPStepper from "../../Common/HTPStepper";
import {StepNameList} from "./step_utils";
import * as PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import HTPNavBar from "../../Common/HTPNavBar";

export default class KlufeWizardMain extends React.Component {

    constructor(props) {
        super(props);
    }

    onCalibrationSuccess = (stepperState, errorCallBack) => {
        let {user, token, instrumentId} = this.props
        let loadBankTableData = {
            ...stepperState.meters,
            ...(({ recordedCurrents, recordedVoltage }) => ({ recordedCurrents, recordedVoltage }))(stepperState)
        }
        let successCallback = () => {
            this.props.history.push("/instruments/" + instrumentId)
        }
        CalibrationRequests.recordCalibration(token,
            stepperState.instrument.pk,
            getCurrentDate(),
            user.id,
            stepperState.comment,
            undefined,
            loadBankTableData,
            successCallback,
            errorCallBack
        )
    }

    render() {
        let {user, token, instrumentId, location} = this.props
        let StepContentBuilders = [
            (stepperState, updateStepperState, markReadyToSubmit) => <VisualCheckStep user={user}
                                                                                      token={token}
                                                                                      instrumentId={instrumentId}
                                                                                      stepperState={stepperState}
                                                                                      updateStepperState={updateStepperState}
                                                                                      markReadyToSubmit={markReadyToSubmit}/>]

        let onStepSubmitFunctions = [
            (stepperState, successCallBack) => {successCallBack()},   // first step cannot fail, so successCallback called by default
        ]
        return (
            <div>
                <HTPNavBar
                    location={location}
                    user={user}/>
                <Header className={"h1-responsive"}
                        style={{display: 'flex', justifyContent : 'center', marginTop: 50, marginBottom: 10}}>
                    Load Bank
                </Header>
                <HTPStepper token={token}
                            user={user}
                            stepNames={StepNameList}
                            stepContent={StepContentBuilders}
                            onStepSubmit={onStepSubmitFunctions}
                            finishButtonLabel={"Save Calibration Record"}
                />
            </div>
        )
    }

}

KlufeWizardMain.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrumentId : PropTypes.number.isRequired
}