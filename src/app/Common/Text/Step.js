import React from "react";
import * as PropTypes from "prop-types";

export default class Step extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let {stepNumber, stepText} = this.props
        return <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                    <div style={{display : "flex", width : 35, height : 35, marginRight : 15, borderRadius : "50%", background : "green", justifyContent : 'center', alignItems: 'center'}}>
                        <b style={{color : "white", fontSize : 22}}>{stepNumber}</b>
                    </div>
                    <h1 className={"h5-responsive"}>
                        {stepText}
                    </h1>
                </div>
    }
}

Step.propTypes = {
    stepNumber : PropTypes.string.isRequired,
    stepText : PropTypes.string.isRequired
}