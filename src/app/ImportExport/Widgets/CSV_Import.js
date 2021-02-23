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
        console.log(this.state.file)
    }

    importTypeSelected = type => e => {
        if (this.state.import_type !== type) {
            this.setState({import_type: type});
        }
        if (this.state.file!==[] && this.state.import_type=='model'){
            this.handleModelSubmission()
        }
        else if(this.state.file!==[] && this.state.import_type=='instruments'){
            this.handleInstrumentSubmission()
        }
    }

    handleInstrumentSubmission = () => {
        ImportExportRequests.importInstruments(this.props.token,this.state.file).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    handleModelSubmission = () => {
        const formData = new FormData();

        formData.append('File', this.state.file);
        ImportExportRequests.importModels(this.props.token, this.state.file).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }



render(){
        const {fileSelected} = this.state;

        return(
            <MDBRow style={{justifyContent: 'center', alignItems: 'center', marginTop: 50, xs: 2}}>
                <input type="file" id="input-file-now" className="file-upload-input" data-mdb-file-upload="file-upload"
                       accept="text/csv" onChange={this.fileSelected}/>
                <MDBDropdown size={"sm"}>
                    <MDBDropdownToggle caret color="primary"></MDBDropdownToggle>
                    <MDBDropdownMenu basic>
                        <li><a className="models" onClick={this.importTypeSelected('models')}>Models</a></li>
                        <li><a className="instruments" onClick={this.importTypeSelected('instruments')}>Instruments</a></li>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </MDBRow>
        );
    }
}
export default CSV_Import


