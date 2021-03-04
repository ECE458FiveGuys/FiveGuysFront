
import React from "react";
import NavBar from "../../Common/NavBar";
import {Header} from "semantic-ui-react";
import {Button, Step, StepButton, StepContent, StepIcon, StepLabel, Stepper} from "@material-ui/core";
import HTPButton from "../../Common/Inputs/HTPButton";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import HTPPopup from "../../Common/HTPPopup";

export default class LoadBankStepper extends React.Component {

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
        return stepContent[step](stepperState, this.updateStepperState, this.markReadyToSubmit)
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
        const newCompleted = completed
        newCompleted[activeStep] = true
        this.props.onStepSubmit[activeStep](stepperState, this.errorMessageCallBack)
        this.setState({completed : completed, readyToSubmit : false})
        this.handleNext();
    };

    handleReset = () => {
        this.setActiveStep(0);
        this.setState({completed : {}});
    };

    errorMessageCallBack = (errorMessage) => {
        this.setState({errorMessage : errorMessage}, this.toggleModal)
    }

    // misc :

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let {stepNames, stepContent} = this.props
        let {activeStep, completed} = this.state
        return (
            <div>
                <NavBar user={this.props.user}/>
                <Header className={"h1-responsive"}
                        style={{display: 'flex', justifyContent : 'center', marginTop: 50, marginBottom: 10}}>
                    Load Bank
                </Header>
                    <div style={{marginLeft : 200, marginRight : 200}}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {stepNames.map((label, index) => (
                            <Step key={label}>
                                <StepButton
                                    onClick={this.handleStep(index)}
                                    completed={completed[index]}
                                >
                                    <text style={{alignItems : 'center', justifyContent: 'center'}}>{label}</text>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
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
                                                  className={"warning-color"}
                                                  title={"Error!"}
                                                  isOpen={this.state.modal}/>
                                        :
                                        <div/>}
                                </div>
                            </div>
                        )}
                    </div>
                    </div>
            </div>
        );
    }
}

LoadBankStepper.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    stepNames : PropTypes.array.isRequired,
    stepContent : PropTypes.array.isRequired,
    onStepSubmit : PropTypes.array.isRequired,
}