import {MDBBadge, MDBIcon} from "mdbreact";
import {dateIcons, handleNavClick, parseDate} from "../../../utils";
import ModelFields from "../../../../utils/enums";
import React from "react";
import Checkbox from "../TableWidgets/Checkbox";

export default class TableUtils {

    static categoriesToElement(categories) {
        if (!categories) return categories
        let categoryElement = []
        categories.forEach(category => {
            categoryElement.push(<MDBBadge style = {{marginRight : 5}} color={"green"}
                                     pill>
                {category[ModelFields.CategoryFields.NAME]}
            </MDBBadge>)
        })
        return categoryElement
    }

    static parseInstrumentTableRows = (results, history, importMode = false) => {
        results.forEach(result => {

            // raise nested model fields up to the level of instrument fields so table can read them:

            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            delete model[ModelFields.EquipmentModelFields.PK] // remove pk of model so it doesnt override instrument's
            model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToElement(model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            Object.assign(result, model)

            // replace instrument model fields with their respective model__ header so they can be searched for more easily:

            result[ModelFields.InstrumentSearchFields.Vendor] = result[ModelFields.EquipmentModelFields.VENDOR]
            result[ModelFields.InstrumentSearchFields["Model Number"]] = result[ModelFields.EquipmentModelFields.MODEL_NUMBER]
            result[ModelFields.InstrumentSearchFields.Description] = result[ModelFields.EquipmentModelFields.DESCRIPTION]
            delete result[ModelFields.EquipmentModelFields.VENDOR]
            delete result[ModelFields.EquipmentModelFields.MODEL_NUMBER]
            delete result[ModelFields.EquipmentModelFields.DESCRIPTION]

            // render calibration symbols:

            if (!importMode) {
                result[ModelFields.InstrumentFields.EXPIRATION_DATE] = calculateCalibrationExpirationElement(result)
                if (result[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.NOT_CALIBRATABLE) {
                    result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Not Calibratable"
                    result[ModelFields.InstrumentFields.EXPIRATION_DATE] = "Not Calibratable"
                } else if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] || !result[ModelFields.InstrumentFields.EXPIRATION_DATE]) {
                    result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Not yet calibrated!"
                    result[ModelFields.InstrumentFields.EXPIRATION_DATE] = "Not yet calibrated!"
                }
            }

            // parse categories:

            let instrument_pk = result[ModelFields.InstrumentFields.PK]
            result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                TableUtils.categoriesToElement(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])

            // make rows clickable:

            result.clickEvent = () => handleNavClick("/instruments/" + instrument_pk, history)
        })
        return results
    }
}

function createCalibrationExpirationElement(dateString, color) {
    return (<div style={{flex: 1, flexDirection: "row", justifyContent : 'space-between', alignItems : 'center', display: "flex"}}>
                <text>{dateString}</text>
                <MDBIcon style={{color: color, marginRight : 75}}
                         size={"1x"}
                         icon={dateIcons[color]}
                />
            </div>)
}

function calculateCalibrationExpirationElement(result) {
    let expirationDateString = result[ModelFields.InstrumentFields.EXPIRATION_DATE]
    if (expirationDateString == undefined) {
        return "Not Calibratable"
    }
    let color = parseDate(expirationDateString)
    return createCalibrationExpirationElement(expirationDateString, color)
}
