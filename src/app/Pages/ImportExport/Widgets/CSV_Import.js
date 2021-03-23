import React, {Component} from "react";
import ImportExportRequests from "../../../../controller/requests/import_export_requests";
import TableColumns from "../../../Common/Tables/TableUtils/Columns";
import ModelFields from "../../../../utils/enums";
import {handleNavClick} from "../../../utils";
import HTPButton from "../../../Common/HTPButton";
import DatatableEditable from "../../../Common/Tables/DatatableEditable";
import DataTable from "../../../Common/Tables/DataTable";
import Step from "../../../Common/Text/Step";
import HTPFileInput from "../../../Common/Inputs/HTPFileInput";
import HTPPopup from "../../../Common/HTPPopup";
import FileUtils from "../../../../utils/file_utils";
import TableUtils from "../../../Common/Tables/TableUtils/table_utils";

let fileSize = 32000000
let sizeError = "File Size Exceeds 32 MB"

class CSV_Import extends Component{

    constructor(props) {
        super(props);
        this.state = {
            fileSelected : false,
            results: [],
            modal : false,
        }
        this.state.modifiedInstrumentTableColumns = [...TableColumns.INSTRUMENT_COLUMNS]
        this.state.modifiedInstrumentTableColumns.splice(5, 2)  // remove date columns
    }

    fileSelected = (event) => {
        let file = event.target.files[0]
        let extension = file.name.split(".").pop()
        this.setState({fileSelected: true, file: event.target.files[0]},
            () => this.setState({fileError : extension != "csv" ? "File must be csv!" : undefined}))
    }

    importTypeSelected = type => e => {
        this.setState({import_type: type, errorMessage : undefined}, ()=> {
                this.setState({results : undefined}, () => this.handleSubmission(type))
            }
        );
    }

    handleSubmission = (type) => {
        let errorCallBack = (error) => {
            this.setState({errorMessage : error, results : []})
            this.toggleModal()
        }
        let successCallBack = (result) => {
            result = type == ModelFields.ModelTypes.INSTRUMENT ? TableUtils.parseInstrumentTableRows(result, this.props.history, true) : this.modParse(result)
            this.setState({results: result, type : type})
        }
        ImportExportRequests.import(this.props.token, this.state.file, type, successCallBack, errorCallBack);

    }

    modParse = (results) => {
        results.forEach(result => {
            result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] =
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] === "00:00:00" ?
                    "Not Calibratable"
                    :
                    result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY].split(" ")[0]

            result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToElement(result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            result.clickEvent = () => {handleNavClick("/models/" + result["pk"], this.props.history)}
        })
        return results
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render(){
        const {results, type, modifiedInstrumentTableColumns} = this.state;
        return(
            <div style={{flex : 1, justifyContent : 'center', alignItems : 'center', display : 'flex', flexDirection : 'column'}}>
                    <div style={{marginTop : 20, marginBottom : 35, width : 350}}>
                        <HTPFileInput handleFileSelect={this.fileSelected}
                                      id={"input-file-now"}/>
                        <text className={"text-danger"} style={{marginTop : 20}}>{this.state.fileError}</text>
                    </div>
                    <Step stepText={"Finally, run your choice of import."} stepNumber={3}/>
                    <div style={{marginTop : 30, marginBottom : 40, flexDirection : 'row', display : "flex"}}>
                        <HTPButton
                                disabled={!this.state.fileSelected || this.state.fileError}
                                onSubmit={this.importTypeSelected(ModelFields.ModelTypes.EQUIPMENT_MODEL)}
                                label={"Import Models"}>
                        </HTPButton>
                        <HTPButton
                            disabled={!this.state.fileSelected || this.state.fileError}
                            onSubmit={this.importTypeSelected(ModelFields.ModelTypes.INSTRUMENT)}
                            label={"Import Instruments"}>
                        </HTPButton>
                    </div>
                <div style={{justifyContent: 'center', alignItems: 'center', xs: 2}}>
                    <Step stepNumber={4} stepText={"Results of import will be shown here:"}/>
                    <div style={{marginTop : 30, cursor: "pointer"}}>
                        <DataTable
                            displayEntries={false}
                            columns = {type == ModelFields.ModelTypes.EQUIPMENT_MODEL ? TableColumns.MODEL_COLUMNS : modifiedInstrumentTableColumns}
                            rows={results}
                            searching={false}
                        />
                    </div>
                </div>
                <HTPPopup toggleModal={this.toggleModal}
                          message={this.state.errorMessage}
                          className={"text-danger"}
                          title={"Error!"}
                          isOpen={this.state.modal}/>
            </div>
    );
    }
}
export default CSV_Import


