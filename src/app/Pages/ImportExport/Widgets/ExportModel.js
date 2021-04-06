import React, {Component} from "react";
import ImportExportRequests from "../../../../controller/requests/import_export_requests";
import {CSVLink} from "react-csv";
import "react-papaparse";
import HTPButton from "../../../Common/HTPButton";
import ModelFields from "../../../../utils/enums";
import ModelRequests from "../../../../controller/requests/model_requests";

class ExportModel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
        this.csvLinkEl = React.createRef();
    }

    downloadModels = ()=> {
        this.setState({loading: true});
        ModelRequests.getModelsWithSearchParams(this.props.token,
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
                        color={"blue"}
                        onSubmit={this.downloadModels}
                        label={loading ? "Downloading..." : "Export Table"}
                        disabled={loading}
                        size={"sm"}
                    />
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