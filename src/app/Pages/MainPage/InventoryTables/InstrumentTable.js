import React, {Component} from "react";
import TableColumns from "../../../Common/Tables/TableUtils/Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../../utils/enums";
import ModelRequests from "../../../../controller/requests/model_requests";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {dateColors, dateIcons, handleNavClick, parseDate} from "../../../utils";
import {InstrumentTableLegend} from "../Widgets/Legend";
import {MDBIcon} from "mdbreact";
import TableUtils from "../../../Common/Tables/TableUtils/table_utils";

export default class InstrumentTable extends Component {

    constructor(props) {
        super(props)
    }

    parseSearchResults = (results) => {
        return TableUtils.parseInstrumentTableRows(results, this.props.history)
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.INSTRUMENT_COLUMNS}
                            searchFields={ModelFields.InstrumentSearchFields}
                            token={this.props.token}
                            searchRequestFunction={InstrumentRequests.getInstrumentsWithSearchParams}
                            getAllFunction={InstrumentRequests.getAllInstruments}
                            parseSearchResultsFunction={this.parseSearchResults}
                            user={this.props.user}
                            history={this.props.history}
            >
                <InstrumentTableLegend/>
            </InventoryTable>
        );
    }
}