import {MDBBadge, MDBListGroup, MDBListGroupItem} from "mdbreact";
import React from "react";
import {element} from "prop-types";
import {parseDate} from "../../utils";
import {Instrument} from "../../../utils/ModelEnums";

export default function ModelDisplay(listOfFieldNames, listOfFieldValues, listOfColors) {
    let InstrumentDisplay = []
    listOfColors = listOfColors ? listOfColors : listOfFieldValues.map(element => 'green')
    for (let i = 0; i < listOfFieldNames.length; i++) {
        if (listOfFieldValues[i]) {
            let color = listOfFieldNames[i] == "Calibration Expiration" ? parseDate(listOfFieldValues[i]) : "black"
                InstrumentDisplay.push(
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                    {listOfFieldNames[i]}
                    <b style={{color : color}}>
                        {listOfFieldValues[i]}
                    </b>
                </MDBListGroupItem>
            )
        }
    }
    return (<MDBListGroup style={{ width: "22rem" }}>
        {InstrumentDisplay}
    </MDBListGroup>)
}