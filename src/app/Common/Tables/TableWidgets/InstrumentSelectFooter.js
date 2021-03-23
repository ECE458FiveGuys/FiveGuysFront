import HTPButton from "../../HTPButton";
import React from "react";
import Footer from "./StickyFooter";
import * as PropTypes from "prop-types";
import {generateLabels} from "../../../Pages/MainPage/InventoryTables/Utils/LabelGenerator";
import Loading from "../../Images/Loading";

const DOWNLOADING_LABELS_TEXT = "downloading labels ...";
const PRINT_LABELS_TEXT = "Print Asset Tags";

export default class InstrumentSelectFooter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            printButtonEnabled : false,
            printButtonLabel : PRINT_LABELS_TEXT
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!prevProps.instrumentCount || prevProps.instrumentCount == 0) && this.props.instrumentCount > 0) {
            this.setState({printButtonEnabled : true})
        } else if ((!this.props.instrumentCount || this.props.instrumentCount == 0) && prevProps.instrumentCount > 0) {
            this.setState({printButtonEnabled : false})
        }
    }

    render() {
        return Footer(<div style={{display : "flex", alignItems : "center", justifyContent : "space-between"}}>
            <div style={{display : "flex", flexDirection : "row", justifyContent : "center", alignItems : "center"}}>
                <div style={{display : "flex", marginRight : 15, marginLeft : 15, borderRadius : "10%", background : "green", justifyContent : 'center', alignItems: 'center'}}>
                    <b style={{color : "white", fontSize : 17, marginLeft : 5, marginRight : 5}}>{this.props.instrumentCount ? this.props.instrumentCount : 0}</b>
                </div>
                <text>{`Instruments Selected`}</text>
            </div>
            <HTPButton style={{marginLeft : 30}}
                       label={this.state.printButtonEnabled ? "Print Asset Tags" : "Downloading . . ."}
                       size={"sm"}
                       disabled={!this.state.printButtonEnabled}
                       onSubmit={() => {
                           this.setState({printButtonEnabled : false, printButtonLabel: DOWNLOADING_LABELS_TEXT})

                           let getAllFunctionCallBack = (instruments) => {
                               generateLabels(instruments)
                               this.setState({printButtonEnabled : true, printButtonLabel: PRINT_LABELS_TEXT})
                           }
                           this.props.getAllFunction(getAllFunctionCallBack)
                       }}/>
            <div/>
        </div>)
    }
}

InstrumentSelectFooter.propTypes = {
    instrumentCount : PropTypes.number.isRequired,
    getAllFunction : PropTypes.func.isRequired
}