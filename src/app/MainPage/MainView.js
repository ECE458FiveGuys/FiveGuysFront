import React, { Component } from "react";
import TabView from "./TabView";
import {Gradient} from "react-gradient";
import NavBar from "./NavBar";


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
            <NavBar/>
            <TabView token={this.props.token}></TabView>
            </div>
            // </Gradient>
        );
    }
}
export default MainView;