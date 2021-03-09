import React from "react"
import ModelFields from "../../../../../utils/enums";
import UpdateModel from "../../../../Common/Forms/UpdateModel";
import UpdateInstrument from "../../../../Common/Forms/UpdateInstrument";
import ExportModel from "../../../../ImportExport/Widgets/ExportModel";
import PropTypes from "prop-types";
import ActionHeader from "./ActionHeader";
import ExportInstrument from "../../../../ImportExport/Widgets/ExportInstrument";

export class AdminSection extends React.Component{

    constructor(props) {
        super(props);
    }

    renderCreateButtons = () => {
        let {token, updatePageState, history, tableType} = this.props
        return (<div
            style={{display: "flex", marginLeft: 20, alignItems: "center", justifyContent: "center"}}>
            {tableType == ModelFields.ModelTypes.EQUIPMENT_MODEL ?
                <UpdateModel
                    mode={UpdateModel.CREATE_MODE}
                    token={token}
                    history={history}
                    updatePageState={updatePageState}/> :
                <UpdateInstrument
                    mode={UpdateInstrument.CREATE_MODE}
                    token={token}
                    history={history}
                    updatePageState={updatePageState}/>}
        </div>)
    }

    renderExportButtons = () => {
        let {token, tableType, searchParams} = this.props
        return (<div
            style={{display: "flex", marginLeft: 20, alignItems: "center", justifyContent: "center"}}>
            {tableType == ModelFields.ModelTypes.EQUIPMENT_MODEL ?
                <ExportModel
                    token={token}
                    searchParams={searchParams}
                /> :
                <ExportInstrument
                    token={token}
                    searchParams={searchParams}/>}
        </div>)
    }

    render() {
        return <div style={{display : 'flex', flex : 1, justifyContent : 'center', alignItems : 'center', flexDirection : 'column', textAlign : 'center'}}>
                    <h1 className={"h4-responsive"} style={{marginBottom : 20}}>
                        Admin Actions
                    </h1>
                        <div style={{display : 'flex', flexDirection : 'row'}}>
                            {this.renderExportButtons()}
                            {this.renderCreateButtons()}
                        </div>
                </div>
    }

}

AdminSection.propTypes = {
    token: PropTypes.string.isRequired,
    updatePageState: PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    tableType : PropTypes.string.isRequired,
    searchParams : PropTypes.object.isRequired
}