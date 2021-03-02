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
import Papa from "papaparse"
import {CSVReader} from "react-papaparse";
import {getIsOnlyResult} from "react-bootstrap-typeahead/lib/utils";
import DataTable_NoGIF from "../../Common/Tables/DataTable_NoGIF";
import TableColumns from "../../Pages/MainPage/InventoryTables/Columns";
import ModelTable from "../../Pages/MainPage/InventoryTables/ModelTable";
import ModelFields from "../../../utils/enums";
import TableUtils from "../../Pages/MainPage/InventoryTables/TableUtils";
import {newTab} from "../../utils";
import HTPButton from "../../Common/Inputs/HTPButton";

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

    fileSelected = (event) => {
        this.setState({fileSelected: true});
        this.setState({file: event.target.files[0]});
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
        let result = await ImportExportRequests.importInstruments(this.props.token, data);
        result = await this.instrParse(result)
        this.setState({results: result, modelSelected: false, instrumentSelected: true})
    }

    handleModelSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let result = await ImportExportRequests.importModels(this.props.token, data);
        result = await this.modParse(result)
        this.setState({results: result, modelSelected: true, instrumentSelected: false})
    }

    modParse = (results) => {
        results.forEach(result => {
            let model_pk = result[ModelFields.EquipmentModelFields.PK]
            result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] =
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] === "00:00:00" ?
                    "Noncalibratable"
                    :
                    result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY].split(" ")[0]

            result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            result.clickEvent = newTab("/models/" + model_pk)
        })
        return results
    }

    instrParse = (results) => {
        results.forEach(result => {
            let model = result[ModelFields.InstrumentFields.MODEL]
            delete result[ModelFields.InstrumentFields.MODEL]
            result[ModelFields.InstrumentFields.EXPIRATION_DATE] = this.calculateCalibrationExpirationElement(result)
            if (!result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION]) {
                result[ModelFields.InstrumentFields.MOST_RECENT_CALIBRATION] = "Noncalibratable"
            }
            let instrument_pk = result[ModelFields.InstrumentFields.PK]
            result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES] =
                TableUtils.categoriesToString(result[ModelFields.InstrumentFields.INSTRUMENT_CATEGORIES])
            model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToString(model[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            result.clickEvent = newTab("/instruments/" + instrument_pk)
            Object.assign(result, model)
        })
        return results
    }



    render(){
        const {results, modelSelected, instrumentSelected} = this.state;

        return(
            <MDBContainer>
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    <MDBInput color="dark-green" type="file" id="input-file-now" className="file-upload-input" data-mdb-file-upload="file-upload"
                           accept="text/csv" onChange={this.fileSelected}>
                    </MDBInput>
                    <HTPButton
                            onSubmit={this.importTypeSelected('models')}
                            label={"Import Models"}>
                    </HTPButton>
                    <HTPButton
                        onSubmit={this.importTypeSelected('instruments')}
                        label={"Import Instruments"}>
                    </HTPButton>
                    <a href="/Document">
                        <HTPButton
                            label="Import Documentation">
                        </HTPButton>
                    </a>
                </MDBRow>
                <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                    <DataTable_NoGIF
                                columns = {modelSelected ? TableColumns.MODEL_COLUMNS : TableColumns.INSTRUMENT_COLUMNS}
                                rows={results}
                                searching={false}
                            />
                </MDBRow>
            </MDBContainer>


    );
    }
}
export default CSV_Import


