import {MDBCol} from "mdbreact";
import React, {Component} from "react";
import PropTypes from "prop-types";


export default class HTPInput extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {onChange, label, placeholder, size, value}= this.props
        return(
            <MDBCol size={size}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {label}
                </label>
                <input type="text"
                       placeholder={placeholder}
                       className="form-control"
                       value={value}
                       onChange={event => onChange(event.target.value)}/>
                <br/>
            </MDBCol>
        )
    }
}

HTPInput.propTypes = {
    onChange : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    size : PropTypes.number,
    value : PropTypes.string
}

HTPInput.defaultProps = {
    size : 2
}
