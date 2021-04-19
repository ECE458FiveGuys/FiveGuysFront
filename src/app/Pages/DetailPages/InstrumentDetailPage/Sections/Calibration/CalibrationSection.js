import RecordCalibration from "./RecordCalibration";
import DataTable from "../../../../../Common/Tables/DataTable";
import TableColumns from "../../../../../Common/Tables/TableUtils/Columns";
import React from "react";
import {EquipmentModel, Instrument} from "../../../../../../utils/ModelEnums";
import ModelFields from "../../../../../../utils/enums";
import HTPButton from "../../../../../Common/HTPButton";
import {handleNavClick} from "../../../../../utils";
import {Button} from "react-bootstrap";
import {createCertificate} from "./certificate_writer";
import PropTypes from "prop-types";
import {User} from "../../../../../../utils/dtos";
import {instrumentCalibratable} from "../../utils";
import {SHORTEN_LABELS} from "../../../../CreateFunctions/CreateUser";
import {buildEvidenceElement} from "../../../Common/utils";
import Checkbox from "../../../../../Common/Tables/TableWidgets/Checkbox";

export default class CalibrationSection extends React.Component {

    constructor(props) {
        super(props);
        let calibrations = props.instrument["calibration_history"]
        this.state = {
            chainOfTruth : false,
            calibrationTableRows : this.buildCalibrationTableRows(calibrations),
            mostRecentValidCalibration : this.getMostRecentCalibration(calibrations)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {instrument} = this.props
        if (prevProps.instrument != instrument) {
            this.setState({calibrationTableRows : this.buildCalibrationTableRows(instrument["calibration_history"]),
                                mostRecentValidCalibration : this.getMostRecentCalibration(instrument["calibration_history"])
            })
        }
    }

    getMostRecentCalibration = (calibrations) => {
        let {instrument} = this.props
        let mostRecentValidCalibration = undefined
        calibrations.forEach(calibration => {
            if (this.approvalRequired(instrument)) {
                let approvalData = calibration[ModelFields.CalibrationFields.ApprovalData]
                const approvalStatus = approvalData ? (approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? "approved" : "rejected") : "pending approval"
                if (approvalStatus == "approved" && !mostRecentValidCalibration) {
                    mostRecentValidCalibration = calibration
                }
            } else if (!mostRecentValidCalibration) {
                mostRecentValidCalibration = calibration
            }})
        return mostRecentValidCalibration
    }

    buildCalibrationTableRows = (calibrations) => {
        let {instrument} = this.props
        return calibrations.map(calibration => {
            let calibrationCopy = {...calibration}
            calibrationCopy[ModelFields.CalibrationFields.AdditionalFile] = buildEvidenceElement(calibrationCopy)
            if (this.approvalRequired(instrument)) {
                let approvalData = calibration[ModelFields.CalibrationFields.ApprovalData]
                const approvalStatus = approvalData ? (approvalData[ModelFields.ApprovalDataFields.IS_APPROVED] ? "approved" : "rejected") : "pending approval"
                calibrationCopy["approval_status"] = approvalStatus
                if (approvalStatus != "approved") {
                    Object.keys(calibrationCopy).forEach(key => {
                        let element = calibrationCopy[key]
                        calibrationCopy[key] = this.highlightCell(element)
                    })
                }
            }
            calibrationCopy.clickEvent = () => handleNavClick(instrument.pk + "/calibration-events/" + calibration.pk, this.props.history)
            return calibrationCopy
        })
    }

    highlightCell(element) {
        return <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    height: 40,
                    marginTop: -10,
                    marginBottom: -10,
                    marginLeft: -5,
                    marginRight: -5,
                    overflow: true,
                    background: "darkgray"
                }}>
                    <text style={{marginLeft: 5}}>{element}</text>
                </div>
    }

    setCalibrationModalShow(boolean) {
        this.setState({calibrationModalShow : boolean}, () => {
            if (!boolean) this.setState({generalError : undefined})
        })
    }

    tempSetCustomFormShow(boolean) {
        this.setState({tempSetCustomFormShow : boolean})
    }

    setCustomCalibrationModalShow(boolean) {
        this.setState({customCalibrationModalShow : boolean})
    }

    supportsHardwareCalibration(instrument) {
        return instrument[Instrument.FIELDS.MODEL][EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.GUIDED_HARDWARE
    }

    supportsCustomFormCalibration(instrument) {
        return instrument[Instrument.FIELDS.MODEL][EquipmentModel.FIELDS.CALIBRATION_MODE] == ModelFields.CalibrationModes.CUSTOM_FORM
    }

    approvalRequired(instrument) {
        return instrument.model[EquipmentModel.FIELDS.CALIBRATION_APPROVAL_REQUIRED]
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
                            handleNavClick("/instruments/" + instrument.pk + "/load-bank/", history)
                        }}/> : <></>}
                {instrumentCalibratable(instrument) && this.supportsHardwareCalibration(instrument) ?
                    <HTPButton
                        label={"Klufe K5700 Calibration"}
                        onSubmit={() => {
                            handleNavClick("/instruments/" + instrument.pk + "/klufe-wizard/", history)
                        }}/> : <></>}
                {instrumentCalibratable(instrument) && this.supportsCustomFormCalibration(instrument) ?
                    <HTPButton
                        label={"Custom Form Calibration"}
                        onSubmit={() => {
                            this.setCustomCalibrationModalShow(true)
                        }}/> : <></>}
                {/*{<HTPButton*/}
                {/*    label={"Temp Custom Form Button"}*/}
                {/*    onSubmit={() => {*/}
                {/*        this.tempSetCustomFormShow(true)*/}
                {/*    }}/>}*/}
            </div>)
    }

    renderCalibrationCertificateButton = () => {
        let {instrument, calibrations, token} = this.props
        return (instrumentCalibratable(instrument)) ?
            <div style={{flexDirection : "column", display : "flex"}}>
                <Button
                    disabled={!calibrations || calibrations.length == 0 || !this.state.mostRecentValidCalibration}
                    onClick={() => {
                        let {mostRecentValidCalibration} = this.state
                            createCertificate(instrument, mostRecentValidCalibration.user, mostRecentValidCalibration, token, this.state.chainOfTruth)
                    }}>
                    Download Certificate
                </Button>
                <Checkbox handleSelect={() => this.setState({chainOfTruth : !this.state.chainOfTruth})}
                          id={"chainOfTruth"}
                          label={"Chain of Truth"}/>
            </div> : <div></div>
    }

    render() {
        let {token, instrument, user} = this.props
        let {calibrationModalShow, calibrationTableRows, tempSetCustomFormShow, generalError} = this.state
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
                        generalError={generalError}
                        setError={(e) => this.setState({generalError : e})}
                    />
                    {/*<FormBuilder*/}
                    {/*    show={tempSetCustomFormShow}*/}
                    {/*    onHide={()=>this.tempSetCustomFormShow(false)}*/}
                    {/*    closeModal={()=>this.tempSetCustomFormShow(false)}*/}
                    {/*    token={token}*/}
                    {/*    user={user}*/}
                    {/*/>*/}
                    <DataTable columns={this.approvalRequired(instrument) ? TableColumns.CALIBRATION_COLUMNS_APPROVAL : TableColumns.CALIBRATION_COLUMNS}
                               searching={false}
                               rows={calibrationTableRows}/>
                    <div style={{marginTop : -15, display : "flex", flexDirection : "row", justifyContent: "space-between"}}>
                        {this.props.user.groups.includes(SHORTEN_LABELS.CALIBRATION) && this.renderRecordCalibrationButtons()}
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