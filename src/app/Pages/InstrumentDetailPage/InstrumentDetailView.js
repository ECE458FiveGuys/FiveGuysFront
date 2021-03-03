import React, { Component } from "react";
import {Button} from "react-bootstrap";
import EditModal from "../ModelDetailPage/EditModal";
import ErrorBoundary from "../ModelDetailPage/ErrorBoundary";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import DataTable from "../../Common/Tables/DataTable";
import TableColumns from "../MainPage/InventoryTables/Columns";
import ModelFields from "../../../utils/enums";
import DeleteModal from "../ModelDetailPage/DeleteModal";
import ModelRequests from "../../../controller/requests/model_requests";
import MiscellaneousRequests from "../../../controller/requests/miscellaneous_requests";

class InstrumentDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instrument: undefined,
            calibrations: [],
            serial_number: undefined,
            comment: undefined,
            deleteModalShow: false,
            editModelShow: false
        }
    }

    // getModelNumbers(models){
    //     let model_numbers = []
    //     for(var model in models) {
    //         model_numbers.concat(model.model_number)
    //     }
    //     return model_numbers
    // }

     componentDidMount() {
        let retrieveInstrumentCallback = (instrument) => {
            let calibrations = instrument['calibration_history']
            this.setState({calibrations : calibrations, instrument : instrument,
                serial_number : instrument["serial_number"], comment : instrument["comment"]});
        }
        let retrieveInstrumentError = (e) => {
            alert(e)
        }
        // let all_models = ModelRequests.getModels()
        // var all_model_numbers = this.getModelNumbers(all_models)
        InstrumentRequests.retrieveInstrument(this.props.token, this.props.id, retrieveInstrumentCallback,retrieveInstrumentError);//
    }

    // loadModelNumbers () {
    //     let getNumbersCallBack = (json) => {
    //         this.setState({vendors: json})
    //     }
    //     MiscellaneousRequests.getModelNumbers(this.props.token, this.state.model[ModelFields.EquipmentModelFields.VENDOR], getNumbersCallBack)
    // }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    setEditModalShow(boolean) {
        this.setState({editModalShow:boolean})
    }

    handleSubmit = (e) =>{
        this.setEditModalShow(false)
        let {serial_number,comment} = this.state
        let instrument = this.state.instrument
        let editCallback = (response) => {
            // console.log(response)
            var temp_instrument = {...this.state.instrument}
            for (var field in ModelFields.InstrumentEditFields) {
                temp_instrument[ModelFields.InstrumentEditFields[field]] = this.state[ModelFields.InstrumentEditFields[field]]
            }
            this.setState({instrument: temp_instrument})
        }
        let editError = (e) => {
            alert(e)
        }
        InstrumentRequests.editInstrument(this.props.token,instrument.pk, instrument.model['pk'],
                                            serial_number,comment,editCallback,editError)
    }

    handleFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        console.log({[name]: value})
        this.setState({[name]: value})
    }

    deleteInstrument() {
        let deleteInstrumentCallback = (model) => {
            alert("DELETE SUCCESS")
        }
        let deleteInstrumentError = (e) => {
            alert("DELETE: "+e)
        }
        ModelRequests.deleteInstrument(this.props.token, this.props.id, deleteInstrumentCallback,deleteInstrumentError);
    }

    render() {
        if(this.state.instrument) {
            return (
                <div>
                    <h1>Instrument Details</h1>
                    <Button variant="primary" onClick={() => this.setEditModalShow(true)}>
                        Edit
                    </Button>
                    <EditModal
                        show={this.state.editModalShow}
                        onHide={() => this.setEditModalShow(false)}
                        token={this.props.token}
                        submitMethod={this.handleSubmit}
                        subject={this.state.instrument}
                        fields={ModelFields.InstrumentEditFields}
                        title={"Edit Instrument " + this.state.instrument.serial_number}
                        handleFormChange={this.handleFormChange}
                    />
                    <Button variant="primary" onClick={() => this.setDeleteModalShow(true)}>
                        Delete
                    </Button>
                    <DeleteModal
                        show={this.state.deleteModalShow}
                        onHide={() => this.setDeleteModalShow(false)}
                        token = {this.props.token}
                        deleteMethod = {this.deleteInstrument}
                        message={"Are you sure you wat to remove instrument "+this.state.instrument.serial_number+"?"}

                    />
                    <Button>
                        Record Calibration
                    </Button>
                    <Button>
                        Download Calibration Certificate
                    </Button>
                    <ul>
                        <li>
                            Model:
                            <a
                                href={"/models/"+this.state.instrument.model.pk}
                            >
                                {this.state.instrument.model.model_number}
                            </a>
                        </li>
                        <li>
                            Serial Number: {this.state.instrument.serial_number}
                        </li>
                        <li>
                            Comment: {this.state.instrument.comment}
                        </li>
                    </ul>
                    {/*<ErrorBoundary>*/}
                        <DataTable columns={TableColumns.CALIBRATION_COLUMNS} token={this.props.token}
                                   rows={this.state.calibrations}/>
                    {/*</ErrorBoundary>*/}
                </div>


            );
        }
        else {
            return (<div/>);
        }
    }
}
export default InstrumentDetailView;