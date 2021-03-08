import React, { Component } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "../FormEntry";

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
                                <form>
                                    <FormEntry fields = {this.props.fields}
                                               subject = {this.props.subject}
                                               handleInputChange = {this.props.handleInputChange}
                                               isEdit = {this.props.isEdit}
                                               handleDayClick = {this.props.handleDayClick}
                                               handleFileSelect = {this.props.handleFileSelect}
                                               modelCategories = {this.props.modelCategories}
                                               instrumentCategories = {this.props.instrumentCategories}
                                               vendors = {this.props.vendors}
                                               modelNumbers = {this.props.modelNumbers}
                                    />{this.props.error &&
                                        <div style={{marginTop : 10, display : 'flex', justifyContent : 'center', alignItems : "center"}}>
                                            <text className={'text-danger'}>
                                                {this.props.error}
                                            </text>
                                        </div>}
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