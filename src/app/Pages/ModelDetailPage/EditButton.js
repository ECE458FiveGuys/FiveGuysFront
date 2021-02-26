import React, { Component } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import ModelRequests from "../../../controller/requests/model_requests";

class EditButton extends Component{

    constructor(props){
        super(props)
        this.state = {
            vendor: null,
            model_number: null,
            description: null,
            comment: null,
            calibration_frequency: null,
        }
    }

     onFormSubmit = async (e) => {
         // console.log("dasfdagsdadsg")
        // const formData = new FormData(e.target);
        // const formDataObj = Object.fromEntries(formData.entries());
        // console.log(formDataObj)
        // console.log(formData)
        let name = e.target.name;
        let value = e.target.value;

        this.setState({[name]:value});

        await this.submitToDb();
    }

    async submitToDb() {
        ModelRequests.editModel(this.props.token,this.props.model.pk,this.state.vendor,this.state.model_number,
            this.state.description,this.state.comment,this.state.calibration_frequency)
        console.log('msg')
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
                        Edit Model {this.props.model.model_number}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <Form >
                            <Form.Group controlId="formEditModel">
                                <Form.Label>Vendor Name</Form.Label>
                                <Form.Control name="vendor" placeholder={"Enter Vendor"}
                                              defaultValue={this.props.model.vendor} />
                            </Form.Group>
                            <Form.Group controlId="formEditModel">
                                <Form.Label>Model Number</Form.Label>
                                <Form.Control name="model_number" placeholder={"Enter Model Number"}
                                              defaultValue={this.props.model.model_number} />
                            </Form.Group>
                            <Form.Group controlId="formEditModel">
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="vendor" placeholder={"Describe the Model"}
                                              defaultValue={this.props.model.description} />
                            </Form.Group>
                            <Form.Group controlId="formEditModel">
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="vendor" placeholder={"Describe the Model"}
                                              defaultValue={this.props.model.comment} />
                            </Form.Group>
                            <Form.Group controlId="formEditModel">
                                <Form.Label>Calibration Frequency</Form.Label>
                                <Form.Control name="vendor" placeholder={"How often does the model require calibration?"}
                                              defaultValue={this.props.model.calibration_frequency} />
                                <Form.Text className="text-muted">
                                    (days/calibration)
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formIsCalabratable">
                                <Form.Check name="calabratable" label="Calabratable" />
                            </Form.Group>
                            <Button variant="primary"
                                    onSubmit={this.onFormSubmit}>
                                Submit
                            </Button>
                        </Form>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditButton;