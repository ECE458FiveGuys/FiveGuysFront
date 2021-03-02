import React from "react";
import PropTypes from "prop-types";
import LoadBankStepper from "../LoadBankStepper";
import {User} from "../../../../utils/dtos";

const levels = ["No load", "1 x 100A"]


export default class LoadStepsStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ready : false,
        }
    }

    render() {
        let {user, token} = this.props
        return (<div style={{flex: 1, display: "flex", flexDirection: "row", width : "100%", alignItems: "center", justifyContent: 'space-between', marginBottom : 30}}>
            <LoadBankStepper user={user} token={token} stepContent={[()=><div/>, ()=><div/>]} onStepSubmit={()=>{}} stepNames={levels} orientation={'vertical'}/>
        </div>)
    }

}

LoadStepsStep.propTypes = {
    instrument : PropTypes.object.isRequired,
    markReadyToSubmit : PropTypes.func.isRequired,
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}