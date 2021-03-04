import React from "react";
import LoadBankStepper from "./LoadBankStepper";
import VisualCheckStep from "./Steps/VisualCheckStep";
import {StepNames} from "./Steps/enums";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import Loading from "../../Common/Images/Loading";
import MeterInitStep from "./Steps/MeterInitStep";

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
                            (stepperState) => <VisualCheckStep stepperState={stepperState}/>]

        let onStepSubmit = [() => {},
                            (stepperState, errorMessageCallBack) => {MeterInitStep.onSubmit(stepperState, token, errorMessageCallBack)},
                            (stepperState, errorMessageCallBack) => {MeterInitStep.onSubmit(stepperState, token, errorMessageCallBack)}
                            ]
        return (
            <LoadBankStepper token={this.props.token}
                             user={this.props.user}
                             stepNames={Object.values(StepNames)}
                             stepContent={StepContent}
                             onStepSubmit={onStepSubmit}/>
        )
    }

}

LoadBankMain.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrumentId : PropTypes.number.isRequired
}