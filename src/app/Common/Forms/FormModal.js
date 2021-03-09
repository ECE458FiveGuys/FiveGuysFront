import React, { Component } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";

class FormModal extends Component{

    constructor(props){
        super(props)
    }

    render() {
        return (
            <Modal
                {... this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title
                        className={"text-info"}
                        id="contained-modal-title-vcenter">
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MDBContainer>
                        <MDBRow style={{justifyContent: 'center', alignItems: 'center'}}>
                            <MDBCol md="7">
                                <div>
                                    <FormEntry formFields = {this.props.fields}
                                               subject = {this.props.subject}
                                               handleInputChange = {this.props.handleInputChange}
                                               isEdit = {this.props.isEdit}
                                               handleDayClick = {this.props.handleDayClick}
                                               handleFileSelect = {this.props.handleFileSelect}
                                               modelCategories = {this.props.modelCategories}
                                               instrumentCategories = {this.props.instrumentCategories}
                                               vendors = {this.props.vendors}
                                               modelNumbers = {this.props.modelNumbers}
                                               submitMethod = {this.props.submitMethod}
                                               generalError = {this.props.generalError}
                                               fieldErrors = {this.props.fieldErrors}
                                    />
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FormModal;