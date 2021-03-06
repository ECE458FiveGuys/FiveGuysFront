import {MDBCol} from "mdbreact";
import React, {Component} from "react";
import PropTypes from "prop-types";


export default class HTPInput extends Component {

    constructor(props) {
        super(props)
        // inputRef : React.createRef()
    }

    setValue(value) {
        this.inputRef.value = value
    }

    getValue() {
        return this.inputRef.value
    }


    render() {
        let {onChange, label, placeholder, size, value, type, defaultValue, style}= this.props
        return(
            <div style={style}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {label}
                </label>
                <input type={type}
                       placeholder={placeholder}
                       className="form-control"
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
    size : PropTypes.number,
    value : PropTypes.string,
    defaultValue : PropTypes.string
}

HTPInput.defaultProps = {
    size : 2,
    type : 'text'

}
