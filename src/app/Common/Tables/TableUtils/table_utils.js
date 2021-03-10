import {MDBIcon} from "mdbreact";
import {dateIcons, handleNavClick, parseDate} from "../../../utils";
import ModelFields from "../../../../utils/enums";
import React from "react";

export default class TableUtils {

    static categoriesToString(categories) {
        let categoryStr = ""
        categories.forEach(category => {
            categoryStr += category[ModelFields.CategoryFields.NAME] + ", "
        })
        return categoryStr === "" ? undefined : categoryStr.slice(0, -2);
    }

    static parseInstrumentTableRows = (results, history) => {
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
            delete result[ModelFields.EquipmentModelFields.VENDOR]
            delete result[ModelFields.EquipmentModelFields.MODEL_NUMBER]
            delete result[ModelFields.EquipmentModelFields.DESCRIPTION]

            // render calibration symbols:

            result[ModelFields.InstrumentFields.EXPIRATION_DATE] = calculateCalibrationExpirationElement(result)
            if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]) {
                result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Noncalibratable"
            }
            // parse categories:

            let instrument_pk = result[ModelFields.InstrumentFields.PK]
            result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])

            // make rows clickable:

            result.clickEvent = () => handleNavClick("/instruments/" + instrument_pk, history)
        })
        return results
    }
}

function createCalibrationExpirationElement(dateString, color) {
    return (<div style={{flex: 1, flexDirection: "row", display: "inline-block"}}>
        <text>{dateString}</text>
        <MDBIcon style={{marginLeft: 20, color: color}}
                 size={"2x"}
                 icon={dateIcons[color]}/>
    </div>)
}

function calculateCalibrationExpirationElement(result) {
    let expirationDateString = result[ModelFields.InstrumentFields.EXPIRATION_DATE]
    if (expirationDateString == undefined) {
        return "Noncalibratable"
    }
    let color = parseDate(expirationDateString)
    return createCalibrationExpirationElement(expirationDateString, color)
}
