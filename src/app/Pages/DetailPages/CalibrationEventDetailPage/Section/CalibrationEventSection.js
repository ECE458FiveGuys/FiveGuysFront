import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../utils/ModelEnums";
import React from "react";
import {buildEvidenceElement} from "../../Common/utils";
import {handleNavClick} from "../../../../utils";

export default function CalibrationEventSection(calibrationEvent, history) {
    return(<div style={{display : "flex", flexDirection : "column", justifyContent : 'flex-start', alignItems : 'center', textAlign : 'center'}}>
        <h1 style={{marginRight : 20}}
            className={"h2-responsive"}>
            {"Calibration Event Info"}
        </h1>
        <h1 style={{textAlign : 'center'}}
            className={"h5-responsive"}>
            {'You are viewing the following calibration event:'}
        </h1>
        <div style={{flex : 1, display : "flex", flexDirection : "row",
            alignItems : 'center', justifyContent : 'space-between',marginTop : 20, textAlign : 'center'}}>
            {ModelDisplay(
                ["Instrument", "Date", "Calibrator Username", "Calibrator Name", "Additional Evidence"],
                [
                    <div
                        style={{
                            color : "blue",
                            cursor : "pointer"
                        }}
                        onClick={() => handleNavClick("/instruments/" + calibrationEvent.instrument.pk , history, undefined, true)}>
                        {calibrationEvent.instrument[ModelFields.InstrumentFields.ASSET_TAG]}
                    </div>,
                    calibrationEvent[ModelFields.CalibrationFields.Date],
                    calibrationEvent[ModelFields.CalibrationFields.User][ModelFields.UserFields.USERNAME],
                    calibrationEvent[ModelFields.CalibrationFields.User][ModelFields.UserFields.NAME],
                    buildEvidenceElement(calibrationEvent, true)
                ])}
        </div>
        {calibrationEvent[ModelFields.CalibrationFields.Comment] &&
        <div>
            <h1 style={{marginTop : 20}}
                className={"h5-responsive"}>
                Comment:
            </h1>
        </div>}
        <text style={{display : "flex", flexWrap : 'wrap', flex : 1}}>{calibrationEvent[ModelFields.CalibrationFields.Comment]}</text>
    </div>)
}