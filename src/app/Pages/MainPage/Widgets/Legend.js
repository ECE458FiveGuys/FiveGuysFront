import {Component} from "react";

export class LegendElement extends Component {

    constructor(props) {
        super(props)
    }
    render() {
        return(<div style={{width: 200, justifyContent : "space-between", alignItems : "center", display: "inline-block"}}>
                <div style={{width: 20, height:20, marginRight:20, display: "inline-block", background: this.props.color}}></div>
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
        <div style={{justifyContent: "flex-end", display: "inline-flex", flexDirection: "row", alignItems: "center", marginBottom: 10}}>
            <LegendElement color={"green"}
                           value={"Calibration Stable"}></LegendElement>
            <LegendElement color={"yellow"}
                           value={"Expiring Soon"}></LegendElement>
            <LegendElement color={"red"}
                           value={"Expired"}></LegendElement>
        </div>)
    }
}