import {MDBBtn, MDBCol} from "mdbreact";
import React from "react";
import PropTypes from "prop-types";
import HTPInput from "./HTPInput";

export default class HTPButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <MDBBtn color={this.props.color}
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
    disabled : PropTypes.bool
}

HTPButton.defaultProps = {
    size : 2,
    color : "green",
    disabled : false
}