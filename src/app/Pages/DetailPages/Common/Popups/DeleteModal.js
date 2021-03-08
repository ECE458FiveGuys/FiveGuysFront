import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "../FormEntry";
import ModelRequests from "../../../../../controller/requests/model_requests";
import HTPButton from "../../../../Common/HTPButton";


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
                    <Modal.Title
                        className={"text-danger"}
                        id="contained-modal-title-vcenter">
                        {'Wait up!'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{marginBottom : 20}}>
                        <text className={"h5-responsive"}>{this.props.message}</text>
                    </div>
                    <div style={{display : 'flex', flexDirection : 'row', flex : 1}}>
                        <Button onClick={this.props.onHide}>On second thought . . .</Button>
                        <HTPButton color={'red'}
                                   label={"Yes, get rid of it"}
                                onClick={this.props.deleteMethod}>
                        </HTPButton>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
export default DeleteModal;