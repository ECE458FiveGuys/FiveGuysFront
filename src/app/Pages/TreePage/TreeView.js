import React, {Component} from "react";
import TreePage from "./TreePage";

class TreeView extends Component{

    render(){
        return(
            <div>
                <TreePage
                    history={this.props.history}
                    user={this.props.user}
                    token={this.props.token}
                />

            </div>
        )
    }
}

export default TreeView