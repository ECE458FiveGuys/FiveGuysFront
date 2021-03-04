import React, { Component } from "react";
import TabView from "./TabView";
import {Gradient} from "react-gradient";
import NavBar from "../../Common/NavBar";
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
        return (
            // <Gradient
            //     gradients={ gradients } // required
            //     property="background"
            //     duration={ 3000 }
            //     angle="45deg"
            // >
            <div>
            <NavBar user={this.props.user}/>
            <TabView token={this.props.token}
                     user={this.props.user}
                     modelPage={<ModelTable history={this.props.history}
                                            token={this.props.token}/>}
                     instrumentPage={<InstrumentTable token={this.props.token}
                                                      history={this.props.history}/>}
            ></TabView>
            </div>
            // </Gradient>
        );
    }
}
export default MainView;

MainView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}