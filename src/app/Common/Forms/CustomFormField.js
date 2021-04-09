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
        this.state = {}
    }

    headerField() {
        // console.log(this.state)
        return(
            <div>
                <HTPMultiLineInput size={1} label={"Header Text"} placeholder={"Enter Text"} name={"Header Text"}
                                   onChange={(event) => this.props.onChange(this.props.id)(event)}/>
            </div>
        )
    }

    textField() {
        // console.log(this.state)
        return(
            <div>
                <HTPMultiLineInput size={2} label={"Body Text"} placeholder={"Enter Text"} name={"Body Text"}
                                    onChange={(event) => this.props.onChange(this.props.id)(event)}/>
            </div>
        )
    }

    inputField(){
        // console.log(this.state)
        return(
            <div>
                <label>
                    Type
                </label>
                <select
                    className="browser-default custom-select" style={{width:'115px'}}
                    onChange={(event) => this.props.onInputFieldChange(this.props.id)(event)}
                >
                    <option value={'unselected'} disabled selected>--Select--</option>
                    <option value={'text'}>Text</option>
                    <option value={'number'}>Numeric</option>
                </select>

                <HTPMultiLineInput size={1} label={"Prompt"} placeholder={"Enter Text"} name={"Input"}
                                   onChange={(event) => this.props.onInputFieldChange(this.props.id)(event)}
                />
            </div>
        )
    }

    static INPUTS = {
        header: 'Header',
        text: 'Body Text',
        input: 'Add Input'

    };

    FIELDS = {
        header: this.headerField(),
        text: this.textField(),
        input: this.inputField()
    }

    render() {
        return(
            <div className={"custom-form-field"}>
                <Card>
                    <Card.Body>
                        {/*<MDBContainer>*/}
                            {/*<MDBCol>*/}
                            <div className="row">
                                <div className="col-10">
                                    {(this.props.type in this.FIELDS) ? this.FIELDS[this.props.type] : "TYPE DOESNT EXIST"}
                                </div>
                                <div className="col-2" >
                                    <div className="row">
                                    <Button type={'button'} variant={'danger'} onClick={this.props.onRemove} className={"my-button"}>
                                        <MDBIcon icon={'times'} className={"my-icon"}/>
                                    </Button>
                                    </div>
                                    <div className="row" style={{right:'0%'}}>
                                        {this.props.dragHandle}
                                    </div>
                                </div>
                            </div>
                        {/*</MDBContainer>*/}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
export default CustomFormField;

CustomFormField.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
}