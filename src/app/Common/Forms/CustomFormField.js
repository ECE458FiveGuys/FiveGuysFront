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

    fieldType(type) {
        if(type === "header") {
            return (this.headerField())
        }
        if(type === "text") {
            return (this.textField())
        }
        if(type === "input") {
            return (this.inputField())
        }
    }
    headerField() {
        let {content} = this.props
        return(
            <div>
                <HTPMultiLineInput size={1} label={"Header Text"} placeholder={"Enter Text"} name={"Header Text"}
                                   onChange={(event) => this.props.onChange(this.props.id)(event)}
                                   defaultValue={content}
                />
            </div>
        )
    }

    textField() {
        let {id,content,onChange} = this.props
        return(
            <div>
                <HTPMultiLineInput size={2} label={"Body Text"} placeholder={"Enter Text"} name={"Body Text"}
                                   onChange={(event) => onChange(id)(event)}
                                   defaultValue={content}
                />
            </div>
        )
    }

    inputField() {
        let {id, onInputFieldChange} = this.props
        console.log(this.props.content)
        let content = {}
        if(this.props.content) {
        //
            content = JSON.parse(this.props.content)
        } else {
            content["type"] = "unselected"
            content["prompt"] = ""
        }


        return(
            <div>
                <label>
                    Type
                </label>
                <select
                    className="browser-default custom-select" style={{width:'115px'}}
                    onChange={(event) => onInputFieldChange(id)(event)}
                    defaultValue={content.type}
                >
                    <option value={'unselected'} disabled selected>--Select--</option>
                    <option value={'text'}>Text</option>
                    <option value={'number'}>Numeric</option>
                </select>

                <HTPMultiLineInput size={1} label={"Prompt"} placeholder={"Enter Text"} name={"Input"}
                                   onChange={(event) => onInputFieldChange(id)(event)}
                                   defaultValue={content.prompt}
                />
            </div>
        )
    }

    static INPUTS = {
        header: 'Header',
        text: 'Body Text',
        input: 'Add Input'

    };

    render() {
        return(
            <div className={"custom-form-field"}>
                <Card>
                    <Card.Body>
                            <div className="row">
                                <div className="col-10">
                                    {this.fieldType(this.props.type)}
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