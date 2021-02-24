import React, { Component } from "react";
import TabView from "./TabView";
import {Gradient} from "react-gradient";
import NavBar from "./NavBar";
import PropTypes from "prop-types";
import {User} from "../../utils/dtos";


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
                     user={this.props.user}></TabView>
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