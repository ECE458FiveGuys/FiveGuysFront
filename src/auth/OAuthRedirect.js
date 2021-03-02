import React from "react";
import PropTypes from "prop-types";

export default class OAuthRedirect extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>{this.props.code}</div>
    }


}

OAuthRedirect.propTypes = {
    code : PropTypes.string.isRequired
}