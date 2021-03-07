import React, { Component } from "react";
import NavBar from "../../Common/HTPNavBar";
import PropTypes from "prop-types";
import CategoryPage from "./CategoryPage";
import ModelFields from "../../../utils/enums";
import TabView from "../MainPage/TabView";
import {User} from "../../../utils/dtos";
import TableColumns from "../MainPage/InventoryTables/Columns";


const gradients = [
    ['#aabbf8', '#ffffff'],
    ['#a2e2ef', '#25c668'],
];

class MainView extends Component {

    render() {
        return (
            <div>
                <NavBar user={this.props.user}
                        location={this.props.location}/>
                <TabView token={this.props.token}
                         user={this.props.user}
                         modelPage={<CategoryPage token={this.props.token}
                                                  columns={TableColumns.CATEGORY_COLUMNS}
                                                 categoryType = {ModelFields.EquipmentModelFields.MODEL_CATEGORIES}
                                                  modelType={ModelFields.ModelTypes.EQUIPMENT_MODEL}/>}
                         instrumentPage={<CategoryPage token={this.props.token}
                                                       categoryType = {ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES}
                                                       columns={TableColumns.CATEGORY_COLUMNS}
                                                       modelType={ModelFields.ModelTypes.INSTRUMENT}/>}
                ></TabView>
            </div>
            // </Gradient>
        );
    }
}
export default MainView;

MainView.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired
}