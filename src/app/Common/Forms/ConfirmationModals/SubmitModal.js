import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import HTPButton from "../../HTPButton";


class SubmitModal extends Component {
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
                        // className={"text-danger"}
                        id="contained-modal-title-vcenter">
                        {'Wait up!'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{marginBottom : 20}}>
                        <text className={"h5-responsive"}>{this.props.message}</text>
                    </div>
                    <div style={{display : 'flex', flexDirection : 'row', flex : 1}}>
                        <HTPButton color={'green'}
                                   label={"Yes, I\'m ready to submit"}
                                   onSubmit={this.props.onSubmission}>
                        </HTPButton>
                        <Button onClick={this.props.onHide}>On second thought . . .</Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
export default SubmitModal;