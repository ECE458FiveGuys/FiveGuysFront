import React, {Component} from "react";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import {CSVLink} from "react-csv";
import "react-papaparse";
import HTPButton from "../../Common/Inputs/HTPButton";

class ExportModel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
        this.csvLinkEl = React.createRef();
        // this.headers = [
        //     {label: 'Vendor', key: 'Vendor'},
        //     {label: 'Model Number', key: 'Model-Number'},
        //     {label: 'Description', key: 'Short-Description'},
        //     {label: 'Comment', key: 'Comment'},
        //     {label: 'Calibration Frequency', key: 'Calibration-Frequency'}
        // ]
    }

    downloadModels = async()=> {
        this.setState({loading: true});
        let data = await ImportExportRequests.exportModels(this.props.token).then(res => res.text());
        console.log(data);
        this.setState({data: data, loading: false}, () =>{
            setTimeout(() => {
                this.csvLinkEl.current.link.click();
            });
        });
    }

    render(){
        const { data, loading } = this.state;
        return (
                <div>
                    <HTPButton
                        onSubmit={this.downloadModels}
                        label={loading ? "Downloading..." : "Export Models"}
                        disabled={loading}
                    >
                    </HTPButton>
                    <CSVLink
                        data={data}
                        filename="Export_Models.csv"
                        ref={this.csvLinkEl}
                        />
                </div>
        )
    }
}

export default ExportModel