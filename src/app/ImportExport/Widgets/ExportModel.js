import React, {Component} from "react";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import RequestUtils from "../../../controller/requests/request_utils";
import {CSVLink} from "react-csv"
import {METHODS, URLS} from "../../../strings.js"

class ExportModel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
        this.csvLinkEl = React.createRef();
        this.headers = [
            {label: 'Vendor', key: 'vendor'},
            {label: 'Model Number', key: 'model_number'},
            {label: 'Description', key: 'description'},
            {label: 'Comment', key: 'comment'},
            {label: 'Calibration Frequency', key: 'calibration_frequency'}
        ]
    }

    getModels = () => {
        return RequestUtils.assisted_fetch('http://group-six-test.colab.duke.edu/models/all', METHODS.GET, {'Authorization': this.props.token})
    }

    downloadModels = async()=> {
        this.setState({loading: true});
        const data = await ImportExportRequests.exportModels(this.props.token);
        console.log('data :', data);
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
        )
    }

}

export default ExportModel