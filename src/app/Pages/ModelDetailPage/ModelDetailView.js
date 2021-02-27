import React, { Component } from "react";
import ModelRequests from "../../../controller/requests/model_requests";
import ErrorBoundary from './ErrorBoundary'
import {Button, Modal} from "react-bootstrap";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import ModelFields from "../../../utils/enums";



class ModelDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instruments: [],
            model: undefined,
            deleteModalShow: false,
            editModelShow: false,
            vendor: undefined,
            model_number: undefined,
            description: undefined,
            comment: undefined,
            calibration_frequency: undefined,
            model_categories: undefined,
        }

    }

    componentDidMount() {
        let retrieveModelCallback = (model) => {
            console.log(model)
            let instruments = model['instruments']
            this.setState({instruments: instruments, model : model,
                vendor: model['vendor'],model_number: model['model_number'],description: model['description'],
                comment: model['comment'],calibration_frequency: model['calibration_frequency'],});
        }
        let retrieveModelError = (e) => {

            alert("RETRIEVE: "+" "+e)
        }
        ModelRequests.retrieveModel(this.props.token, this.props.id, retrieveModelCallback,retrieveModelError);
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    setEditModalShow(boolean) {
        this.setState({editModalShow:boolean})
    }

    handleSubmit = (e) =>{
        let {vendor,model_number,description,comment,calibration_frequency,model_categories} = this.state
        let editCallback = (response) => {
            console.log(response)
        }
        let editError = (e) => {
            alert("EDIT: "+e)
        }
        ModelRequests.editModel(this.props.token,this.state.model['pk'],vendor,model_number,
            description,comment,calibration_frequency,editCallback,editError)
    }

    handleFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        console.log({[name]: value})
        this.setState({[name]: value})
    }

    deleteModel() {
        let deleteModelCallback = (model) => {
            alert("DELETE SUCCESS")
        }
        let deleteModelError = (e) => {
            alert("DELETE: "+e)
        }
        ModelRequests.deleteModel(this.props.token, this.props.id, deleteModelCallback,deleteModelError);
    }


    render() {
        if(this.state.model) {
            return (
                <div>
                    <h1>Model Details</h1>
                    <Button variant="primary" onClick={() => this.setEditModalShow(true)}>
                        Edit
                    </Button>
                    <EditModal
                        show={this.state.editModalShow}
                        onHide={() => this.setEditModalShow(false)}
                        token = {this.props.token}
                        submitMethod = {this.handleSubmit}
                        subject={this.state.model}
                        fields = {ModelFields.EquipmentModelEditFields}
                        title = {"Edit Model " + this.state.model.model_number}
                        handleFormChange = {this.handleFormChange}

                    />
                    <Button variant="primary" onClick={() => this.setDeleteModalShow(true)}>
                        Delete
                    </Button>
                    <DeleteModal
                        show={this.state.deleteModalShow}
                        onHide={() => this.setDeleteModalShow(false)}
                        token = {this.props.token}
                        deleteMethod = {this.deleteModel}
                        message={"Are you sure you wat to remove model "+this.state.model.model_number+"?"}

                    />
                    <ul>{Object.keys(ModelFields.EquipmentModelEditFields).map((field,index) => (
                        <li>
                            {field}: {this.state.model[ModelFields.EquipmentModelEditFields[field]]}
                        </li>
                        ))}
                    </ul>
                    <ErrorBoundary>
                        <ul>{this.state.instruments.map((instrument, index) => (
                            <li
                                key={instrument.pk}
                            >
                                {instrument.serial_number}
                            </li>
                        ))}
                        </ul>
                    </ErrorBoundary>
                </div>

            );
        }
        else{
            return (
                <div/>
                    );
        }

    }
}
export default ModelDetailView;
