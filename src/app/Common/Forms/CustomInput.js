import React, {Component} from "react";
import "./FormBuilder.css";
import {Card} from "react-bootstrap";
import {MDBCol, MDBIcon, MDBRow} from "mdbreact";
import {PropTypes} from "prop-types";
import HTPMultiLineInput from "../Inputs/HTPMultiLineInput";
import HTPInput from "../Inputs/HTPInput";
import HTPAutoCompleteInput from "../Inputs/HTPAutoCompleteInput";
import HTPButton from "../HTPButton";



class CustomInput extends Component {
    constructor(props) {
        super(props);
    }

    INPUT_TYPES = {
        PLAINTEXT: 'plaintext',
        HEADER: 'header',
        INPUT: 'input'
    }

    onChange(){
        //tODO
    }

    renderInputContent() {
        let {type} = this.props
        if (type == this.INPUT_TYPES.PLAINTEXT) {
            return (
                <HTPMultiLineInput
                    onChange = {this.onChange}
                    label = {'Text:'}
                    placeholder= {'Enter Text'}
                    name = {''}
                    size = {"2"}
                    style={{width:300}}
                />
            );
        }
        if (type == this.INPUT_TYPES.HEADER) {
            return (
                <HTPInput
                    onChange = {this.onChange}
                    label = {'Header Text:'}
                    placeholder= {'Enter Text'}
                    name = {''}
                />
            );
        }
        if (type == this.INPUT_TYPES.INPUT) {
            return (
                <div>
                    <MDBRow >
                        <MDBCol>
                            <HTPInput
                                onChange = {this.onChange}
                                label = {'Label:'}
                                placeholder= {'Enter Text'}
                                name = {''}
                            />
                        </MDBCol>
                        <MDBCol>
                            <label
                                htmlFor={"input_type_selector"}
                                className="dark-grey-text form-label"
                            >
                                Input Type:
                            </label>
                            <select
                                onChange={(event)=> {this.onChange()}}
                                className="browser-default custom-select"
                                style={{width:120}}
                            >
                                <option disabled selected style={{color:'#b5b3b3'}}>- Select -</option>
                                <option>Text</option>
                                <option>Numeric</option>
                            </select>
                        </MDBCol>
                    </MDBRow>
                </div>
            );
        }
    }

    render() {
        return(
            <span className='createform' style={{display: 'inline-block',height: 150,width:425}}>
                <Card>
                    <div
                        style={{position:'absolute'}}
                    >
                        {this.renderInputContent()}
                    </div>
                    <button style={{position:'absolute',top:'0%',right:"0%",background:'transparent',border:'transparent'}}
                        onSubmit={this.props.remove}>
                        <MDBIcon icon={'times'}
                                 size={'1x'}
                        />
                    </button>
                    <MDBIcon
                        icon={'grip-lines'}
                        size={'lg'}
                        style={{position:'absolute',top:'45%',right:"5%"}}
                    />

                </Card>
            </span>
        );
    }
}
export default CustomInput

CustomInput.propTypes = {
    type : PropTypes.string.isRequired
}