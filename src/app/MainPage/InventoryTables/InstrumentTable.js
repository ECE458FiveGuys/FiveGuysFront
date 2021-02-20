import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";

export default class InstrumentTable extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.INSTRUMENT_COLUMNS}/>
        );
    }
}