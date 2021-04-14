import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Checkbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ref : React.createRef()
        }
    }

    getId() {
        return this.state.ref.current.id
    }

    check() {
        this.state.ref.current.checked = true
    }

    forceUncheck() {
        this.state.ref.current.checked = false
    }

    isChecked() {
        return this.state.ref.current.checked
    }

    render () {
        return (
            <div style={{flex: 1, flexDirection: "row", display: "inline-block"}}>
                <div className="custom-control custom-checkbox">
                    <input type="checkbox"
                           className="custom-control-input"
                           ref={this.state.ref}
                           id={this.props.id}
                           defaultChecked={this.props.defaultChecked}
                           onChange={() => this.props.handleSelect(this.props.id)}
                           disabled={false}
                        />
                        <label className="custom-control-label" htmlFor={this.props.id}>{this.props.label}</label>
                </div>
            </div>)
    }
}

Checkbox.propTypes = {
    handleSelect : PropTypes.func.isRequired,
    id : PropTypes.string.isRequired,
    defaultChecked : PropTypes.bool,
    label : PropTypes.string
    //updateSelectedRow : PropTypes.func.isRequired
}
