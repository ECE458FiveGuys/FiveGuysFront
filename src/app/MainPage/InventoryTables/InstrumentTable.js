import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../utils/enums";
import ModelRequests from "../../../controller/requests/model_requests";
import InstrumentRequests from "../../../controller/requests/instrument_requests";

export default class InstrumentTable extends Component {

    constructor(props) {
        super(props)
    }

    parseSearchResults = (results) => {
            results.forEach(result => {
            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            Object.assign(result, model)
        })
        return results
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.INSTRUMENT_COLUMNS}
                            searchFields={ModelFields.InstrumentSearchFields}
                            token={this.props.token}
                            searchRequestFunction={InstrumentRequests.get_instruments_with_search_params}
                            parseSearchResultsFunction={this.parseSearchResults}/>
        );
    }
}