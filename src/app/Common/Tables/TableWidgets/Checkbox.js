import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Checkbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ref : React.createRef()
        }
    }

    handleSelect(isChecked) {
        let {updateSelectedRow, correspondingPK} = this.props
        isChecked ? updateSelectedRow(correspondingPK) : updateSelectedRow(undefined)
    }

    check() {
        this.state.ref.current.checked = !this.state.ref.current.checked
        this.handleSelect(this.state.ref.current.checked)
    }

    forceUncheck() {
        this.state.ref.current.checked = false
    }

    render () {
        return (
            <div style={{flex: 1, flexDirection: "row", display: "inline-block"}}>
                <div className="custom-control custom-checkbox">
                    <input type="checkbox"
                           className="custom-control-input"
                           ref={this.state.ref}
                           id={this.props.correspondingPK}
                           unselectable={true}
                        />
                        <label className="custom-control-label" htmlFor={this.props.correspondingPK}></label>
                </div>
            </div>)
    }
}

Checkbox.propTypes = {
    correspondingPK: PropTypes.string.isRequired,
    updateSelectedRow : PropTypes.func.isRequired
}
