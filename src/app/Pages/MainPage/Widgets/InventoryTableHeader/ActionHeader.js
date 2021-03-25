import React from "react"
import ModelFields from "../../../../../utils/enums";
import UpdateModel from "../../../../Common/Forms/UpdateModel";
import UpdateInstrument from "../../../../Common/Forms/UpdateInstrument";
import ExportModel from "../../../ImportExport/Widgets/ExportModel";
import PropTypes from "prop-types";
import ExportInstrument from "../../../ImportExport/Widgets/ExportInstrument";
import {User} from "../../../../../utils/dtos";
import HTPButton from "../../../../Common/HTPButton";
import {SHORTEN_LABELS} from "../../../CreateFunctions/CreateUser";
import {EquipmentModel, Instrument} from "../../../../../utils/ModelEnums";

export class ActionHeader extends React.Component{

    constructor(props) {
        super(props);
    }

    renderCreateButtons = () => {
        let {token, updatePageState, history, tableType} = this.props
        return (<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
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
        return (<div style={{display: "flex", marginTop : 10, alignItems: "center", justifyContent: "center"}}>
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
        let {updatePageState, selectMode, user, tableType, resetSelect} = this.props
        return <div style={{display : 'flex', flex : 1, justifyContent : 'center', alignItems : 'center',
            flexDirection : 'column', textAlign : 'center', marginTop : 20, marginBottom : 20}}>
                    <h1 className={"h4-responsive"} style={{marginBottom : 10}}>
                        {"Actions"}
                    </h1>
                        {this.props.tableType == Instrument.TYPE && user.groups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT) && this.renderCreateButtons()}
                        {this.props.tableType == EquipmentModel.TYPE && user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) && this.renderCreateButtons()}
                        {this.renderExportButtons()}
                        {/*{tableType == ModelFields.ModelTypes.INSTRUMENT &&*/}
                        {/*    <div style={{marginTop : 10}}>*/}
                        {/*        <HTPButton label={selectMode ? "Unselect" : "Select"}*/}
                        {/*                   onSubmit={() => {*/}
                        {/*                       updatePageState({selectMode : !selectMode})*/}
                        {/*                       resetSelect()*/}
                        {/*                   }}/>*/}
                        {/*    </div>}*/}
                </div>
    }

}

ActionHeader.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    token: PropTypes.string.isRequired,
    updatePageState: PropTypes.func.isRequired,
    history : PropTypes.object.isRequired,
    tableType : PropTypes.string.isRequired,
    searchParams : PropTypes.object.isRequired,
    selectMode : PropTypes.bool,
    resetSelect : PropTypes.func
}

ActionHeader.defaultProps = {
    selectMode : false
}