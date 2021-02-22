import React, { Component } from "react";
import ModelRequests from "../../controller/requests/model_requests";
import TableColumns from "../MainPage/InventoryTables/Columns";
import { MDBDataTable } from 'mdbreact';
import ErrorBoundary from './ErrorBoundary'

class ModelDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }



    async componentDidMount() {
        let instruments = await this.parseModel();
        this.setState({instruments: instruments});
    }

    render() {
        // try {
        //     let model = this.getModel();
        //     console.log(model);
        let data = {
            columns: TableColumns.INSTRUMENT_COLUMNS,
            rows: this.state.instruments
        }

            return (
                <div>
                    <ErrorBoundary>
                        <h1>Debug</h1>
                        {/*<MDBDataTable*/}
                        {/*    autoWidth={false}*/}
                        {/*    striped*/}
                        {/*    bordered*/}
                        {/*    small*/}
                        {/*    searching={false}*/}
                        {/*    data={data}*/}
                        {/*/>*/}
                    </ErrorBoundary>
                </div>
            );

        // } catch (err) {
        //     console.log('error')
        //     return(<div><h1>Error</h1></div>);
        // }
    }

    async parseModel() {
        let token = this.props.token;
        let model = await ModelRequests.retrieve_model(token, 19);
        console.log(model)
        return model['instruments']
    }

    // async getModel() {
    //     // console.log(await ModelRequests.retrieve_model(this.props.token, 2))
    //     // return;
    //     // let token = localStorage.getItem('token')
    //     let token = this.props.token;
    //     console.log(token)
    //     return await ModelRequests.retrieve_model(token, 2);
    // }
}
export default ModelDetailView;
