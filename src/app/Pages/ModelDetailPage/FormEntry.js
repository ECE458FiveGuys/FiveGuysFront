import React, {Component} from "react";
import SelectInput from "./SelectInput";
import Select from "react-select";
import ModelRequests from "../../../controller/requests/model_requests";

class FormEntry extends Component {

    // parseFields(formFields,fieldName) {
    //     let ret = this.props.subject[formFields[fieldName]]
    //     return ret
    // }

    render() {

        // let models = ModelRequests.getModels()
        let formFields = this.props.fields
        // let test = this.props.subject[formFields["model"]]
        return(
            <div>
                {Object.keys(formFields).map((fieldName, index) => (
                    fieldName === "Model" ? (
                        <div>
                            <label>{fieldName}</label>
                            <Select
                                defaultValue = {{value: "",label: "5"}}
                                options = {[{value: "",label: "2"}]}
                            />
                        </div>): (
                    <div>
                    <label>{fieldName}</label>
                    <input name={formFields[fieldName]}
                    className="form-control"
                    onChange={this.props.handleFormChange}
                    defaultValue={this.props.subject[formFields[fieldName]]}
                    />
                    <br />
                    </div>
                    )
                ))}
            </div>
        );}
}
export default FormEntry