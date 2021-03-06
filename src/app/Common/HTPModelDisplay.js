import {MDBBadge, MDBListGroup, MDBListGroupItem} from "mdbreact";
import React from "react";

export default function ModelDisplay(listOfFieldNames, listOfFieldValues) {
    let InstrumentDisplay = []
    for (let i = 0; i < listOfFieldNames.length; i++) {
        if (listOfFieldValues[i]) {
            InstrumentDisplay.push(
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                    {listOfFieldNames[i]}
                    <MDBBadge color="green"
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