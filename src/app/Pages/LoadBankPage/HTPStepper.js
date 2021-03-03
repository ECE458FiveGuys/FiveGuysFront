
import React from "react";
import {Button, Step, StepButton, StepContent, StepIcon, StepLabel, Stepper} from "@material-ui/core";
import HTPButton from "../../Common/Inputs/HTPButton";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import HTPPopup from "../../Common/HTPPopup";

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
        this.setState({completed : {}});
    };

    submitSuccessCallBack = () => {
        const newCompleted = this.state.completed
        newCompleted[this.state.activeStep] = true
        this.setState({completed : this.state.completed, readyToSubmit : false})
        this.handleNext();
    }

    submitErrorCallBack = (errorMessage) => {
        this.setState({errorMessage : errorMessage, modal : true})
    }

    // misc :

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    renderStepContent = () => {
        let {stepNames, stepContent} = this.props
        let {activeStep, completed} = this.state
        return(<div style={{flex : 1}}>
            {this.allStepsCompleted() ? (
                <div>
                    All steps completed - you&apos;re finished
                    <Button onClick={this.handleReset}>Reset</Button>
                </div>
            ) : (
                <div style={{display : "flex",
                    flexDirection : "column",
                    alignItems: 'center'}}>
                    {this.getStepContent(activeStep)}
                    <div style={{display : 'flex', background : 'white'}}>
                        <HTPButton disabled={activeStep === 0}
                                   label={"Back"}
                                   color={"primary"}
                                   onSubmit={this.handleBack}/>
                        <HTPButton
                            disabled={!this.state.readyToSubmit}
                            onSubmit={this.handleComplete}
                            label={activeStep === this.totalSteps() - 1
                                ? "Finish"
                                : "Complete Step"}
                        />
                        {this.state.errorMessage ?
                            <HTPPopup toggleModal={this.toggleModal}
                                      message={this.state.errorMessage}
                                      className={"text-danger"}
                                      title={"Error!"}
                                      isOpen={this.state.modal}/>
                            :
                            <div/>}
                    </div>
                </div>
            )}
        </div>)
    }

    render() {
        let {stepNames, stepContent} = this.props
        let {activeStep, completed} = this.state
        return (
            <div>
                    <div style={{marginLeft : 200, justifyContent : "center", alignItems : 'center', marginRight : 200}}>
                    <Stepper nonLinear activeStep={activeStep} orientation={this.props.orientation}>
                        {stepNames.map((label, index) => (
                            <Step key={label}>
                                <StepButton
                                    onClick={this.handleStep(index)}
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
    stepContent : PropTypes.array.isRequired,
    onStepSubmit : PropTypes.array.isRequired,
    orientation : PropTypes.string
}

HTPStepper.defaultProps = {
    orientation : 'horizontal'
}