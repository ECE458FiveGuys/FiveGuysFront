import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserSettingsPage from "./Widgets/UserSettingsPage";
import HTPNavBar from "../Common/HTPNavBar";

class UserSettingsView extends Component{



    render() {
        return(
            <div>
                <HTPNavBar
                    user={this.props.user}
                    location={this.props.location}
                />
                <UserSettingsPage
                    user={this.props.user}
                    token={this.props.token}
                />
            </div>
        )
    }
}

export default UserSettingsView