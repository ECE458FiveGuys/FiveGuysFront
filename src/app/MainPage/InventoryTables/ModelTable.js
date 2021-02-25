import {Component} from "react";
import TableColumns from "./Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../utils/enums";
import ModelRequests from "../../../controller/requests/model_requests";
import {newTab} from "../../utils";

export default class ModelTable extends Component {

    constructor(props) {
        super(props)
    }

    parseSearchResults = (results) => {
        results.forEach(result => {
            let model_pk = result[ModelFields.EquipmentModelFields.PK]
            result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] =
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] === "00:00:00" ?
                "Noncalibratable"
                :
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY].split(" ")[0]
            result.clickEvent = newTab("/models/" + model_pk)
        })
        return results
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.MODEL_COLUMNS}
                            searchFields={ModelFields.EquipmentModelSearchFields}
                            token={this.props.token}
                            searchRequestFunction={ModelRequests.getModelsWithSearchParams}
                            parseSearchResultsFunction={this.parseSearchResults}/>
        );
    }
}