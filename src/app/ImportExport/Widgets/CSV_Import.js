import React, {useState, Component} from "react";
import {MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBRow} from "mdbreact";
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
        }
    }


    fileSelected = (event) => {
        this.setState({fileSelected: true, });
        this.setState({file: event.target.files[0]});
    }

    importTypeSelected = type => e => {
        this.setState({import_type: type});
        let res = {};
        if (this.state.file!==[] && this.state.import_type==='models'){
            res = this.handleModelSubmission();
        }
        else if(this.state.file!==[] && this.state.import_type==='instruments'){
            res = this.handleInstrumentSubmission();
        }

        console.log(res)
    }

    handleInstrumentSubmission = async() => {
        const formData = new FormData();
        formData.append('file', this.state.file);
        console.log(formData);
        let result = await ImportExportRequests.importInstruments(this.props.token, formData);
        return result
    }

    handleModelSubmission = async() => {
        const formData = new FormData();

        formData.append('file', this.state.file);
        console.log("HI")

        let result = await ImportExportRequests.importModels(this.props.token, formData);
        console.log(result)
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


