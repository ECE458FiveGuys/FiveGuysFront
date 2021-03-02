import React from "react";
import LoadBankStepper from "./LoadBankStepper";
import VisualCheckStep from "./Steps/VisualCheckStep";
import {StepNames} from "./Steps/enums";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import MeterInitStep from "./Steps/MeterInitStep";
import LoadStepsStep from "./Steps/LoadStepsStep";
import NavBar from "../../Common/NavBar";
import {Header} from "semantic-ui-react";

export default class LoadBankMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {user, token, instrumentId} = this.props
        let StepContent = [(stepperState, updateStepperState, markReadyToSubmit) => <VisualCheckStep user={user}
                                                                                              token={token}
                                                                                              instrumentId={instrumentId}
                                                                                                stepperState={stepperState}
                                                                                                updateStepperState={updateStepperState}
                                                                                                markReadyToSubmit={markReadyToSubmit}/>,
                            (stepperState, updateStepperState, markReadyToSubmit) => <MeterInitStep user={user}
                                                                                                    token={token}
                                                                                                    stepperState={stepperState}
                                                                                                    updateStepperState={updateStepperState}
                                                                                                    markReadyToSubmit={markReadyToSubmit}/>,
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

        let onStepSubmit = [(stepperState, successCallBack) => {successCallBack()},   // first step cannot fail, so successCallback called by default
                            (stepperState, successCallBack, errorMessageCallBack) =>
                                {MeterInitStep.onSubmit(stepperState, token, successCallBack, errorMessageCallBack)},
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
            <LoadBankStepper token={this.props.token}
                             user={this.props.user}
                             stepNames={Object.values(StepNames)}
                             stepContent={StepContent}
                             onStepSubmit={onStepSubmit}/>
            </div>
        )
    }

}

LoadBankMain.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrumentId : PropTypes.number.isRequired
}