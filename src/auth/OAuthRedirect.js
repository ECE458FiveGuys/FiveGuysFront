import React from "react";
import PropTypes from "prop-types";
import LoginRequests from "../controller/requests/login_requests";

export default class OAuthRedirect extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        LoginRequests.retrieveOAuthToken(this.props.code,
            (json) => {
            this.setState({result : json})
            },
            (errorMessage) => alert(errorMessage))
    }

    render() {
        return <div>{this.props.code}</div>
    }

}

OAuthRedirect.propTypes = {
    code : PropTypes.string.isRequired
}