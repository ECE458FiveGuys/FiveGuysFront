import React, { Component } from "react";
import ModelRequests from "../../../../controller/requests/model_requests";

import ModelFields from "../../../../utils/enums";
import TableColumns from "../../../Common/Tables/TableUtils/Columns";
import DataTable from "../../../Common/Tables/DataTable";
import {EquipmentModel, Instrument} from "../../../../utils/ModelEnums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import HTPNavBar from "../../../Common/HTPNavBar";
import {Divider, Link} from "@material-ui/core";
import ModelSection from "../Common/ModelSection";
import ActionSection from "../Common/ActionSection";
import {handleNavClick} from "../../../utils";
import {MDBCol} from "mdbreact";
import UpdateInstrument from "../../../Common/Forms/UpdateInstrument";
import {SHORTEN_LABELS} from "../../CreateFunctions/CreateUser";
import InstrumentSection from "../Common/InstrumentSection";


const DIVIDER_MARGINS = 0

export default class ModelDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.retrieveModel()
    }

    retrieveModel = () => {
        let {token, id} = this.props
        let retrieveModelCallback = (model) => {
            model = this.fixCalibrationFrequency(model)
            let instruments = model['instruments']
            this.setState({model: model, instruments: instruments});
        }
        let retrieveInstrumentError = (e) => {
            alert("RETRIEVE ERROR:" + e)
        }
        ModelRequests.retrieveModel(token, id, retrieveModelCallback, retrieveInstrumentError);
    }

    fixCalibrationFrequency = (model) => {
        model[EquipmentModel.FIELDS.CALIBRATION_FREQUENCY] = model[EquipmentModel.FIELDS.CALIBRATION_FREQUENCY] == "00:00:00" ? undefined : model[EquipmentModel.FIELDS.CALIBRATION_FREQUENCY].split(" ")[0]
        return model
    }

    updatePageState = (modelOrInstrument) => {
        // if instances were updated with new instrument, refresh model to get new instance
        // else if model was edited, update the model in page
        if (Object.keys(modelOrInstrument).includes(ModelFields.ModelTypes.INSTRUMENT)) {
            this.retrieveModel()
        } else {
            modelOrInstrument.model = this.fixCalibrationFrequency(modelOrInstrument.model)
            this.setState(modelOrInstrument)
        }
    }

    render() {
        let {model, instruments, instrumentRows} = this.state
        let {user, location, history, token} = this.props
        if (model) {
            return (
                <div style={{height : "100%"}}>
                    <HTPNavBar user={user}
                               location={location}/>
                    <div style={{height : "100%"}}>
                        <div style={{textAlign : 'center'}}>
                            <h1 style={{marginTop: 30, marginBottom: 15}}
                                className={"h1-responsive"}>
                                Model Details
                            </h1>
                        </div>
                        <div style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: 'center',
                                    marginLeft: 100,
                                    marginRight: 100,
                                }}>
                            <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                                <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                                    {ModelSection(model, "You are viewing the following model:", history, false)}
                                    {user.groups.includes(SHORTEN_LABELS.MODEL_MANAGEMENT) &&
                                        <div style={{marginTop : 50, marginBottom : 50}}>
                                            <ActionSection token={token}
                                                           hasText={false}
                                                           hasLogo={false}
                                                           subject={model}
                                                           updatePageState={this.updatePageState}
                                                           history={history}
                                                           type={EquipmentModel.TYPE}
                                                           deleteFunction={ModelRequests.deleteModel}/>
                                        </div>}
                                </div>
                                <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 300, marginTop : 100}}
                                         orientation={"vertical"}
                                         flexItem={true}/>
                                    <InstrumentSection instruments={instruments}
                                                       user={user}
                                                       token={token}
                                                       history={history}
                                                       tableTitle={"Instances"}
                                                       tableSubtitle={"Here are the instances of this model in circulation:"}
                                                       model={model}
                                                       showCreate={true}
                                                       updatePageState={this.updatePageState}
                                                       />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}