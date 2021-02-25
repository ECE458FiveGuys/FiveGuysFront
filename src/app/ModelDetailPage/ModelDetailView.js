import React, { Component } from "react";
import ModelRequests from "../../controller/requests/model_requests";
import ErrorBoundary from './ErrorBoundary'
// import InstrumentSerialTable from "./InstrumentSerialTable";
import {Button, Modal} from "react-bootstrap";
// import {setModalShow} from "react-bootstrap";
import EditButton from "./EditButton";

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
        let model = await ModelRequests.retrieve_model(this.state.token, 19);
        // console.log(model)
        let instruments = model['instruments']
        // let fields = [model['vendor'],model['model_number'],model['description'],model['comment'],model['comment']]
        this.setState({instruments: instruments});
        this.setState({model: model});
    }

    setModalShow(boolean) {
        this.setState({modalShow:boolean})
    }


    render() {
        if(this.state.model!==[]) {
            return (
                <div>
                    <h1>Model Details</h1>
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
