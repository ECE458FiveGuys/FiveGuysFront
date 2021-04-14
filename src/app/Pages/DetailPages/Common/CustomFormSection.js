import React, {Component} from "react";
import {Button} from "react-bootstrap";
import SortableComponent from "../../../Common/Forms/CustomFormGenerator";
import CustomFormView from "../../../Common/Forms/CustomFormView";


class CustomFormSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createMode:false, // temporary TODO
            existingFields: this.props.model.custom_form
        }
    }

    setCustomFormModalShow(boolean) {
        this.setState({customFormModalShow:boolean})
    }

    setCustomFormPreviewModalShow(boolean) {
        this.setState({customFormPreviewModalShow:boolean})
    }

    setExistingFormFields = (fields) => {
        this.setState({existingFields:fields})
    }

    retrieveCustomForm() {

    }

    generateButtons() {
        return (
            // (this.props.model.calibration_mode === ModelFields.CalibrationModes.CUSTOM_FORM) ?
                ((this.state.existingFields) ? this.editModeButtons():this.createModeButtons())

            // :
                // (<div/>)
        );
    }

    createModeButtons() {
        return (
            <div style={{marginTop : 30}}>
                <Button variant="blue"
                        size={"sm"}
                        onClick={() => this.setCustomFormModalShow(true)}>
                    Create Custom Calibration Form
                </Button>
            </div>
        )
    }

    editModeButtons() {
        return (
            <div style={{marginTop : 30}}>
                <Button variant="blue"
                        size={"sm"}
                        onClick={() => this.setCustomFormModalShow(true)}>
                    Edit Custom Calibration Form
                </Button>
                <Button variant="blue"
                        size={"sm"}
                        onClick={() => this.setCustomFormPreviewModalShow(true)}>
                    View Custom Form Preview
                </Button>
            </div>
        )
    }

    render() {
        let {customFormModalShow,createMode,existingFields, customFormPreviewModalShow} = this.state
        return (
            <div>
                {this.generateButtons()}
                <SortableComponent
                    show={customFormModalShow}
                    onHide={() => this.setCustomFormModalShow(false)}
                    token = {this.props.token}
                    createMode = {createMode}
                    existingFields = {existingFields}
                    setExistingFields={this.setExistingFormFields}
                    model = {this.props.model}
                />
                <CustomFormView
                    show={customFormPreviewModalShow}
                    onHide={() => this.setCustomFormPreviewModalShow(false)}
                    token = {this.props.token}
                    fields = {existingFields}
                    preview={true}
                />
            </div>
        );
    }
}

export default CustomFormSection