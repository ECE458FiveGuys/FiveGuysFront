import ModelDisplay from "../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../utils/enums";
import HTPButton from "../../../Common/HTPButton";
import {MDBBadge} from "mdbreact";
import {EquipmentModel} from "../../../../utils/ModelEnums";
import React from "react";

export default function InstrumentSection(instrument, history) {
    return(<div style={{flex : 1, display : "flex", flexDirection : "column"}}>
        <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
            <h1 style={{marginTop : 20, marginBottom : 20}}
                className={"h5-responsive"}>
                {`This instrument is an instance of the model with the following properties:`}
            </h1>
            <div style={{flex : 1, display : "flex", flexDirection : "row", alignItems : 'center', justifyContent : 'space-between'}}>
                {ModelDisplay(
                    ["Model Number", "Vendor"],
                    [
                        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.MODEL_NUMBER],
                        instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.VENDOR],
                    ])}
                <div style={{flex : 1, display : "flex", justifyContent : "center", alignItems : 'center'}}>
                    <HTPButton onSubmit={() => history.push('/models/' + instrument.model.pk)}
                               label={"Go to Model"}/>
                </div>
            </div>
            <h1 style={{marginTop : 20}}
                className={"h5-responsive"}>
                Categories:
            </h1>
            <div>
                {instrument[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES].map(category => {
                    return <MDBBadge color="green"
                                     pill>
                        {category.name}
                    </MDBBadge>
                })}
            </div>
            <h1 style={{marginTop : 20}}
                className={"h5-responsive"}>
                Comment:
            </h1>
            <text>{instrument[EquipmentModel.FIELDS.COMMENT]}</text>
        </div>
    </div>)
}