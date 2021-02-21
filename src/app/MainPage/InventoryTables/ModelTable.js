import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../utils/enums";
import ModelRequests from "../../../controller/requests/model_requests";

export default class ModelTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.MODEL_COLUMNS}
                            searchFields={ModelFields.EquipmentModelSearchFields}
                            token={this.props.token}
                            searchRequestFunction={ModelRequests.get_models_with_search_params}/>
        );
    }
}