
import React from "react";
import {Button, Step, StepButton, StepContent, StepIcon, StepLabel, Stepper} from "@material-ui/core";
import HTPButton from "../HTPButton";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import HTPPopup from "../HTPPopup";
import {StepNames} from "../../Pages/LoadBankPage/Steps/step_enums";

export default class HTPStepper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep : 0,
            completed : {},
            stepperState : {},
            readyToSubmit : false,
            modal : false
        }
    }

    // Getters, setters, and checkers

    updateStepperState = (newState, callBack) => {
        let {stepperState} = this.state
        Object.assign(stepperState, newState)
        this.setState({stepperState: stepperState}, callBack)
    }

    markReadyToSubmit = () => {
        this.setState({readyToSubmit : !this.state.readyToSubmit})
    }

    getStepContent(step) {
        let {stepperState} = this.state
        let {stepContent} = this.props
        return stepContent[step](stepperState, this.updateStepperState, this.markReadyToSubmit, step)
    }

    totalSteps = () => {
        return this.props.stepNames.length;
    };

    setActiveStep(activeStep) {
        this.setState({activeStep : activeStep})
    }

    completedSteps = () => {
        return Object.keys(this.state.completed).length;
    };

    isLastStep = () => {
        return this.state.activeStep === this.totalSteps().length - 1;
    };

    allStepsCompleted = () => {
        return this.completedSteps() === this.totalSteps();
    };


    // handlers

    handleNext = () => {
        //if the steps were just completed update the master state with the cumulative state of the stepper
        if (this.allStepsCompleted()) {
            if (this.props.updateMasterState) this.props.updateMasterState(this.state.stepperState)
            this.props.onAllStepsComplete()
        }
        const newActiveStep =
            this.isLastStep() && !this.allStepsCompleted()
                ? this.props.stepNames.findIndex((step, i) => !(i in this.state.completed))
                : this.state.activeStep + 1;
        this.setActiveStep(newActiveStep);
    };

    handleBack = () => {
        this.setActiveStep(this.state.activeStep - 1);
    };

    handleStep = step => () => {
        this.setActiveStep(step);
    };

    handleComplete = () => {
        let {completed, activeStep, stepperState} = this.state
        this.props.onStepSubmit[activeStep](stepperState, this.submitSuccessCallBack, this.submitErrorCallBack, activeStep)
    };

    handleReset = () => {
        this.setActiveStep(0);
        this.setState({completed : {}, errorMessage : false, stepperState: {reset : true}, readyToSubmit : false},
            () => this.setState({stepperState : {...this.state.stepperState, ...{reset : false}}}))
    };

    submitSuccessCallBack = () => {
        const newCompleted = this.state.completed
        newCompleted[this.state.activeStep] = true
        this.setState({completed : this.state.completed, readyToSubmit : false})
        this.handleNext();
    }

    submitErrorCallBack = (errorMessage, resetSteps= false) => {
        this.setState({errorMessage : errorMessage, modal : true})
        if (resetSteps) this.handleReset()
    }

    // misc :

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    renderStepContent = () => {
        let {completeButtonLabel, finishButtonLabel, resetOptionOnError} = this.props
        let {activeStep} = this.state
        return(<div style={{flex : 1}}>
            {this.allStepsCompleted() ? (
                <div>
                    All steps completed!
                </div>
            ) : (
                <div style={{display : "flex",
                    flexDirection : "column",
                    alignItems: 'center'}}>
                    {this.getStepContent(activeStep)}
                    <div style={{display : 'flex', background : 'white'}}>
                        {/*<HTPButton disabled={activeStep === 0}*/}
                        {/*           label={"Back"}*/}
                        {/*           color={"primary"}*/}
                        {/*           onSubmit={this.handleBack}/>*/}
                        <HTPButton
                            disabled={!this.state.readyToSubmit}
                            onSubmit={this.handleComplete}
                            label={activeStep === this.totalSteps() - 1
                                ? finishButtonLabel
                                : completeButtonLabel}
                        />
                        {this.state.errorMessage ?
                            <HTPPopup toggleModal={this.toggleModal}
                                      message={this.state.errorMessage}
                                      className={"text-danger"}
                                      title={"Error!"}
                                      isOpen={this.state.modal}
                                      additionalButtons={resetOptionOnError && <HTPButton label={"Reset All Steps"}
                                                                                          color={"red"}
                                                                                          onSubmit={this.handleReset}/>}
                            />
                            :
                            <div/>}
                    </div>
                </div>
            )}
        </div>)
    }

    render() {
        let {stepNames} = this.props
        let {activeStep, completed} = this.state
        let style = {justifyContent : "center", alignItems: 'center'}
        if (stepNames[activeStep] === StepNames.LOAD_STEPS || this.props.orientation === 'vertical') style["display"] = "flex"
        return (
            <div style={style}>
                    <div style={{marginLeft : 200, marginRight : 200}}>
                    <Stepper activeStep={activeStep}
                             orientation={this.props.orientation}>
                        {stepNames.map((label, index) => (
                            <Step key={label}>
                                <StepButton
                                    disabled={true}
                                    completed={completed[index]}
                                >
                                    <text style={{alignItems : 'center', justifyContent: 'center'}}>{label}</text>
                                </StepButton>
                                {this.props.orientation === 'vertical' ?
                                    (<StepContent>
                                        {this.renderStepContent()}
                                    </StepContent>) : <div/>}
                            </Step>
                        ))}
                    </Stepper>
                        {this.props.orientation === 'horizontal' ? this.renderStepContent() : <div/>}
                    </div>
            </div>
        );
    }
}

HTPStepper.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    stepNames : PropTypes.array.isRequired,
    stepContent : PropTypes.array.isRequired,  // an array of all the content of each step
    onStepSubmit : PropTypes.array.isRequired, // an array of functions to be called on the submission of each step
    orientation : PropTypes.string, // vertical or horizontal
    updateMasterState : PropTypes.func, // a method to be called to update the parent state
    onAllStepsComplete : PropTypes.func.isRequired,
    completeButtonLabel : PropTypes.string,
    finishButtonLabel : PropTypes.string,
    resetOptionOnError : PropTypes.bool
}

HTPStepper.defaultProps = {
    orientation : 'horizontal',
    completeButtonLabel : "Complete Step",
    finishButtonLabel : "Finish",
    resetOptionOnError : false
}