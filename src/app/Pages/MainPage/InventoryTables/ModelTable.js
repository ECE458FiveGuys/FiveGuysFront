import {Component} from "react";
import TableColumns from "../../../Common/Tables/TableUtils/Columns";
import InventoryTable from "./InventoryTable";
import ModelFields from "../../../../utils/enums";
import ModelRequests from "../../../../controller/requests/model_requests";
import {handleNavClick} from "../../../utils";
import TableUtils from "../../../Common/Tables/TableUtils/table_utils";

export default class ModelTable extends Component {

    constructor(props) {
        super(props)
    }

    parseSearchResults = (results) => {
        results.forEach(result => {
            let model_pk = result[ModelFields.EquipmentModelFields.PK]
            result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] =
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY] === "00:00:00" ?
                "Not Calibratable"
                :
                result[ModelFields.EquipmentModelFields.CALIBRATION_FREQUENCY].split(" ")[0]

            result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES] =
                TableUtils.categoriesToElement(result[ModelFields.EquipmentModelFields.MODEL_CATEGORIES])
            result.clickEvent = () => {handleNavClick("/models/" + model_pk, this.props.history)}
        })
        return results
    }

    render() {
        return (
            <InventoryTable columns={TableColumns.MODEL_COLUMNS}
                            searchFields={ModelFields.EquipmentModelSearchFields}
                            token={this.props.token}
                            user={this.props.user}
                            history={this.props.history}
                            searchRequestFunction={ModelRequests.getModelsWithSearchParams}
                            parseSearchResultsFunction={this.parseSearchResults}/>
        );
    }
}