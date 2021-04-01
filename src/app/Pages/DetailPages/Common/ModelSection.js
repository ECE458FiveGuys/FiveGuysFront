import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../utils/enums";
import HTPButton from "../../../Common/HTPButton";
import {MDBBadge, MDBCol} from "mdbreact";
import {EquipmentModel} from "../../../../utils/ModelEnums";
import React from "react";
import {handleNavClick} from "../../../utils";

export default function ModelSection(model, subheading, history=undefined, displayNavButton=false) {
    return(<div style={{display : "flex", flexDirection : "column", justifyContent : 'center', alignItems : 'center', textAlign : 'center'}}>
                    <h1 style={{marginRight : 20}}
                            className={"h2-responsive"}>
                            {"Model Info"}
                        </h1>
                    <h1 style={{textAlign : 'center'}}
                        className={"h5-responsive"}>
                        {subheading}
                    </h1>
                    <a  onClick={(e)=> displayNavButton ? handleNavClick("/models/" + model.pk, history) : void(0)}
                        style={{flex : 1, display : "flex", flexDirection : "row",
                            alignItems : 'center', justifyContent : 'space-between',marginTop : 20, textAlign : 'center',
                            cursor : displayNavButton ? "pointer" : "default"}}>
                        {ModelDisplay(
                            ["Model Number", "Vendor", "Calibration Frequency", "Calibration Mode", "Calibration Approval Required"],
                            [
                                model[ModelFields.EquipmentModelFields.MODEL_NUMBER],
                                model[ModelFields.EquipmentModelFields.VENDOR],
                                model[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY],
                                model[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.NOT_CALIBRATABLE ? "Not Calibratable" :
                                    (model[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK ?
                                    "Load Bank" :
                                    model[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.GUIDED_HARDWARE ?
                                        "Guided Hardware" :
                                            "Simple"),
                                model[ModelFields.EquipmentModelFields.CALIBRATION_APPROVAL_REQUIRED]
                            ])}
                    </a>
                    <h1 style={{marginTop : 20}}
                        className={"h5-responsive"}>
                        Categories:
                    </h1>
                        <div>
                            {model[EquipmentModel.FIELDS.MODEL_CATEGORIES] && model[EquipmentModel.FIELDS.MODEL_CATEGORIES].map(category => {
                                return <MDBBadge style={{marginRight : 5}}
                                                color="green"
                                                 pill>
                                    {category.name}
                                </MDBBadge>
                            })}
                        </div>
                        {model[EquipmentModel.FIELDS.DESCRIPTION] &&
                                <div>
                                    <h1 style={{marginTop : 20}}
                                        className={"h5-responsive"}>
                                        Description:
                                    </h1>
                                    <text>{model[EquipmentModel.FIELDS.DESCRIPTION]}</text>
                                </div>}
                        {model[EquipmentModel.FIELDS.COMMENT] &&
                        <div>
                            <h1 style={{marginTop : 20}}
                                className={"h5-responsive"}>
                                Comment:
                            </h1>
                        </div>}
                            <text style={{display : "flex", flexWrap : 'wrap', flex : 1}}>{model[EquipmentModel.FIELDS.COMMENT]}</text>
            </div>)
}