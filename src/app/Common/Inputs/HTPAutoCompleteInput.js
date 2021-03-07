import {MDBCol} from "mdbreact";
import {Form} from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";
import React, {Component} from "react";
import PropTypes from "prop-types";

// http://ericgio.github.io/react-bootstrap-typeahead/

export default class HTPAutoCompleteInput extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {options, onChange, label, placeholder, size, multiple, value, selected, defaultValue}= this.props
        return(
        <MDBCol size={size}>
            <Form.Group>
                <Form.Label className="grey-text">{label}</Form.Label>
                    <Typeahead
                        defaultSelected={defaultValue ? multiple ? defaultValue : [defaultValue] : undefined}
                        id="basic-typeahead-single"
                        labelKey="name"
                        multiple={multiple}
                        onInputChange={event => {
                            if (!multiple) onChange(event)
                        }}
                        onChange={event => {
                            multiple ? onChange(event) : onChange(event[0])
                        }}
                        options={options}
                        placeholder={placeholder}
                        value={value}
                        selected={selected}
                    />
            </Form.Group>
        </MDBCol>
        )
    }
}

HTPAutoCompleteInput.propTypes = {
    options : PropTypes.array.isRequired,
    onChange : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    placeholder : PropTypes.string.isRequired,
    size : PropTypes.number,
    multiple : PropTypes.bool,
    value : PropTypes.string,
    selected : PropTypes.array,
    defaultValue : PropTypes.array
}

HTPAutoCompleteInput.defaultProps = {
    size : 2,
    multiple : false,
    defaultValue : ''
}


