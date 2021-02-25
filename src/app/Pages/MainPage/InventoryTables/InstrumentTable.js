import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../../utils/enums";
import ModelRequests from "../../../../controller/requests/model_requests";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {dateColors, newTab, parseDate} from "../../../utils";
import {InstrumentTableLegend} from "../Widgets/Legend";
import TableUtils from "./TableUtils";

export default class InstrumentTable extends Component {

    constructor(props) {
        super(props)
    }

    createCalibrationExpirationElement(dateString, color) {
        return (<div style={{flex: 1, flexDirection: "row", display: "inline-block"}}>
                    <text>{dateString}</text>
                    <div style={{marginLeft: 20, background: color, width: 20, height: 20, display: "inline-block"}}></div>
                </div>)
    }

    calculateCalibrationExpirationElement(result) {
        let expirationDateString = result[ModelFields.InstrumentFields.EXPIRATION_DATE]
        if (expirationDateString == undefined) {
            return "Noncalibratable"
        }
        let color = parseDate(expirationDateString)
        return this.createCalibrationExpirationElement(expirationDateString, color)
    }

    parseSearchResults = (results, modelCategoriesIDtoName) => {
        results.forEach(result => {
            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            result[ModelFields.InstrumentFields.EXPIRATION_DATE] = this.calculateCalibrationExpirationElement(result)
            if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]) {
                result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Noncalibratable"
            }
            let instrument_pk = result[ModelFields.InstrumentFields.PK]
            result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])
            model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToString(model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES], modelCategoriesIDtoName)
            result.clickEvent = newTab("/instruments/" + instrument_pk)
            Object.assign(result, model)
        })
        return results
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.INSTRUMENT_COLUMNS}
                            searchFields={ModelFields.InstrumentSearchFields}
                            token={this.props.token}
                            searchRequestFunction={InstrumentRequests.getInstrumentsWithSearchParams}
                            parseSearchResultsFunction={this.parseSearchResults}
            >
                <InstrumentTableLegend></InstrumentTableLegend>
            </InventoryTable>
        );
    }
}