import RecordCalibration from "../../ModelDetailPage/RecordCalibration";
import DataTable from "../../../Common/Tables/DataTable";
import TableColumns from "../../MainPage/InventoryTables/Columns";
import React from "react";
import {EquipmentModel} from "../../../../utils/ModelEnums";
import ModelFields from "../../../../utils/enums";
import HTPButton from "../../../Common/HTPButton";
import {handleNavClick} from "../../../utils";
import {Button} from "react-bootstrap";
import {createCertificate} from "../../ModelDetailPage/certificate_writer";
import PropTypes from "prop-types";
import ActionSection from "./ActionSection";
import {User} from "../../../../utils/dtos";
import {MDBIcon} from "mdbreact";
import {instrumentCalibratable} from "../utils";

export default class CalibrationSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            calibrationTableRows : this.buildCalibrationTableRows(props.instrument["calibration_history"])
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {instrument} = this.props
        if (prevProps.instrument != instrument) {
            this.setState({calibrationTableRows : this.buildCalibrationTableRows(instrument["calibration_history"])})
        }
    }

    buildCalibrationTableRows = (calibrations) => {
        return calibrations.map(calibration => {
            let calibrationCopy = {...calibration}
            calibrationCopy[ModelFields.CalibrationFields.AdditionalFile] = (
                calibrationCopy[ModelFields.CalibrationFields.AdditionalFile] ?
                    <a target="_blank" href={calibrationCopy[ModelFields.CalibrationFields.AdditionalFile]}>
                        <MDBIcon size={"2x"}
                                 icon="file-alt" />
                    </a> : calibrationCopy[ModelFields.CalibrationFields.LoadBankFile] ? "Calibrated using the load bank wizard" : false
            )
            return calibrationCopy
        })
    }

    setCalibrationModalShow(boolean) {
        this.setState({calibrationModalShow : boolean})
    }

    renderRecordCalibrationButtons = () => {
        let {instrument, history} = this.props
        let model = instrument.model
        return (
            [instrumentCalibratable(instrument) && model[EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK ?
                <HTPButton
                    label={"Calibrate with Load Bank Wizard"}
                    onSubmit={() => {
                        handleNavClick("/load-bank/" + instrument.pk, history)
                    }}/> : <div/>,
                instrumentCalibratable(instrument) ?
                    <HTPButton
                        label={"Record Simple Calibration"}
                        onSubmit={() => {
                            this.setCalibrationModalShow(true)
                        }}/> : <div/>])
    }

    renderCalibrationCertificateButton = () => {
        let {instrument, calibrations} = this.props
        return (instrumentCalibratable(instrument)) ?
            <Button
                disabled={!calibrations || calibrations.length == 0}
                onClick={() => {
                        createCertificate(instrument, calibrations[0].user, calibrations[0])
                }}>
                Download Calibration Certificate
            </Button> : <div></div>
    }

    render() {
        let {token, instrument, user} = this.props
        let {calibrationModalShow, calibrationTableRows} = this.state
        return(<div style={{marginLeft : 100, marginRight : 100, marginTop : 20}}>
                    <div style={{display : 'flex', justifyContent : 'space-between'}}>
                        <div>
                            {this.renderRecordCalibrationButtons()}
                        </div>
                        <div>
                            <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center"}}
                                className={"h2-responsive"}>
                                Calibration
                            </h1>
                            <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center"}}
                                className={"h5-responsive"}>
                                Calibrate your instrument here
                            </h1>
                        </div>
                        <div>
                            {this.renderCalibrationCertificateButton()}
                        </div>
                    </div>
                    <RecordCalibration
                        show={calibrationModalShow}
                        onHide={()=>this.setCalibrationModalShow(false)}
                        token={token}
                        instrument={instrument}
                        closeModal={()=>this.setCalibrationModalShow(false)}
                        user={user}
                        // message={"Are you sure you wat to remove instrument "+this.state.instrument.serial_number+"?"}
                    />
                    <DataTable columns={TableColumns.CALIBRATION_COLUMNS}
                               rows={calibrationTableRows}/>
                </div>)
    }
}

CalibrationSection.propTypes = {
    token : PropTypes.string.isRequired,
    user : PropTypes.instanceOf(User).isRequired,
    instrument : PropTypes.object.isRequired,
    history : PropTypes.object.isRequired,
    calibrations : PropTypes.array.isRequired
}