import React from "react";
import DataTable from "../../../Common/Tables/DataTable";
import {SHORTEN_LABELS} from "../../CreateFunctions/CreateUser";
import UpdateInstrument from "../../../Common/Forms/UpdateInstrument";
import ModelFields from "../../../../utils/enums";
import {handleNavClick} from "../../../utils";

export default class InstrumentSection extends React.Component {

    constructor(props) {
        super(props);
    }

    parseInstrumentRows(instruments) {
        return instruments ? instruments.map(instrument => {
            instrument.clickEvent = () => handleNavClick("/instruments/" + instrument.pk, this.props.history, undefined, true)
            return instrument
        }) : []
    }

    render() {
        let {instruments, token, tableTitle, tableSubtitle} = this.props
        return <div style={{marginLeft : 100, marginRight : 100, textAlign : 'center', flex : 1.2}}>
            <h1 className={"h2-responsive"}>
                {tableTitle}
            </h1>
            <h1 className={"h5-responsive"}>
                {tableSubtitle}
            </h1>
            <div style={{cursor : "pointer"}}>
                <DataTable columns={MODEL_INSTRUMENT_TABLE_COLUMNS}
                           token={token}
                           rows={this.parseInstrumentRows(instruments)}/>
            </div>
        </div>
    }
}

const MODEL_INSTRUMENT_TABLE_COLUMNS =
    [
        {
            label: 'Asset Tag Number',
            field: ModelFields.InstrumentFields.ASSET_TAG,
            sort: 'int',
            width: 100
        },
        {
            label: 'Serial Number',
            field: ModelFields.InstrumentFields.SERIAL_NUMBER,
            sort: 'asc',
            width: 100
        },
    ]