import React, {useState, Component} from "react";
import {MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBRow, MDBTable} from "mdbreact";
import ImportExportRequests from "../../../controller/requests/import_export_requests";

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
            results: [],
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
        this.setState({results: result})
        this.setState({modelSelected: false})
        this.setState({instrumentSelected: true})
        return result
    }

    handleModelSubmission = async() => {
        const data = new FormData();
        let dat = this.state.file
        data.append('file', dat);
        let result = await ImportExportRequests.importModels(this.props.token, data);
        this.setState({results: result})
        this.setState({modelSelected: true})
        this.setState({instrumentSelected: false})
        return result
    }

render(){
        const {results} = this.state;

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
                <MDBTable>

                </MDBTable>
            </MDBRow>

        );
    }
}
export default CSV_Import


