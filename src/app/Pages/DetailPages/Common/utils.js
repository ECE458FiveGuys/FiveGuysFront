import ModelFields from "../../../../utils/enums";
import {MDBIcon} from "mdbreact";
import FileUtils from "../../../../utils/file_utils";
import React from "react";

export function buildEvidenceElement(calibrationEvent, shortForm = false) {
    const alternativeMessage = !shortForm ? (calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] || calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile] ?
        `Calibrated using the ${calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? "load bank" : "guided hardware calibration"} 
                        wizard (download certificate to view)` : false) : calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] || calibrationEvent[ModelFields.CalibrationFields.HardwareCalibrationFile] ?
        `${calibrationEvent[ModelFields.CalibrationFields.LoadBankFile] ? "Load Bank" : "Guided Hardware"} 
                        calibrated` : false

    return calibrationEvent[ModelFields.CalibrationFields.AdditionalFile] ?
        <a target="_blank" href={calibrationEvent[ModelFields.CalibrationFields.AdditionalFile]}>
            <div style={{display : "flex", flexDirection : "row", alignItems : 'center'}}>
                <MDBIcon size={"2x"}
                         icon="file-alt" />
                <text style={{marginLeft : 10}}>
                    {FileUtils.getFileNameFromPath(calibrationEvent[ModelFields.CalibrationFields.AdditionalFile])}
                </text>
            </div>
        </a> : alternativeMessage
}