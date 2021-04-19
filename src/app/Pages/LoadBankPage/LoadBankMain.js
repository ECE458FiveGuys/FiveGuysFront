import React from "react";
import HTPStepper from "../../Common/Stepper/HTPStepper";
import {StepNameList, StepNames} from "./Steps/step_enums";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import MeterInitStep from "./Steps/MeterInitStep";
import LoadBankStepsStep from "./Steps/LoadBankStepsStep";
import NavBar from "../../Common/HTPNavBar";
import {Header} from "semantic-ui-react";
import VisualCheckStep from "./Steps/VisualCheckStep";
import FunctionalChecksStep from "./Steps/FunctionalChecksStep";
import CalibrationRequests from "../../../controller/requests/calibration_requests";
import {getCurrentDate} from "../../utils";
import MainView from "../MainPage/MainView";

export default class LoadBankMain extends React.Component {

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
                                                    errorCallBack,
                                                    undefined,
                                    [stepperState.meters.voltmeter.asset_tag_number,
                                                    stepperState.meters.shuntMeter.asset_tag_number]
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
                                                                                                markReadyToSubmit={markReadyToSubmit}
                                                                                                instrumentType={"load bank"}
                                                                                                />,
                            (stepperState, updateStepperState, markReadyToSubmit) => <MeterInitStep user={user}
                                                                                                    token={token}
                                                                                                    stepperState={stepperState}
                                                                                                    updateStepperState={updateStepperState}
                                                                                                    markReadyToSubmit={markReadyToSubmit}/>,
                            (stepperState, updateStepperState, markReadyToSubmit) => <LoadBankStepsStep user={user}
                                                                                                        token={token}
                                                                                                        stepperState={stepperState}
                                                                                                        updateStepperState={updateStepperState}
                                                                                                        markReadyToSubmit={markReadyToSubmit}/>,
                            (stepperState, updateStepperState, markReadyToSubmit) => <FunctionalChecksStep user={user}
                                                                                                            token={token}
                                                                                                            stepperState={stepperState}
                                                                                                            updateStepperState={updateStepperState}
                                                                                                            markReadyToSubmit={markReadyToSubmit}/>]

        let onStepSubmitFunctions = [
                            (stepperState, successCallBack) => {successCallBack()},   // first step cannot fail, so successCallback called by default
                            (stepperState, successCallBack, errorMessageCallBack) =>
                                {MeterInitStep.onSubmit(stepperState, token, successCallBack, errorMessageCallBack)},
                            (stepperState, successCallBack) => {successCallBack()},
                             (stepperState, successCallBack, errorCallBack) => this.onCalibrationSuccess(stepperState, errorCallBack)
                             ]
        return (
            <div>
                <NavBar
                        location={location}
                        user={user}/>
                <Header className={"h1-responsive"}
                        style={{display: 'flex', justifyContent : 'center', marginTop: 50, marginBottom: 10}}>
                    Load Bank Wizard
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

LoadBankMain.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrumentId : PropTypes.number.isRequired
}