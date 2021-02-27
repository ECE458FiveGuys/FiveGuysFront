import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";
import ModelRequests from "../../../controller/requests/model_requests";


class DeleteModal extends Component {
    constructor(props) {
        super(props);

    }



    render(){
        return(
            <Modal
                {... this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.message}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={this.props.deleteMethod}>Yes</Button>
                    <Button onClick={this.props.onHide}>No</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default DeleteModal;