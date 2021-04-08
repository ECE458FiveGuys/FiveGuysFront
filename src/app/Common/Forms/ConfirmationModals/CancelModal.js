import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import HTPButton from "../../HTPButton";


class CancelModal extends Component {
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
                                   label={"Yes, get rid of changes"}
                                   onSubmit={this.props.onCancel}>
                        </HTPButton>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
export default CancelModal;