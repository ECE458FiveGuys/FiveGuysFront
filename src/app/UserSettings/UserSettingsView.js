import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserSettingsPage from "./Widgets/UserSettingsPage";
import NavBar from "../Common/NavBar";

class UserSettingsView extends Component{



    render() {
        return(
            <div>
                <NavBar user={this.props.user}/>
                <MDBContainer>
                    <UserSettingsPage
                        user={this.props.user}
                        token={this.props.token}
                    />
                </MDBContainer>
            </div>
        )
    }
}

export default UserSettingsView