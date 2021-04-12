import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import FormEntry from "./FormEntry";


class CustomFormView extends Component {
    constructor(props) {
        super(props);
    }

    parseFields(field) {
        if(field.type === "header") {
            return(
              <div>
                  {field.value}
              </div>
            );
        }
        if(field.type === "input") {
            let {type,prompt} = JSON.parse(field.value)

        }
        if(field.type === "text") {
            return (
            <ul>
               <li>{field.value}</li>
            </ul>
            );
        }
        return <div/>
    }

    render() {
        let parsedFields = {}
        if(this.props.fields){
            parsedFields = JSON.parse(this.props.fields)
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
                            <MDBCol md="7">
                                    {Object.keys(parsedFields).map((field) => {
                                        <div>{this.parseFields(field)}</div>
                                        }
                                    )}
                                    HELLO WORLD!
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