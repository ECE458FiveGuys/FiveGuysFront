import React, { Component } from "react";
import TabView from "./TabView";
import {Gradient} from "react-gradient";
import NavBar from "../../Common/HTPNavBar";
import PropTypes from "prop-types";
import {User} from "../../../utils/dtos";
import ModelTable from "./InventoryTables/ModelTable";
import InstrumentTable from "./InventoryTables/InstrumentTable";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];

class MainView extends Component {

    render() {
        let {user, location, token, history} = this.props
        return (
            <div>
                <NavBar user={user}
                        location={location}/>
                <TabView token={token}
                         user={user}
                         modelPage={<ModelTable history={history}
                                                token={token}/>}
                         instrumentPage={<InstrumentTable token={token}
                                                          history={history}/>}
                />
            </div>
        );
    }
}
export default MainView;

MainView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}