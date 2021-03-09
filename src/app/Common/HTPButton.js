import {MDBBtn, MDBCol} from "mdbreact";
import React from "react";
import PropTypes from "prop-types";
import HTPInput from "./Inputs/HTPInput";

export default class HTPButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <MDBBtn size={this.props.size}
                        color={this.props.color}
                        type="submit"
                        disabled={this.props.disabled}
                        onClick={this.props.onSubmit}>
                    {this.props.label}
                </MDBBtn>
        )
    }
}

HTPButton.propTypes = {
    onSubmit : PropTypes.func.isRequired,
    label : PropTypes.func.isRequired,
    color : PropTypes.string,
    disabled : PropTypes.bool,
    size : PropTypes.number
}

HTPButton.defaultProps = {
    color : "green",
    disabled : false
}