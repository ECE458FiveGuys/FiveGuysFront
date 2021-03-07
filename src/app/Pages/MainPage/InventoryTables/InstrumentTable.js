import React, {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../../utils/enums";
import ModelRequests from "../../../../controller/requests/model_requests";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import {dateColors, dateIcons, handleNavClick, parseDate} from "../../../utils";
import {InstrumentTableLegend} from "../Widgets/Legend";
import TableUtils from "./TableUtils";
import {MDBIcon} from "mdbreact";

export default class InstrumentTable extends Component {

    constructor(props) {
        super(props)
    }

    createCalibrationExpirationElement(dateString, color) {
        return (<div style={{flex: 1, flexDirection: "row", display: "inline-block"}}>
                    <text>{dateString}</text>
                    <MDBIcon style={{marginLeft: 20, color: color}}
                             size={"2x"}
                             icon={dateIcons[color]}/>
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

    parseSearchResults = (results) => {
        results.forEach(result => {

            // raise nested model fields up to the level of instrument fields so table can read them:

            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            delete model[ModelFields.EquipmentModelFields.PK] // remove pk of model so it doesnt override instrument's
            model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToString(model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            Object.assign(result, model)

            // replace instrument model fields with their respective model__ header so they can be searched for more easily:

            result[ModelFields.InstrumentSearchFields.Vendor] = result[ModelFields.EquipmentModelFields.VENDOR]
            result[ModelFields.InstrumentSearchFields["Model Number"]] = result[ModelFields.EquipmentModelFields.MODEL_NUMBER]
            result[ModelFields.InstrumentSearchFields.Description] = result[ModelFields.EquipmentModelFields.DESCRIPTION]
            // delete result[ModelFields.EquipmentModelFields.VENDOR]
            // delete result[ModelFields.EquipmentModelFields.MODEL_NUMBER]
            // delete result[ModelFields.EquipmentModelFields.DESCRIPTION]

            // render calibration symbols:

            result[ModelFields.InstrumentFields.EXPIRATION_DATE] = this.calculateCalibrationExpirationElement(result)
            if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]) {
                result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Noncalibratable"
            }
            // parse categories:

            let instrument_pk = result[ModelFields.InstrumentFields.PK]
            result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])

            // make rows clickable:

            result.clickEvent = () => handleNavClick("/instruments/" + instrument_pk, this.props.history)
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