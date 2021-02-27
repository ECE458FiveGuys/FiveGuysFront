import React, {Component} from "react";

class FormEntry extends Component {

    render() {
        let formFields = this.props.fields
        return(
            <div>
                {Object.keys(formFields).map((fieldName, index) => (
                    <div>
                    <label>{fieldName}</label>
                    <input name={formFields[fieldName]}
                    className="form-control"
                    onChange={this.props.handleFormChange}
                    defaultValue={this.props.subject[formFields[fieldName]]}
                    />
                    <br />
                    </div>
                ))}
            </div>
        );}
}
export default FormEntry