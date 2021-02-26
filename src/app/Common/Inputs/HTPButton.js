import {MDBBtn} from "mdbreact";
import React from "react";
import PropTypes from "prop-types";
import HTPInput from "./HTPInput";

export default class HTPButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <MDBBtn color="dark-green"
                type="submit"
                onClick={this.props.onSubmit}>
            {this.props.label}
        </MDBBtn>
        )
    }
}

HTPButton.propTypes = {
    onSubmit : PropTypes.func.isRequired,
    label : PropTypes.func.isRequired
}

HTPInput.defaultProps = {
    size : 2
}