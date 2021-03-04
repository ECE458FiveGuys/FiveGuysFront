import React, { Component } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";

class EditModal extends Component{

    constructor(props){
        super(props)
        // let model = this.props.subject
        // this.state = {
        //     vendor: model['vendor'],
        //     model_number: model['model_number'],
        //     description: model['description'],
        //     comment: model['comment'],
        //     calibration_frequency: model['calibration_frequency'],
        // }
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
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MDBContainer>
                        <MDBRow style={{justifyContent: 'center', alignItems: 'center'}}>
                            <MDBCol md="5">
                                <form>
                                    <FormEntry fields = {this.props.fields}
                                               subject = {this.props.subject}
                                               handleFormChange = {this.props.handleFormChange}
                                               isEdit = {this.props.isEdit}
                                               handleDayClick = {this.props.handleDayClick}
                                    />
                                    <div className="text-center mt-4">
                                        <MDBBtn color="dark-green"
                                                onClick={this.props.submitMethod}>
                                            Submit
                                        </MDBBtn>
                                    </div>
                                </form>
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

export default EditModal;