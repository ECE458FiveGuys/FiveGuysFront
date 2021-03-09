import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../../utils/enums";
import {EquipmentModel, Instrument} from "../../../../../utils/ModelEnums";
import {MDBBadge} from "mdbreact";
import React from "react";

export default function InstrumentSection(instrument) {
    return (<div style={{flex : 1, display : "flex", flexDirection : "column", alignItems: 'center'}}>
                <h1 style={{marginRight : 20}}
                    className={"h3-responsive"}>
                    {"Instance Info"}
                </h1>
                <h1 style={{marginTop : 20, marginBottom : 20, textAlign : 'center'}}
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
                    {instrument[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES].map(category => {
                        return <MDBBadge style={{marginRight : 5}}
                                         color="green"
                                         pill>
                            {category.name}
                        </MDBBadge>
                    })}
                </div>
                <h1 style={{marginTop : 20}}
                    className={"h5-responsive"}>
                    Comment:
                </h1>
               <text>{instrument[Instrument.FIELDS.COMMENT]}</text>
            </div>)
}