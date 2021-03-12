import {MDBCol} from "mdbreact";
import React, {Component} from "react";
import PropTypes from "prop-types";
import "./Input.css"

export default class HTPInput extends Component {

    constructor(props) {
        super(props)
    }

    setValue(value) {
        this.inputRef.value = value
    }

    getValue() {
        return this.inputRef.value
    }


    render() {
        let {onChange, label, placeholder, type, defaultValue, style, invalid}= this.props
        return(
            <div style={style}>
                <label htmlFor="defaultFormLoginEmailEx" className="dark-grey-text">
                    {label}
                </label>
                <input type={type}
                       aria-invalid={invalid}
                       className={"form-control"}
                       placeholder={placeholder}
                       defaultValue={defaultValue}
                       ref={el => this.inputRef = el}
                       contentEditable={true}
                       onChange={event => onChange(event.target.value)}/>
                <br/>
            </div>
        )
    }
}

HTPInput.propTypes = {
    onChange : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    type : PropTypes.string,
    value : PropTypes.string,
    defaultValue : PropTypes.string,
    invalid : PropTypes.bool
}

HTPInput.defaultProps = {
    invalid : false,
    type : 'text'
}