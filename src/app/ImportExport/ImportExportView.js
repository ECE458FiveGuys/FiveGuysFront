import React, { Component } from "react";
import ExportModel from "./Widgets/ExportModel";
import PropTypes from "prop-types";
import TabView from "../MainPage/TabView";


class ImportExportView extends Component{


    render(){
        return (
            <div className="ImportExport">
                <ExportModel token = {this.props.token}/>
            </div>
        );
    }
}
export default ImportExportView

TabView.propTypes = {
    token: PropTypes.string
}