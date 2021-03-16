import HTPButton from "../../HTPButton";
import React from "react";
import Footer from "./StickyFooter";
import * as PropTypes from "prop-types";

export default class InstrumentSelectFooter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            printButtonEnabled : false
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
                       label={"Print Asset Tags"}
                       size={"sm"}
                       disabled={!this.state.printButtonEnabled}
                       onSubmit={() => {
                           this.setState({printButtonEnabled : false})
                           let getAllFunctionCallBack = (instruments) => {
                               // TODO: print asset tags
                               this.setState({printButtonEnabled : true})
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