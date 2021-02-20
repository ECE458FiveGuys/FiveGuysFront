import {MDBCol, MDBIcon} from "mdbreact";
import {Component} from "react";
import PropTypes from "prop-types";
import Login from "../../../auth/Login";

class SearchBar extends Component {

    constructor(props) {
        super(props)
    }

    render () {
        let {searchValue, setSearchValue} = this.props
        return (
            <MDBCol md="6">
                <form className="form-inline mt-4 mb-4">
                    <MDBIcon icon="search"/>
                    <input className="form-control form-control-sm ml-3 w-75"
                           type="text"
                           placeholder="Search"
                           aria-label="Search"
                           onChange={()=>setSearchValue(searchValue)}
                           value={searchValue}/>
                </form>
            </MDBCol>
        )
    }
}

SearchBar.propTypes = {
    setSearchValue: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired
}

export default SearchBar