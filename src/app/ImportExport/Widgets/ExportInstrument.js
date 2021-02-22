import React, {Component} from "react";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import {CSVLink} from "react-csv"
class exportInstrument extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
        this.csvLinkEl = React.createRef();
        this.headers = [
            {label: 'Vendor', key: 'model.vendor'},
            {label: 'Model Number', key: 'model.model_number'},
            {label: 'Serial Number', key: 'serial_number'},
            {label: 'Description', key: 'model.description'},
            {label: 'Comment', key: 'comment'},
            {label: 'Calibration Frequency', key: 'calibration_frequency'}
        ]
    }

    downloadModels = async()=> {
        this.setState({loading: true})
        const data = ImportExportRequests.exportInstruments(this.props.token);
        this.setState({data: data, loading: false}, () =>{
            setTimeout(() => {
                this.csvLinkEl.current.link.click();
            });
        });
    }

    render(){
        const { data, loading } = this.state;
        return <div>
            <input
                type="button"
                value={loading ? "Downloading..." : "Export Models"}
                onClick={this.downloadModels}
                disabled={loading}
            />
            <CSVLink
                headers={this.headers}
                data={data}
                filename="Export_Models.csv"
                ref={this.csvLinkEl}
            />
        </div>
    }

}

export default exportModel