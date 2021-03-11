import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    MDBIcon
} from 'mdbreact';
import CSV_Import from "./Widgets/CSV_Import";
import HTPNavBar from "../../Common/HTPNavBar";
import {Divider} from "@material-ui/core";
import Step from "../../Common/Text/Step";

class ImportExportView extends Component{


render(){
    let {user, token, location, history} = this.props
        return (
            <div>
                <HTPNavBar
                    user={user}
                    location={location}
                />
                <div style={{flex : 1, display : "flex", flexDirection : 'column', justifyContent : 'center', alignItems :'center', textAlign: 'center', marginTop : 25}}>
                    <h1 className={"h1-responsive"}>
                        {"Manage Imports"}
                    </h1>
                            <Divider horizontal={true} style={{width : 300, marginTop : 20, marginBottom : 20}}/>
                            <h1 style={{marginTop : 5, marginBottom : 25}} className={"h3-responsive"}>
                                {`Hey, ${this.props.user.getFirstName()}.`}
                            </h1>
                            <Step stepNumber={1}
                                  stepText={"First, check out this guide on import format:"}/>
                                  <a onClick={() => history.push("documentation/")}>
                                        <MDBIcon icon={"question-circle"}
                                                 style={{color : 'teal', marginTop : 15, marginBottom : 15}}
                                                 size={'2x'}/>
                                  </a>
                            <Step stepNumber={2}
                                  stepText={"Now, select your file:"}/>
                            <CSV_Import token = {token}
                                        history = {history}/>
                </div>
            </div>
        );
    }
}
export default ImportExportView

ImportExportView.propTypes = {
    token: PropTypes.string
}