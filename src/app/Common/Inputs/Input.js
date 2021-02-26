import {MDBCol} from "mdbreact";
import React, {Component} from "react";
import PropTypes from "prop-types";


export default class Input extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {onChange, label, placeholder, size}= this.props
        return(
            <MDBCol size={size}>
                <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                    {label}
                </label>
                <input type="text"
                       placeholder={placeholder}
                       className="form-control"
                       onChange={event => onChange(event.target.value)}/>
                <br/>
            </MDBCol>
        )
    }
}

Input.propTypes = {
    onChange : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    size : PropTypes.number,
}

Input.defaultProps = {
    size : 2
}
