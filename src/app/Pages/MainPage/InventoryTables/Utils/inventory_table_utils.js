import {PaginatedResponseFields} from "../../../../Common/Tables/TableUtils/pagination_utils";
import RequestUtils from "../../../../../controller/requests/request_utils";
import {METHODS} from "../../../../../controller/strings";
import {Instrument} from "../../../../../utils/ModelEnums";
import InstrumentRequests from "../../../../../controller/requests/instrument_requests";

const MAX_PAGE_SIZE = 1000

export default class InventoryTableUtils {

    // for getting all the instruments selected in the table in select mode

    static getAllSelected = (token, searchRequestFunction, getAllFunction, searchFieldValues, selectAllCheckboxRef, pkToEntriesSelected) =>
        (getAllSelectedCallBack) => {
            let allSelected = selectAllCheckboxRef.current.isChecked()

            let searchAllPagesCallBack = (allSearchedEntries) => {
                let selectedEntries;
                if (allSelected) {
                    pkToEntriesSelected.forEach((isEntrySelected, pk) => {
                        if (!isEntrySelected) delete allSearchedEntries[pk]
                    })
                    selectedEntries = allSearchedEntries
                } else {
                    selectedEntries = []
                    allSearchedEntries.forEach(entry => {
                        if (pkToEntriesSelected.get(entry.pk) == true) {
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

            let getAssetsByPkCallBack = (assetNums) => {
                let instruments = assetNums.map(assetNum => {
                    return {[Instrument.FIELDS.ASSET_TAG] : assetNum}
                })
                getAllSelectedCallBack(instruments)
            }

            if (allSelected && searchFieldValues != {}) {
                searchRequestFunction(token, searchFieldValues, paginatorCallBack, (errorMessage) => alert(errorMessage), undefined, undefined, undefined, MAX_PAGE_SIZE)
            } else if (!allSelected) {
                let selected = []
                Array.from(pkToEntriesSelected.keys()).forEach(pk => {
                    if (pkToEntriesSelected.get(pk)) selected.push(pk)
                })
                InstrumentRequests.getAssetTagsByPK(token, selected, getAssetsByPkCallBack, (errorMessage) => alert(errorMessage))
            } else {
                getAllFunction(token, searchAllPagesCallBack, (errorMessage) => alert(errorMessage))
            }
        }
}