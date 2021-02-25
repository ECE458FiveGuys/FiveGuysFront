import React, {useState, Component} from "react";
import {MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBRow} from "mdbreact";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import Papa from "papaparse"
import {CSVReader} from "react-papaparse";

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
                res = this.handleModelSubmission();
            } else if (this.state.file !== [] && this.state.import_type === 'instruments') {
                res = this.handleInstrumentSubmission();
            }
            }
        );
    }

    handleInstrumentSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let result = await ImportExportRequests.importInstruments(this.props.token, data);
        return result
    }

    handleModelSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let result = await ImportExportRequests.importModels(this.props.token, data);
        return result
    }

render(){
        const {fileSelected} = this.state;

        return(
            <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                <input type="file" id="input-file-now" className="file-upload-input" data-mdb-file-upload="file-upload"
                       accept="text/csv" onChange={this.fileSelected}/>
                <MDBDropdown size={"sm"}>
                    <MDBDropdownToggle caret color="primary">Import Type</MDBDropdownToggle>
                    <MDBDropdownMenu basic>
                        <li><a className="dropdown-item" onClick={this.importTypeSelected('models')}>Models</a></li>
                        <li><a className="dropdown-item" onClick={this.importTypeSelected('instruments')}>Instruments</a></li>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </MDBRow>
        );
    }
}
export default CSV_Import


