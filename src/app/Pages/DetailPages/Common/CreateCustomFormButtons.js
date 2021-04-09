import React, {Component} from "react";
import {Button} from "react-bootstrap";
import SortableComponent from "../../../Common/Forms/CustomFormGenerator";
import CustomFormView from "../../../Common/Forms/CustomFormView";


class CreateCustomFormButtons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createMode:false // temporary TODO
        }
    }

    setCustomFormModalShow(boolean) {
        this.setState({customFormModalShow:boolean})
    }

    setCustomFormPreviewModalShow(boolean) {
        this.setState({customFormPreviewModalShow:boolean})
    }

    retrieveCustomForm() {

    }

    generateButtons() {
        return (
            (this.state.createMode) ? this.createModeButtons():this.editModeButtons()
        );
    }

    createModeButtons() {
        return (
            <Button variant="blue" onClick={() => this.setCustomFormModalShow(true)}>
                Create Custom Calibration Form
            </Button>
        )
    }

    editModeButtons() {
        return (
            <div>
                <Button variant="blue" onClick={() => this.setCustomFormModalShow(true)}>
                    Edit Custom Calibration Form
                </Button>
                <Button variant="blue" onClick={() => this.setCustomFormPreviewModalShow(true)}>
                    View Custom Form Preview
                </Button>
            </div>
        )
    }

    render() {
        let {token,customFormModalShow,createMode,existingFields, customFormPreviewModalShow} = this.state
        return (
            <div>
                {this.generateButtons()}
                <SortableComponent
                    show={customFormModalShow}
                    onHide={() => this.setCustomFormModalShow(false)}
                    token = {token}
                    createMode = {createMode}
                    existingFields = {existingFields}
                />
                <CustomFormView
                    show={customFormPreviewModalShow}
                    onHide={() => this.setCustomFormPreviewModalShow(false)}
                    token = {token}
                    fields = {""}
                    preview={true}
                />
            </div>
        );
    }
}

export default CreateCustomFormButtons