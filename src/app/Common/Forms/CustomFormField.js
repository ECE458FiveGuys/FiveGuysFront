import React, {Component} from "react";
import * as PropTypes from "prop-types";
import UpdateInstrument from "./UpdateInstrument";
import {Accordion, Button, Card} from "react-bootstrap";
import {MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import './CreateCusotmForm.css';
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";


class CustomFormField extends Component {
    constructor(props) {
        super(props);
    }

    remove() {

    }

    render() {
        let INPUTS = {
            header:
                <div>
                    <HTPMultiLineInput size={1} label={"Header Text"} placeholder={"Enter Text"} name={"Header Text"} onChange={""} style={{width:5}}/>
                </div>,
            text:
                <div>
                    <HTPMultiLineInput size={2} label={"Body Text"} placeholder={"Enter Text"} name={"Body Text"} onChange={""} style={{width:5}}/>
                </div>,
            input:
                <div>
                    <label>
                        Type
                    </label>
                    <select className="browser-default custom-select" style={{width:'115px'}}>
                        <option value={''} disabled selected>--Select--</option>
                        <option value={''}>Text</option>
                        <option value={''}>Numeric</option>
                    </select>
                    <label>
                        Prompt
                    </label>
                    <input/>
                </div>
        };
        return(
            <div className={"create-custom-form"}>
                <Card>
                    <Card.Body>
                        <MDBContainer>
                            <MDBRow>
                                <MDBCol size={11}>
                                    {(this.props.type in INPUTS) ? INPUTS[this.props.type] : "TYPE DOESNT EXIST"}
                                </MDBCol>
                                <MDBCol>
                                    <Button variant={'transparent'} onSubmit={()=>this.remove} >
                                        <MDBIcon icon={'times'} className={""} onClick={()=>this.remove}/>
                                    </Button>
                                    {this.props.dragHandle}
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
export default CustomFormField;

CustomFormField.propTypes = {
    type: PropTypes.string.isRequired
}