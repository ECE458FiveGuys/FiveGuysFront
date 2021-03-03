import {Component} from "react";
import {Select} from "semantic-ui-react";


class SelectInput extends Component{
    render() {
        return(
            // <Fragment>
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    // defaultValue={this.props.defaultValue}
                    isDisabled={false}
                    isLoading={true}
                    isClearable= {true}
                    isRtl={true}
                    isSearchable={true}
                    name="color"
                    // options={this.props.options}
                />
            // </Fragment>
        );
    }
}
export default SelectInput;