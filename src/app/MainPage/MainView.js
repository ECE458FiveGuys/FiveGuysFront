import React, { Component } from "react";
import TabView from "./TabView";
import {Gradient} from "react-gradient";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];

class MainView extends Component {

    render() {
        return (
            // <Gradient
            //     style={{marginTop: -50}}
            //     gradients={ gradients } // required
            //     property="background"
            //     duration={ 3000 }
            //     angle="45deg"
            // >
            <TabView token={this.props.token}></TabView>
            // </Gradient>
        );
    }
}
export default MainView;