import {PaginatedResponseFields} from "../../../../Common/Tables/TableUtils/pagination_utils";
import RequestUtils from "../../../../../controller/requests/request_utils";
import {METHODS} from "../../../../../controller/strings";


export default class InventoryTableUtils {

    // for getting all the instruments selected in the table in select mode

    static getAllSelected = (token, selectAllCheckboxRef, pkToEntriesSelected, searchRequestFunction) =>
        (getAllSelectedCallBack) => {

            let searchAllPagesCallBack = (allSearchedEntries) => {
                let selectedEntries;
                if (selectAllCheckboxRef.current.isChecked()) {
                    pkToEntriesSelected.forEach((isEntrySelected, pk) => {
                        if (!isEntrySelected) delete allSearchedEntries[pk]
                    })
                    selectedEntries = allSearchedEntries
                } else {
                    selectedEntries = []
                    allSearchedEntries.forEach(entry => {
                        if (pkToEntriesSelected.get(entry.pk)) {
                            selectedEntries.push(entry)
                        }
                    })
                }
                getAllSelectedCallBack(selectedEntries)
            }

            let allEntries = []
            let paginatorCallBack = (json) => {
                Array.prototype.push.apply(allEntries, json[PaginatedResponseFields.RESULTS])
                let nextURL = json[PaginatedResponseFields.NEXT]
                if (nextURL) {
                    RequestUtils.assistedFetch(nextURL, METHODS.GET, paginatorCallBack, (errorMessage) => alert(errorMessage), RequestUtils.buildTokenHeader(token))
                } else {
                    searchAllPagesCallBack(allEntries)
                }
            }
            searchRequestFunction(token, this.state.searchFieldValues, paginatorCallBack, (errorMessage) => alert(errorMessage))
        }
}