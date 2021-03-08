import React, { Component } from "react";
import ModelRequests from "../../../../controller/requests/model_requests";

import ModelFields from "../../../../utils/enums";
import TableColumns from "../../MainPage/InventoryTables/Columns";
import DataTable from "../../../Common/Tables/DataTable";
import {EquipmentModel} from "../../../../utils/ModelEnums";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
import HTPNavBar from "../../../Common/HTPNavBar";
import {Divider} from "@material-ui/core";
import ModelSection from "../Common/ModelSection";
import ActionSection from "../Common/ActionSection";
import TableUtils from "../../MainPage/InventoryTables/TableUtils";
import {handleNavClick} from "../../../utils";
import {MDBCol} from "mdbreact";


const DIVIDER_MARGINS = 0

export default class ModelDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let {token, id} = this.props
        let retrieveModelCallback = (model) => {
            model = this.fixCalibrationFrequency(model)
            let instruments = model['instruments']
            let instrumentRows = instruments.map(instrument => {
                instrument.clickEvent = () => handleNavClick("/instruments/" + instrument.pk, this.props.history)
                return instrument
            })
            this.setState({model: model, instruments: instruments, instrumentRows : instrumentRows});
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

    updatePageState = (model) => {
        model.model = this.fixCalibrationFrequency(model.model)
        this.setState(model)
    }

    render() {
        let {model, instruments, instrumentRows} = this.state
        let {user, location, history, token} = this.props
        if (model) {
            return (
                <div>
                    <HTPNavBar user={user}
                               location={location}/>
                        <div style={{textAlign : 'center'}}>
                            <h1 style={{marginTop: 30, marginBottom: 40}}
                                className={"h1-responsive"}>
                                Model Details
                            </h1>
                        </div>
                        <div style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: 'center',
                                    // alignItems: 'center',
                                    marginLeft: 100,
                                    marginRight: 100
                                }}>
                            <div style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                                <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                                    {ModelSection(model, "You are viewing the following model:", history, false)}
                                    {user.is_staff &&
                                        <div style={{marginTop : 50}}>
                                    <ActionSection token={token}
                                                   hasText={false}
                                                   hasLogo={false}
                                                   subject={model}
                                                   updatePageState={this.updatePageState}
                                                   history={history}
                                                   deleteFunction={ModelRequests.deleteModel}/>
                                        </div>}
                                </div>
                                <Divider style={{marginRight: DIVIDER_MARGINS, marginLeft: DIVIDER_MARGINS, height : 300, marginTop : 100}}
                                         orientation={"vertical"}
                                         flexItem={true}/>
                                <MDBCol size={7}>
                                <div style={{marginLeft : 100, marginRight : 100, textAlign : 'center', marginTop : 50}}>
                                    <h1 className={"h2-responsive"}>
                                        Instances
                                    </h1>
                                    <h1 className={"h5-responsive"}>
                                        Here are the instances of this model in circulation:
                                    </h1>
                                        <DataTable columns={MODEL_INSTRUMENT_TABLE_COLUMNS}
                                                   token={this.props.token}
                                                   rows={instrumentRows}/>
                                </div>
                                </MDBCol>
                            </div>
                            <div style={{display : 'flex', justifyContent : 'stretch'}}>
                            </div>
                        </div>
                </div>
            )
        } else {
            return (<div/>);
        }
    }
}

const MODEL_INSTRUMENT_TABLE_COLUMNS =
    [{
        label: 'Serial Number',
        field: ModelFields.InstrumentFields.SERIAL_NUMBER,
        sort: 'asc',
        width: 100
    },
        {
            label: 'Asset Tag Number',
            field: ModelFields.InstrumentFields.ASSET_TAG,
            sort: 'int',
            width: 100
        }]