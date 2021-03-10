import React from "react";
import FileUtils from "../../../utils/file_utils";
import PropTypes from "prop-types"

export default class HTPFileInput extends React.Component{

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {id} = this.props
        return(<div className="input-group" style={{marginTop : 10}}>
                    <div style={{display : "flex", textAlign: "left"}} className="custom-file">
                        <input
                            type="file"
                            className="custom-file-input"
                            id={id}
                            aria-describedby="additionalEvidenceAddon01"
                            onChange={event => {
                                this.props.handleFileSelect(event)
                                let filename = FileUtils.getFileNameFromPath(event.target.value)
                                this.setState({fileSelected : filename})
                            }}
                        />
                        <label className="custom-file-label" htmlFor="additionalEvidence">
                            {this.state.fileSelected ? this.state.fileSelected : "Choose file"}
                        </label>
                    </div>
                </div>)
    }
}

HTPFileInput.propTypes = {
    handleFileSelect : PropTypes.func.isRequired,
    id : PropTypes.string.isRequired
}