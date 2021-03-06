import React, {Component} from "react";
import {MDBIcon} from "mdbreact";
import {dateIcons} from "../../../utils";

export class LegendElement extends Component {

    constructor(props) {
        super(props)
    }
    render() {
        return(<div style={{marginRight: 30, marginTop: 10, justifyContent : "center", textAlign : "center", alignItems : "center", display: "flex"}}>
                <MDBIcon style={{marginRight : 10, color: this.props.color}}
                         size={"2x"}
                         icon={dateIcons[this.props.color]}/>
                {this.props.value}
            </div>)
    }
}

export class InstrumentTableLegend extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
        <div style={{justifyContent: "flex-end", display: "inline-flex", flexDirection: "row", alignItems: "center", marginBottom: 30, marginTop: 20, marginLeft : 15}}>
            <LegendElement color={"green"}
                           value={"Calibration Stable"}></LegendElement>
            <LegendElement color={"orange"}
                           value={"Expiring Soon"}></LegendElement>
            <LegendElement color={"red"}
                           value={"Expired"}></LegendElement>
        </div>)
    }
}