import React from "react";
import {Gradient} from "react-gradient";
import {gradients} from "../utils/styling";
import {Link} from "react-router-dom";
import Image from "../assets/hpt_logo.png";

export default class NotFound extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() { return(
        <Gradient
            className={"fill-window"}
            gradients={ gradients } // required
            property="background"
            duration={ 3000 }
            angle="45deg"
        >
            <div className={"flex-center"}
                 style={{flexDirection:"column"}}>
            <text className={"h1-responsive"}>Sorry, this page no longer exists.</text>
                <img alt="logo"
                     style={{textAlign: 'center', width: 300, margin: 50}}
                     src={Image}/>
                <Link className={"h1-responsive"}
                      style={{padding: 25}}
                      to={"/"}>Go Home</Link>
            </div>
        </Gradient>
    )}
}