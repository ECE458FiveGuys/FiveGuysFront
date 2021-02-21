import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../utils/enums";

export default class ModelTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.MODEL_COLUMNS}
                            searchFields={ModelFields.EquipmentModelSearchFields}/>
        );
    }
}