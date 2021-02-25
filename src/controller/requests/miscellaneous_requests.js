import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../strings";
import ModelFields from "../../utils/enums";

export default class MiscellaneousRequests{

    static async getVendors(token,
                            vendorSubstring=undefined,
                            callBack = (json) => json,
                            errorMessageCallBack = (errorMessage) => errorMessage) {
        let params = {vendor: vendorSubstring}
        RequestUtils.removeEmptyFields(params)
        let header = RequestUtils.buildTokenHeader(token)
        RequestUtils.assistedFetch(URLS.VENDORS,
            METHODS.GET, callBack, errorMessageCallBack, header, params)
    }
}