import RecordCalibration from "./RecordCalibration";
import DataTable from "../../../../../Common/Tables/DataTable";
import TableColumns from "../../../../../Common/Tables/TableUtils/Columns";
import React from "react";
import {EquipmentModel} from "../../../../../../utils/ModelEnums";
import ModelFields from "../../../../../../utils/enums";
import HTPButton from "../../../../../Common/HTPButton";
import {handleNavClick} from "../../../../../utils";
import {Button} from "react-bootstrap";
import {createCertificate} from "./certificate_writer";
import PropTypes from "prop-types";
import ActionSection from "../../../Common/ActionSection";
import {User} from "../../../../../../utils/dtos";
import {MDBIcon} from "mdbreact";
import {instrumentCalibratable} from "../../utils";
import {Divider} from "@material-ui/core";
import FileUtils from "../../../../../../utils/file_utils";

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
                        <div style={{display : "flex", flexDirection : "row", alignItems : 'center'}}>
                            <MDBIcon size={"2x"}
                                     icon="file-alt" />
                            <text style={{marginLeft : 10}}>
                                {FileUtils.getFileNameFromPath(calibrationCopy[ModelFields.CalibrationFields.AdditionalFile])}
                            </text>
                        </div>
                    </a> : calibrationCopy[ModelFields.CalibrationFields.LoadBankFile] ? "Calibrated using the load bank wizard (download certificate to view)" : false
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
            <div>
                {instrumentCalibratable(instrument) ?
                    <HTPButton
                        label={"Calibrate"}
                        onSubmit={() => {
                            this.setCalibrationModalShow(true)
                        }}/> : <></>}
                {instrumentCalibratable(instrument) && model[EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.LOAD_BANK ?
                    <HTPButton
                        label={"Load Bank Wizard"}
                        onSubmit={() => {
                            handleNavClick("/load-bank/" + instrument.pk, history)
                        }}/> : <></>}
            </div>)
    }

    renderCalibrationCertificateButton = () => {
        let {instrument, calibrations, token} = this.props
        return (instrumentCalibratable(instrument)) ?
            <Button
                disabled={!calibrations || calibrations.length == 0}
                onClick={() => {
                        createCertificate(instrument, calibrations[0].user, calibrations[0], token)
                }}>
                Download Certificate
            </Button> : <div></div>
    }

    render() {
        let {token, instrument, user} = this.props
        let {calibrationModalShow, calibrationTableRows} = this.state
        return(<div style={{marginLeft : 50, marginRight : 50, textAlign : 'center', flex : 1.8}}>
                            <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center"}}
                                className={"h2-responsive"}>
                                Calibration
                            </h1>
                            <h1 style={{alignSelf : 'center', justifySelf : 'center', textAlign : "center", marginBottom : -35}}
                                className={"h5-responsive"}>
                                Calibrate your instrument here
                            </h1>
                    <RecordCalibration
                        show={calibrationModalShow}
                        onHide={()=>this.setCalibrationModalShow(false)}
                        token={token}
                        instrument={instrument}
                        closeModal={()=>this.setCalibrationModalShow(false)}
                        user={user}
                    />
                    <DataTable columns={TableColumns.CALIBRATION_COLUMNS}
                               searching={false}
                               rows={calibrationTableRows}/>
                    <div style={{marginTop : -15, display : "flex", flexDirection : "row", justifyContent: "space-between"}}>
                        {this.renderRecordCalibrationButtons()}
                        {this.renderCalibrationCertificateButton()}
                    </div>
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