import React, {useState, Component} from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBDropdown,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBInput,
    MDBRow,
    MDBTable
} from "mdbreact";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import DataTable_NoGIF from "../../Common/Tables/DataTable_NoGIF";
import TableColumns from "../../Pages/MainPage/InventoryTables/Columns";
import ModelFields from "../../../utils/enums";
import TableUtils from "../../Pages/MainPage/InventoryTables/TableUtils";
import {handleNavClick} from "../../utils";
import HTPButton from "../../Common/HTPButton";

let fileSize = 32000000
let sizeError = "File Size Exceeds 32 MB"

class CSV_Import extends Component{

    constructor(props) {
        super(props);
        this.state = {
            import_type : "",
            file: [],
            fileSelected: false,
            modelSelected: false,
            instrumentSelected: false,
            data: [],
            results: undefined,
        }
    }

    updateData(result) {
        let data = result.data;
        console.log(data);
        return data;
    }

    //TODO: Add Size validation
    fileSelected = (event) => {
        if(event.target.files[0].size <= fileSize){
            this.setState({fileSelected: true, file: event.target.files[0]});
        }
        else{
            alert(sizeError)
        }
    }

    importTypeSelected = type => e => {
        let res = [];
        this.setState({import_type: type}, ()=> {
            if (this.state.file !== [] && this.state.import_type === 'models') {
                this.handleModelSubmission();
            } else if (this.state.file !== [] && this.state.import_type === 'instruments') {
                this.handleInstrumentSubmission();
            }
            }
        );
    }

    handleInstrumentSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let name = this.state.file.name
        let result = await ImportExportRequests.importInstruments(this.props.token, data,name);
        if(result != undefined) {
            result = await this.instrParse(result)
            this.setState({results: result, modelSelected: false, instrumentSelected: true})
        }
        else{
            this.setState({results:undefined})
        }
    }

    handleModelSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let name = this.state.file.name
        let result = await ImportExportRequests.importModels(this.props.token, data, name);
        if(result != undefined) {
            result = await this.modParse(result)
            this.setState({results: result, modelSelected: true, instrumentSelected: false})
        }
        else{
            this.setState({results:[]})
        }
    }

    modParse = (results) => {
        if(results != undefined) {
            results.forEach(result => {
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] =
                    result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] === "00:00:00" ?
                        "Noncalibratable"
                        :
                        result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY].split(" ")[0]

                result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                    TableUtils.categoriesToString(result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            })
            return results
        }
        else {
            return [];
        }
    }

    instrParse = (results) => {
        if (results != undefined) {

            results.forEach(result => {
                let model = result[ModelFields.InstrumentFields.MODEL]
                delete result[ModelFields.InstrumentFields.MODEL]
                result[ModelFields.InstrumentFields.EXPIRATION_DATE] = this.calculateCalibrationExpirationElement(result)
                if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]) {
                    result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Noncalibratable"
                }
                result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                    TableUtils.categoriesToString(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])
                model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                    TableUtils.categoriesToString(model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
                Object.assign(result, model)
            })
            return results
        } else {
            return [];
        }
    }

    render(){
        const {results, modelSelected, instrumentSelected} = this.state;
        let datatable = []
        if(results!=undefined){
           datatable.push(
               <DataTable_NoGIF
                columns = {modelSelected ? TableColumns.MODEL_COLUMNS : TableColumns.INSTRUMENT_COLUMNS}
                rows={results}
                searching={false}
               />
            )
        }
        else{
            datatable = []
        }

        return(
            <MDBContainer>
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    <MDBInput color="dark-green" type="file" id="input-file-now" className="file-upload-input" data-mdb-file-upload="file-upload"
                           accept="text/csv, .csv" onChange={this.fileSelected}>
                    </MDBInput>
                    <HTPButton
                            onSubmit={this.importTypeSelected('models')}
                            label={"Import Models"}>
                    </HTPButton>
                    <HTPButton
                        onSubmit={this.importTypeSelected('instruments')}
                        label={"Import Instruments"}>
                    </HTPButton>
                    <a href="/documentation">
                        <HTPButton
                            label="?">
                        </HTPButton>
                    </a>
                </MDBRow>
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    {datatable}
                </MDBRow>
            </MDBContainer>
    );
    }
}
export default CSV_Import


