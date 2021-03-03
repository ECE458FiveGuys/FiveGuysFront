import React from "react";
import HTPStepper from "./HTPStepper";
import {StepNames} from "./Steps/step_enums";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import MeterInitStep from "./Steps/MeterInitStep";
import LoadStepsStep from "./Steps/LoadStepsStep";
import NavBar from "../../Common/NavBar";
import {Header} from "semantic-ui-react";
import VisualCheckStep from "./Steps/VisualCheckStep";

export default class LoadBankMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {user, token, instrumentId} = this.props
        let StepContentBuilders = [
                            // (stepperState, updateStepperState, markReadyToSubmit) => <VisualCheckStep user={user}
                            //                                                                   token={token}
                            //                                                                   instrumentId={instrumentId}
                            //                                                                     stepperState={stepperState}
                            //                                                                     updateStepperState={updateStepperState}
                            //                                                                     markReadyToSubmit={markReadyToSubmit}/>,
                            // (stepperState, updateStepperState, markReadyToSubmit) => <MeterInitStep user={user}
                            //                                                                         token={token}
                            //                                                                         stepperState={stepperState}
                            //                                                                         updateStepperState={updateStepperState}
                            //                                                                         markReadyToSubmit={markReadyToSubmit}/>,
                            (stepperState, updateStepperState, markReadyToSubmit) => <LoadStepsStep user={user}
                                                                                                    token={token}
                                                                                                    stepperState={stepperState}
                                                                                                    updateStepperState={updateStepperState}
                                                                                                    markReadyToSubmit={markReadyToSubmit}/>,
                            (stepperState, updateStepperState, markReadyToSubmit) => <LoadStepsStep user={user}
                                                                                                    token={token}
                                                                                                    stepperState={stepperState}
                                                                                                    updateStepperState={updateStepperState}
                                                                                                    markReadyToSubmit={markReadyToSubmit}/>]

        let onStepSubmitFunctions = [
                            // (stepperState, successCallBack) => {successCallBack()},   // first step cannot fail, so successCallback called by default
                            // (stepperState, successCallBack, errorMessageCallBack) =>
                            //     {MeterInitStep.onSubmit(stepperState, token, successCallBack, errorMessageCallBack)},
                            (stepperState, successCallBack, errorMessageCallBack) =>
                                {MeterInitStep.onSubmit(stepperState, token, successCallBack, errorMessageCallBack)},
                            (stepperState, successCallBack, errorMessageCallBack) =>
                                {MeterInitStep.onSubmit(stepperState, token, successCallBack, errorMessageCallBack)}
                            ]
        return (
            <div>
                <NavBar user={this.props.user}/>
                <Header className={"h1-responsive"}
                        style={{display: 'flex', justifyContent : 'center', marginTop: 50, marginBottom: 10}}>
                    Load Bank
                </Header>
            <HTPStepper token={this.props.token}
                        user={this.props.user}
                        stepNames={Object.values(StepNames)}
                        stepContent={StepContentBuilders}
                        onStepSubmit={onStepSubmitFunctions}/>
            </div>
        )
    }

}

LoadBankMain.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrumentId : PropTypes.number.isRequired
}