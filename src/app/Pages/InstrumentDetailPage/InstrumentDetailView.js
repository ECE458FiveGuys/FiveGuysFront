import React, { Component } from "react";
import {Button} from "react-bootstrap";
import EditModal from "../ModelDetailPage/EditModal";
import ErrorBoundary from "../ModelDetailPage/ErrorBoundary";
import InstrumentRequests from "../../../controller/requests/instrument_requests";
import DataTable from "../../Common/Tables/DataTable";
import TableColumns from "../MainPage/InventoryTables/Columns";
import ModelFields from "../../../utils/enums";
import DeleteModal from "../ModelDetailPage/DeleteModal";
import RecordCalibration from "../ModelDetailPage/RecordCalibration";
import {EquipmentModel, Instrument} from "../../../utils/ModelEnums";
import {handleNavClick} from "../../utils";
import {MDBBadge, MDBIcon} from "mdbreact";
import HTPNavBar from "../../Common/HTPNavBar";
import ModelDisplay from "../../Common/HTPModelDisplay";
import HTPButton from "../../Common/HTPButton";
import {Divider} from "@material-ui/core";

class InstrumentDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }s

     componentDidMount() {
        let retrieveInstrumentCallback = (instrument) => {
            let calibrations = this.enhanceCalibrationData(instrument['calibration_history'])
            this.setState({calibrations : calibrations, instrument : instrument, model: instrument.model,
                serial_number : instrument["serial_number"], comment : instrument["comment"]});
        }
        let retrieveInstrumentError = (e) => {
            alert("RETRIEVE"+e)
        }
        InstrumentRequests.retrieveInstrument(this.props.token, this.props.id, retrieveInstrumentCallback,retrieveInstrumentError);//
    }

    enhanceCalibrationData = (calibrations) => {
        return calibrations.map(calibration => {
            calibration[ModelFields.CalibrationFields.AdditionalFile] = (
                calibration[ModelFields.CalibrationFields.AdditionalFile] ?
                <a target="_blank" href={calibration[ModelFields.CalibrationFields.AdditionalFile]}>
                    <MDBIcon size={"2x"}
                             icon="file-alt" />
                </a> : calibration[ModelFields.CalibrationFields.LoadBankFile] ? "Calibrated using the load bank wizard" : false
                )
            return calibration
        })
    }

    setDeleteModalShow(boolean) {
        this.setState({deleteModalShow:boolean})
    }

    setEditModalShow(boolean) {
        this.setState({editModalShow:boolean})
    }

    setCalibrationModalShow(boolean) {
        this.setState({calibrationModalShow:boolean})
    }

    handleSubmit = (e) =>{
        this.setEditModalShow(false)
        let {serial_number,comment} = this.state
        let instrument = this.state.instrument
        let editCallback = (response) => {
            var temp_instrument = {...this.state.instrument}
            for (var field in ModelFields.InstrumentEditFields) {
                temp_instrument[ModelFields.InstrumentEditFields[field]] = this.state[ModelFields.InstrumentEditFields[field]]
            }
            this.setState({instrument: temp_instrument})
        }
        let editError = (e) => {
            alert("edit"+e)
        }
        InstrumentRequests.editInstrument(this.props.token,instrument.pk, instrument.model['pk'],
                                            serial_number,comment,editCallback,editError)
    }

    handleFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value})
    }

    deleteInstrument = () => {
        let deleteInstrumentCallback = (model) => {
            alert("DELETE SUCCESS")
            // close tab
        }
        let deleteInstrumentError = (e) => {
            alert("DELETE: "+e)
        }
        InstrumentRequests.deleteInstruments(this.props.token, this.props.id, deleteInstrumentCallback,deleteInstrumentError);
    }

    instrumentCalibratable = () => {
        return this.state.instrument.model[EquipmentModel.FIELDS.CALIBRATION_MODE] != ModelFields.CalibrationModes.NOT_CALIBRATABLE
    }

    renderCalibrationButtons = () => {
        let {instrument} = this.state
        let model = instrument.model
        return (
            [this.instrumentCalibratable() && model[EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK ?
            <HTPButton
                label={"Calibrate with Load Bank Wizard"}
                onSubmit={() => {
                    handleNavClick("/load-bank/" + instrument.pk, this.props.history)
                }}/> : <div/>,
            this.instrumentCalibratable() ?
                <HTPButton
                    label={"Record Simple Calibration"}
                    onSubmit={() => {
                        this.setCalibrationModalShow(true)
                    }}/> : <div/>])
    }

    renderCalibrationCertificateButton = () => {
        let {instrument} = this.state
        let model = instrument.model
        return (this.instrumentCalibratable()) ?
            <Button onClick={() => {
                if (model[EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK) {
                    handleNavClick("/load-bank/" + instrument.pk, this.props.history)
                } else {
                    this.setCalibrationModalShow(true)
                }
            }}>
                Download Calibration Certificate
            </Button> : <div></div>
    }


    render() {
        let {instrument} = this.state
        if (instrument) {
            return (
                <div>
                    <HTPNavBar user={this.props.user}></HTPNavBar>
                <div style={{flex : 1, display : "flex", flexDirection : "column", justifyContent : 'space-evenly', alignItems : 'center', marginLeft : 100, marginRight : 100}}>
                    <h1 style={{marginTop : 20}}
                        className={"h1-responsive"}>
                        Instrument Details
                    </h1>
                    <Divider orientation={'horizontal'} flexItem={true}/>
                    <div style={{flex : 1, display : "flex", flexDirection : "row", justifyContent : 'space-between'}}>
                        <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                            <h1 style={{marginTop : 20, marginBottom : 20}}
                                className={"h5-responsive"}>
                                {`You are looking at the instrument with the following properties:`}
                            </h1>
                            {ModelDisplay(
                                ["Serial Number", "Asset Tag", "Most Recent Calibration"],
                                [
                                    instrument[ModelFields.InstrumentFields.SERIAL_NUMBER],
                                    instrument[ModelFields.InstrumentFields.ASSET_TAG],
                                    instrument[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION],
                                ])}
                            <h1 style={{marginTop : 20}}
                                className={"h5-responsive"}>
                                Categories:
                            </h1>
                            <div>
                                {instrument[ModelFields.InstrumentFields.MODEL][EquipmentModel.FIELDS.MODEL_CATEGORIES].map(category => {
                                    return <MDBBadge color="green"
                                                     pill>
                                                {category.name}
                                            </MDBBadge>
                                })}
                            </div>
                            <h1 style={{marginTop : 20}}
                                className={"h5-responsive"}>
                                Model Description:
                            </h1>
                            <text>{instrument.model[EquipmentModel.FIELDS.DESCRIPTION]}</text>
                        </div>
                        <Divider style={{marginRight : 30, marginLeft : 30}}
                                    orientation={"vertical"}
                                    flexItem={true}/>
                        <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                            <div style={{flex : 1, display : "flex", flexDirection : "column"}}>
                                <h1 style={{marginTop : 20, marginBottom : 20}}
                                    className={"h5-responsive"}>
                                    {`This instrument is an instance of the model with the following properties:`}
                                </h1>
                                <div style={{flex : 1, display : "flex", flexDirection : "row", alignItems : 'center', justifyContent : 'space-between'}}>
                                    {ModelDisplay(
                                        ["Model Number", "Vendor"],
                                        [
                                            instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.MODEL_NUMBER],
                                            instrument[ModelFields.InstrumentFields.MODEL][ModelFields.EquipmentModelFields.VENDOR],
                                        ])}
                                        <div style={{flex : 1, display : "flex", justifyContent : "center", alignItems : 'center'}}>
                                            <HTPButton onSubmit={() => this.props.history.push('/models/' + instrument.model.pk)}
                                                       label={"Go to Model"}/>
                                        </div>
                                </div>
                                <h1 style={{marginTop : 20}}
                                    className={"h5-responsive"}>
                                    Categories:
                                </h1>
                                <div>
                                    {instrument[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES].map(category => {
                                        return <MDBBadge color="green"
                                                         pill>
                                            {category.name}
                                        </MDBBadge>
                                    })}
                                </div>
                                <h1 style={{marginTop : 20}}
                                    className={"h5-responsive"}>
                                    Comment:
                                </h1>
                                <text>{instrument[EquipmentModel.FIELDS.COMMENT]}</text>
                            </div>

                        </div>
                        <Divider style={{marginRight : 30, marginLeft : 30}}
                                 orientation={"vertical"}
                                 flexItem={true}/>
                        <div style={{flex : .6, display : "flex", flexDirection : "column", justifyContent : 'center', alignItems : 'center'}}>
                            <h1 style={{marginTop : 20}}
                                className={"h3-responsive"}>
                                Actions
                            </h1>
                            <h1 style={{marginTop : 20, marginBottom : 20, textAlign : 'center'}}
                                className={"h5-responsive"}>
                                {`As an admin, you may do the following:`}
                            </h1>
                            <div>
                                <Button variant="green" onClick={() => this.setEditModalShow(true)}>
                                    Edit
                                </Button>
                                <Button variant="red" onClick={() => this.setDeleteModalShow(true)}>
                                    Delete
                                </Button>
                            </div>
                            <EditModal
                                show={this.state.editModalShow}
                                onHide={() => this.setEditModalShow(false)}
                                token={this.props.token}
                                submitMethod={this.handleSubmit}
                                subject={this.state.instrument}
                                fields={ModelFields.InstrumentEditFields}
                                title={"Edit Instrument " + this.state.instrument.serial_number}
                                handleFormChange={this.handleFormChange}
                                isEdit = {true}
                            />
                            <DeleteModal
                                show={this.state.deleteModalShow}
                                onHide={() => this.setDeleteModalShow(false)}
                                token = {this.props.token}
                                deleteMethod = {this.deleteInstrument}
                                message={"Are you sure you wat to remove instrument "+this.state.instrument.serial_number+"?"}
                            />
                        </div>
                    </div>
                </div>
                    <div style={{marginLeft : 100, marginRight : 100, marginTop : 20}}>
                        <Divider style={{marginTop : 30, marginBottom : 30}}
                                 orientation={"horizontal"}/>
                        <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center"}}
                            className={"h2-responsive"}>
                            Calibration
                        </h1>
                        <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center"}}
                            className={"h5-responsive"}>
                            You must calibrate this instrument frequently!
                        </h1>
                        <div style={{display : 'flex', justifyContent : 'space-between'}}>
                            <div>
                                {this.renderCalibrationButtons()}
                            </div>
                            {this.renderCalibrationCertificateButton()}
                        </div>
                        <RecordCalibration
                            show={this.state.calibrationModalShow}
                            onHide={()=>this.setCalibrationModalShow(false)}
                            token={this.props.token}
                            subject={this.state.instrument}
                            closeModal={()=>this.setCalibrationModalShow(false)}
                            // message={"Are you sure you wat to remove instrument "+this.state.instrument.serial_number+"?"}
                        />
                        <DataTable columns={TableColumns.CALIBRATION_COLUMNS}
                                   rows={this.state.calibrations}/>
                    </div>
                </div>


            );
        }
        else {
            return (<div/>);
        }
    }
}
export default InstrumentDetailView;