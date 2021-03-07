import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../utils/enums";
import {EquipmentModel} from "../../../../utils/ModelEnums";
import {MDBBadge} from "mdbreact";
import React from "react";

export default function ModelSection(instrument) {
    return (<div style={{flex : 1, display : "flex", flexDirection : "column"}}>
        <h1 style={{marginTop : 20, marginBottom : 20}}
            className={"h5-responsive"}>
            {`You are looking at the instrument with the following properties:`}
        </h1>
        {ModelDisplay(
            ["Serial Number", "Asset Tag", "Most Recent Calibration"],
            [
                instrument[ModelFields.InstrumentFields.SERIAL_NUMBER],
                instrument[ModelFields.InstrumentFields.ASSET_TAG],
                instrument[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION],
            ])}
        <h1 style={{marginTop : 20}}
            className={"h5-responsive"}>
            Categories:
        </h1>
        <div>
            {instrument[ModelFields.InstrumentFields.MODEL][EquipmentModel.FIELDS.MODEL_CATEGORIES].map(category => {
                return <MDBBadge color="green"
                                 pill>
                    {category.name}
                </MDBBadge>
            })}
        </div>
        <h1 style={{marginTop : 20}}
            className={"h5-responsive"}>
            Model Description:
        </h1>
        <text>{instrument.model[EquipmentModel.FIELDS.DESCRIPTION]}</text>
    </div>)
}