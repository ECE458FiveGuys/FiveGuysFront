import React, {Component, useState} from "react";
import SelectInput from "./SelectInput";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ModelRequests from "../../../controller/requests/model_requests";
import DatePickers from "./DatePickers";
import DayPicker from "react-day-picker";

class FormEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDay: undefined
        }
    }
    // parseFields(formFields,fieldName) {
    //     let ret = this.props.subject[formFields[fieldName]]
    //     return ret
    // }

    handleDayClick = (day) => {
        this.props.handleDayClick(day)
        this.setState({selectedDay: day})
    }

    renderAlternateInputs(fieldName) {
        // var today = new Date()
        // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // var dateTime = date+' '+time;
        // const [startDate, setStartDate] = useState(new Date());
        if(fieldName === "Date") {
            // const [startDate, setStartDate] = new Date();
            // return
                // <div>{DatePickers}</div>
                // <DatePicker selected={today} dateFormat={'YYYY-MM-DD'}/>
                // <div></div>
            const today = new Date();
            return ( <DayPicker
                formatDate={'YYYY-MM-DD'}
                disabledDays={{ after: today }}
                selectedDays={this.state.selectedDay}
                onDayClick={this.handleDayClick}
            />);

        }

        if(fieldName === "File"){ //TODO
            return (
                <div>
                    <label className="form-label" htmlFor="customFile">Currently disabled file input</label>
                    <input type="file" className="form-control" id="customFile" disabled={true}/>
                </div>
            );
        }
        if(fieldName === "Model"){
            return(
                <div>
                    <label>{fieldName}</label>
                    <Select
                        defaultValue = {{value: "",label: "5"}}
                        options = {[{value: "",label: "2"}]}
                    />
                </div>
            );
        }
    }

    render() {
        let AlternateInputs = [
            "Model",
            "Date",
            "File",
        ]

        // let models = ModelRequests.getModels()
        let formFields = this.props.fields
        // let test = this.props.subject[formFields["model"]]
        return(
            <div>
                {Object.keys(formFields).map((fieldName, index) => (
                    AlternateInputs.includes(fieldName) ? (
                        <div>
                            {this.renderAlternateInputs(fieldName)}
                        </div>): (
                    <div>
                    <label>{fieldName}</label>
                    <input name={formFields[fieldName]}
                    className="form-control"
                    onChange={this.props.handleFormChange}
                    defaultValue={(this.props.isEdit) ? this.props.subject[formFields[fieldName]] : ""}
                    />
                    <br />
                    </div>
                    )
                ))}
            </div>
        );}
}
export default FormEntry