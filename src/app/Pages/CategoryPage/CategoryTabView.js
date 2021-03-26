import React, { Component } from "react";
import NavBar from "../../Common/HTPNavBar";
import PropTypes from "prop-types";
import CategoryPage from "./CategoryPage";
import ModelFields from "../../../utils/enums";
import TabView from "../MainPage/TabView";
import {User} from "../../../utils/dtos";
import TableColumns from "../../Common/Tables/TableUtils/Columns";
import {SHORTEN_LABELS} from "../CreateFunctions/CreateUser";

export default class CategoryTabView extends Component {

    render() {
        let {user, location, token} = this.props
        return (
            <div>
                <NavBar user={user}
                        location={location}/>
                <TabView token={token}
                         user={user}
                         modelPage={user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) ?
                                                <CategoryPage token={this.props.token}
                                                              user={this.props.user}
                                                              columns={TableColumns.CATEGORY_COLUMNS}
                                                             categoryType = {ModelFields.EquipmentModelFields.MODEL_CATEGORIES}
                                                              modelType={ModelFields.ModelTypes.EQUIPMENT_MODEL}/> : undefined}
                         instrumentPage={user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) || user.groups.includes(SHORTEN_LABELS.INSTRUMENT_MANAGEMENT) ?
                                                    <CategoryPage token={this.props.token}
                                                                   user={this.props.user}
                                                                   categoryType = {ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES}
                                                                   columns={TableColumns.CATEGORY_COLUMNS}
                                                                   modelType={ModelFields.ModelTypes.INSTRUMENT}/> : undefined}
                ></TabView>
            </div>
            // </Gradient>
        );
    }
}

CategoryTabView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}