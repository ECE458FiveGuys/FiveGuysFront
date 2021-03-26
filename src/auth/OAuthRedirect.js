import React from "react";
import PropTypes from "prop-types";
import LoginRequests from "../controller/requests/login_requests";
import Loading from "../app/Common/Images/Loading";
import {loginCallBack} from "./auth_utils";
import {gradients} from "../utils/styling";
import {Gradient} from "react-gradient";

export default class OAuthRedirect extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        LoginRequests.retrieveOAuthToken(this.props.code,
            loginCallBack(this),
            (errorMessage) => {
                alert(errorMessage)
            })
    }

    render() {
        return <Gradient
                    className={"fill-window"}
                    gradients={ gradients } // required
                    property="background"
                    duration={ 3000 }
                    angle="45deg"
                    style={{display : "flex", justifyContent : 'center', alignItems : 'center'}}>
            <Loading/>
        </Gradient>
    }

}

OAuthRedirect.propTypes = {
    code : PropTypes.string.isRequired
}