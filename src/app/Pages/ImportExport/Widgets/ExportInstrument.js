import React, {Component} from "react";
import ImportExportRequests from "../../../../controller/requests/import_export_requests";
import {CSVLink} from "react-csv"
import HTPButton from "../../../Common/HTPButton";
import ModelRequests from "../../../../controller/requests/model_requests";
import InstrumentRequests from "../../../../controller/requests/instrument_requests";
class ExportInstrument extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
        this.csvLinkEl = React.createRef();
    }

    downloadInstruments = async()=> {
        this.setState({loading: true});
        InstrumentRequests.getInstrumentsWithSearchParams(this.props.token,
            this.props.searchParams,
            (json) => {
                this.setState({data: json, loading: false}, () => {
                    setTimeout(() => {
                        this.csvLinkEl.current.link.click();
                    });
                });
            },
            (errorMessage) => alert(errorMessage),
            undefined,
            undefined,
            true)
    }

    render(){
        const { data, loading } = this.state;
        return (
            <div style={{width : 200}}>
                <HTPButton
                    onSubmit={this.downloadInstruments}
                    color={"blue"}
                    label={loading ? "Downloading..." : "Export Table"}
                    disabled={loading}
                >
                </HTPButton>
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