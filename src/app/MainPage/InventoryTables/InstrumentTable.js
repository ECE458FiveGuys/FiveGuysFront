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

    createCalibrationExpirationElement(result) {
        let expirationDate = result[ModelFields.InstrumentFields.EXPIRATION_DATE]
        if (expirationDate == undefined) {
            return "Noncalibratable"
        }
        let dateFields = expirationDate.split("-")
        let event = new Date()
        event.setFullYear(dateFields[0])
        event.setMonth(dateFields[1])
        event.setDate(dateFields[2])
        let now = Date.now()
        var thirtyDaysBeforeExpiration = new Date();
        thirtyDaysBeforeExpiration.setDate(expirationDate.getDate()-30);
        if (event < now) {
            return "Expired"
        } else if (thirtyDaysBeforeExpiration < now) {
            return "Expiring Soon"
        } else {
            return "Calibration Stable"
        }
        return <div style={{width: "100%", height: "100%", background: "palevioletred"}}>{result[ModelFields.InstrumentFields.EXPIRATION_DATE]}</div>
    }



    parseSearchResults = (results) => {
        results.forEach(result => {
            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            result[ModelFields.InstrumentFields.EXPIRATION_DATE] = this.createCalibrationExpirationElement(result)
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