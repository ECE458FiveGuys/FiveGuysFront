import {MDBBadge, MDBListGroup, MDBListGroupItem} from "mdbreact";
import React from "react";
import {element} from "prop-types";

export default function ModelDisplay(listOfFieldNames, listOfFieldValues, listOfColors) {
    let InstrumentDisplay = []
    listOfColors = listOfColors ? listOfColors : listOfFieldValues.map(element => 'green')
    for (let i = 0; i < listOfFieldNames.length; i++) {
        if (listOfFieldValues[i]) {
            InstrumentDisplay.push(
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                    {listOfFieldNames[i]}
                    <MDBBadge color={listOfColors[i]}
                              pill>
                        {listOfFieldValues[i]}
                    </MDBBadge>
                </MDBListGroupItem>
            )
        }
    }
    return (<MDBListGroup style={{ width: "22rem" }}>
        {InstrumentDisplay}
    </MDBListGroup>)
}