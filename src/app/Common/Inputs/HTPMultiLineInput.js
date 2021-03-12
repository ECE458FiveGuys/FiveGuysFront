import {MDBCol} from "mdbreact";
import React, {Component} from "react";
import PropTypes from "prop-types";


export default class HTPMultiLineInput extends Component {

    constructor(props) {
        super(props)
    }

    setValue(value) {
        this.inputRef.value = value
    }

    getValue() {
        return this.inputRef.value
    }


    render() {
        let {onChange, placeholder, name, type, defaultValue, style, label, error}= this.props
        return(
            <div>
                <label
                    className="dark-grey-text"
                    htmlFor="exampleFormControlTextarea1">
                    {label}
                </label>
                <textarea
                    className={"form-control"}
                    type={type}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    ref={el => this.inputRef = el}
                    contentEditable={true}
                    onChangeCapture={event => {
                        onChange(event)
                    }}
                    id="exampleFormControlTextarea1"
                    rows="5"
                />
                {error && <text style={{fontSize : 13}} className="text-danger">{error}</text>}
            </div>
        )
    }
}

HTPMultiLineInput.propTypes = {
    onChange : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    name : PropTypes.string.isRequired,
    type : PropTypes.string,
    size : PropTypes.number,
    value : PropTypes.string,
    defaultValue : PropTypes.string
}

HTPMultiLineInput.defaultProps = {
    type : 'text'
}

