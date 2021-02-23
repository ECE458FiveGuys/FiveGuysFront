import RequestUtils from "./request_utils";
import {METHODS, URLS} from "../../strings";
import ModelFields from "../../utils/enums";

export default class MiscellaneousRequests{

    static async get_vendors(token, vendor_substring=undefined) {
        let params = {vendor: vendor_substring}
        RequestUtils.remove_empty_fields(params)
        let header = RequestUtils.build_token_header(token)
        let model_data = await RequestUtils.assisted_fetch(URLS.VENDORS,
            METHODS.GET, header, params)
        return model_data
    }
}