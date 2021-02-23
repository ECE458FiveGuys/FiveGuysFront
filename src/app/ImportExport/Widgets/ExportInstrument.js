import React, {Component} from "react";
import ImportExportRequests from "../../../controller/requests/import_export_requests";
import {CSVLink} from "react-csv"
class ExportInstrument extends Component{

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

    downloadInstruments = async()=> {
        this.setState({loading: true});
        let data = await ImportExportRequests.exportInstruments(this.props.token).then(res => res.text());
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
                <input
                    type="button"
                    value={loading ? "Downloading..." : "Export Instruments"}
                    onClick={this.downloadInstruments}
                    disabled={loading}
                />
                <CSVLink
                    data={data}
                    filename="Export_Instruments.csv"
                    ref={this.csvLinkEl}
                />
            </div>
        )
    }

}

export default ExportInstrument