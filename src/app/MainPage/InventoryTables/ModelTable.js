import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";

export default class ModelTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.MODEL_COLUMNS}/>
        );
    }
}