import {MDBBadge} from "mdbreact";
import React from "react";
import ModelDisplay from "../../../../Common/Displays/HTPModelDisplay";
import ModelFields from "../../../../../utils/enums";
import Checkbox from "../../../../Common/Tables/TableWidgets/Checkbox";

export default function UserSection(user) {
    return(<div style={{display : "flex", flexDirection : "column", justifyContent : 'flex-start', alignItems : 'center', textAlign : 'center'}}>
        <h1 style={{textAlign : 'center'}}
            className={"h5-responsive"}>
            {'You are viewing the user with the following properties:'}
        </h1>
        <div style={{flex : 1, display : "flex", flexDirection : "row",
            alignItems : 'center', justifyContent : 'space-between',marginTop : 20, textAlign : 'center'}}>
            {ModelDisplay(
                ["Username", "Name", "Email Address", "Active"],
                [
                    user[ModelFields.UserFields.USERNAME],
                    user[ModelFields.UserFields.NAME],
                    user[ModelFields.UserFields.EMAIL],
                    user[ModelFields.UserFields.ACTIVITY] ? "yes" : "no"
                ])}
        </div>
    </div>)
}