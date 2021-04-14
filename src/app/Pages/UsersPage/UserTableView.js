import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import UserTablePage from "../UsersPage/UserTablePage";
import HTPNavBar from "../../Common/HTPNavBar";

class UserTableView extends Component{



    render() {
        return(
            <div>
                <HTPNavBar
                    navbarColor={"green"}
                    user={this.props.user}
                    location={this.props.location}
                />
                <UserTablePage
                    history={this.props.history}
                    user={this.props.user}
                    token={this.props.token}
                />
            </div>
        )
    }
}

export default UserTableView