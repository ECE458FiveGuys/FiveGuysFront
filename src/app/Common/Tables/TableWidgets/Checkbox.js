import React, {Component} from "react";
import PropTypes from "prop-types";

export default class Checkbox extends Component {

    constructor(props) {
        super(props)
    }

    handleSelect(isChecked) {
        let {updateSelectedPK, correspondingPK} = this.props
        isChecked ? updateSelectedPK(correspondingPK) : updateSelectedPK(undefined)
    }

    render () {
        return (
            <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="defaultUnchecked"
                       onChange={e => this.handleSelect(e.target.checked)}/>
            </div>)
    }
}

Checkbox.propTypes = {
    correspondingPK: PropTypes.string.isRequired,
    updateSelectedPK : PropTypes.func.isRequired
}
