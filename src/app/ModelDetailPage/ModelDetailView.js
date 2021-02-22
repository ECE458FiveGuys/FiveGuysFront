import React, { Component } from "react";
import ModelRequests from "../../controller/requests/model_requests";
import TableColumns from "../MainPage/InventoryTables/Columns";
import { MDBDataTable } from 'mdbreact';

class ModelDetailView extends Component {

    render() {
        let data = {
            columns: TableColumns.INSTRUMENT_COLUMNS,
            rows: ModelRequests.retrieve_model('127.0.0.1:3000', this.props.token, 2)
        }
        return (
            <MDBDataTable
                autoWidth={false}
                striped
                bordered
                small
                searching={false}
                data={data}
            />
        );
    }
}
export default ModelDetailView;
