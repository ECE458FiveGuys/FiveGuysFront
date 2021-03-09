import React, {Component} from "react";
import {MDBIcon} from "mdbreact";
import {dateIcons} from "../../../utils";

export class LegendElement extends Component {

    constructor(props) {
        super(props)
    }
    render() {
        return(<div style={{width: 200, marginTop: 10, justifyContent : "space-between", alignItems : "center", display: "inline-block"}}>
                <MDBIcon style={{marginRight : 20, color: this.props.color}}
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
        <div style={{justifyContent: "flex-end", display: "inline-flex", flexDirection: "row", alignItems: "center", marginBottom: 30, marginTop: 20}}>
            <LegendElement color={"green"}
                           value={"Calibration Stable"}></LegendElement>
            <LegendElement color={"orange"}
                           value={"Expiring Soon"}></LegendElement>
            <LegendElement color={"red"}
                           value={"Expired"}></LegendElement>
        </div>)
    }
}