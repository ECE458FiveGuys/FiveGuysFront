import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";
import {ReactSortable} from 'react-sortablejs';
import CustomFormField from "./CustomFormField";

class CustomForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [
                {id:1,name:<CustomFormField type={"header"}/>},
                {id:2,name:<CustomFormField type={"text"}/>},
                {id:3,name:<CustomFormField type={"input"}/>},
                {id:4,name:<CustomFormField type={"type4"}/>}
            ]
        }
    }

    addNewField = () => {
        const items = this.state.list
        let new_item = {id:5,name:<CustomFormField type={"text"}/>}
        items.push(new_item)
        this.setState({list: items})
        console.log("ADD NEW FIELD",this.state.list)
    }

    render() {
        return (
            <div>
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
                            {"Create Custom Form"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MDBContainer>
                            <MDBRow style={{justifyContent: 'center', alignItems: 'center'}}>
                                <MDBCol md="7">
                                    <div>
                                        <ReactSortable
                                            list={this.state.list}
                                            // onUpdate={(newState) => this.setState({list: newState})}
                                            setList={(newState) => {
                                                this.setState({list: newState})
                                                console.log("CALLED SET LIST",this.state.list)
                                            }}
                                        >
                                            {this.state.list.map((item) => (
                                                <div key={item ? item.id : ''}>{item ? item.name : ''}</div>
                                            ))}
                                        </ReactSortable>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.addNewField}>Add New Field</Button>
                        <Button variant={'green'} onClick={''}>Save</Button>
                        <Button variant={'blue'} onClick={this.props.onHide}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default CustomForm;