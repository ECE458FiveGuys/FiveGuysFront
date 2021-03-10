import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../utils/ModelEnums";
import {MDBBadge} from "mdbreact";
import React from "react";
import {handleNavClick} from "../../../../utils";

export default function InstrumentSection(instrument) {
    return(<div style={{display : "flex", flexDirection : "column", justifyContent : 'flex-start', alignItems : 'center', textAlign : 'center'}}>
                <h1 style={{marginRight : 20}}
                    className={"h2-responsive"}>
                    {"Instrument Info"}
                </h1>
                <h1 style={{textAlign : 'center'}}
                    className={"h5-responsive"}>
                    {'You are viewing the instrument with the following properties:'}
                </h1>
                <div style={{flex : 1, display : "flex", flexDirection : "row",
                        alignItems : 'center', justifyContent : 'space-between',marginTop : 20, textAlign : 'center'}}>
                    {ModelDisplay(
                        ["Model Number", "Vendor", "Asset Tag Number", "Serial Number", "Load Bank Wizard Supported?"],
                        [
                            instrument.model[ModelFields.EquipmentModelFields.MODEL_NUMBER],
                            instrument.model[ModelFields.EquipmentModelFields.VENDOR],
                            instrument[Instrument.FIELDS.ASSET_TAG],
                            instrument[Instrument.FIELDS.SERIAL_NUMBER],
                            instrument.model[ModelFields.EquipmentModelFields.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK ? "Yes" : "No"
                        ])}
                </div>
                <h1 style={{marginTop : 20}}
                    className={"h5-responsive"}>
                    Categories:
                </h1>
                <div>
                    {instrument[Instrument.FIELDS.INSTRUMENT_CATEGORIES] && instrument[Instrument.FIELDS.INSTRUMENT_CATEGORIES].map(category => {
                        return <MDBBadge style={{marginRight : 5}}
                                         color="green"
                                         pill>
                            {category.name}
                        </MDBBadge>
                    })}
                </div>
                {instrument.model[EquipmentModel.FIELDS.DESCRIPTION] &&
                <div>
                    <h1 style={{marginTop : 20}}
                        className={"h5-responsive"}>
                        Model Description:
                    </h1>
                    <text>{instrument.model[EquipmentModel.FIELDS.DESCRIPTION]}</text>
                </div>}
                {instrument[Instrument.FIELDS.COMMENT] &&
                <div>
                    <h1 style={{marginTop : 20}}
                        className={"h5-responsive"}>
                        Comment:
                    </h1>
                </div>}
                <text style={{display : "flex", flexWrap : 'wrap', flex : 1}}>{instrument[Instrument.FIELDS.COMMENT]}</text>
            </div>)
}