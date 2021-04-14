import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";


class CustomFormView extends Component {
    constructor(props) {
        super(props);
    }

    parseFields(field) {
        if(field.type === "header") {
            return(
                <h1 className="mb-3">
                  {field.value}
                </h1>
            )
        }
        else if(field.type === "input") {
            let {type,prompt} = JSON.parse(field.value)
            return(
                <HTPMultiLineInput size={1} label={prompt} disabled/>
            )

        }
        else if(field.type === "text") {
            return (
                <ul>
                   <li>{field.value}</li>
                </ul>
            )
        }
    }

    render() {
        let parsedFields = []
        if(this.props.fields){
            parsedFields = JSON.parse(this.props.fields).form
        }
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
                            <MDBCol md="10">
                                    {parsedFields.map((field) =>
                                        this.parseFields(field)
                                    )}
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

export default CustomFormView