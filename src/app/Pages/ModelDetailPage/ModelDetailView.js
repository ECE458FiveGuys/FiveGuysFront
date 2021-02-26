import React, { Component } from "react";
import ModelRequests from "../../../controller/requests/model_requests";
import ErrorBoundary from './ErrorBoundary'
// import InstrumentSerialTable from "./InstrumentSerialTable";
import {Button, Modal} from "react-bootstrap";
// import {setModalShow} from "react-bootstrap";
import EditButton from "./EditButton";
import {useParams} from "react-router";

function GetPk () {
    let pk = useParams();
    return pk;
}

class ModelDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instruments: [],
            model: [],
            token: this.props.token,
            modalShow: false,

        }
    }



    async componentDidMount() {
        // let token = this.props.token;
        console.log(this.props.modelpk)
        let retrieveModelCallback = (model) => {
            let instruments = model['instruments']
            this.setState({instruments: instruments, model : model});
        }
        // let thing = GetPk.
        // console.log(this.props.id)
        ModelRequests.retrieveModel(this.state.token, this.props.id, retrieveModelCallback);
        // console.log(model)
    }

    setModalShow(boolean) {
        this.setState({modalShow:boolean})
    }


    render() {
        if(this.state.model!==[]) {
            return (
                <div>
                    <h1>Mode Details</h1>
                    <Button variant="primary" onClick={() => this.setModalShow(true)}>
                        Edit
                    </Button>
                    <EditButton
                        show={this.state.modalShow}
                        onHide={() => this.setModalShow(false)}
                        model={this.state.model}
                        token = {this.props.token}
                    />
                    <Button>
                        Delete
                    </Button>
                    <ul>
                        <li>
                            Vendor: {this.state.model.vendor}
                        </li>
                        <li>
                            Model Number: {this.state.model.model_number}
                        </li>
                        <li>
                            Description: {this.state.model.description}
                        </li>
                        <li>
                            Comment: {this.state.model.comment}
                        </li>
                        <li>
                            Calibration Frequency: {this.state.model.calibration_frequency}
                        </li>
                    </ul>
                    <ErrorBoundary>
                        {/*<InstrumentSerialTable instruments={this.state.instruments}/>*/}
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
    }


}
export default ModelDetailView;
